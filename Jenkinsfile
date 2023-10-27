pipeline {
    agent any

    environment {
        DATABASE_URI = credentials('DATABASE_URI')
        ACCESS_TOKEN_SECRET = credentials('ACCESS_TOKEN_SECRET')
        REFRESH_TOKEN_SECRET = credentials('REFRESH_TOKEN_SECRET')
        SECRET_KEY = credentials('SECRET_KEY')
        RECAPTCHA_SECRET_KEY = credentials('RECAPTCHA_SECRET_KEY')

    }

    stages {
        stage('SonarCloud Code Scan') {
            steps {
                script {
                    def nodeTool = tool name: 'NodeJS', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
                    withSonarQubeEnv('SonarCloud') {
                        def scannerTool = tool name: 'SonarScanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
                        withEnv(["PATH+NODEJS=${nodeTool}/bin", "PATH+SONAR=${scannerTool}/bin"]) {
                            sh 'node -v'  // Check Node.js version (optional)
                            sh 'sonar-scanner -Dsonar.projectKey=mushroom-hat_ICT3103Secure -Dsonar.organization=charsity -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info'
                        }
                    }
                } 
            }
        }
        // stage("SonarCloud Quality Gate"){
        //     timeout(time: 1, unit: 'HOURS') { // Just in case something goes wrong, pipeline will be killed after a timeout
        //         def qg = waitForQualityGate() // Reuse taskId previously collected by withSonarQubeEnv
        //         if (qg.status != 'OK') {
        //         error "Pipeline aborted due to quality gate failure: ${qg.status}"
        //         }
        //     }
        // }

        stage('Build-Test') {
            steps {
                dir('backend') {
                    script {
                        // Build the Docker image for testing
                        sh 'docker build -t charsity-backend-test --progress=plain --no-cache --target test .'
                    }
                }
            }
        }
        
        // stage('Scan Docker Images for Vulnerabilities') {
        //     steps {
        //         script {
        //             // Stop and remove containers to save space
        //             stopAndRemoveContainer('charsity-frontend-container')
        //             stopAndRemoveContainer('charsity-backend-container')

        //             // Create a directory to store scan results
        //             sh "mkdir -p /trivy-scan-results"
        //             sh "chmod 777 /trivy-scan-results"

        //             // Scan the frontend Docker image and save results in the Jenkins workspace
        //             sh "docker run --memory 3g -v /var/run/docker.sock:/var/run/docker.sock -v /trivy-scan-results:/trivy-scan-results aquasec/trivy image --scanners vuln --skip-dirs --skip-files -o /trivy-scan-results/frontend-dependency-scan.json charsity-frontend"

        //             // Scan the backend Docker image and save results in the Jenkins workspace
        //             sh "docker run --memory 3g -v /var/run/docker.sock:/var/run/docker.sock -v /trivy-scan-results:/trivy-scan-results aquasec/trivy image --scanners vuln --skip-dirs --skip-files -o /trivy-scan-results/backend-dependency-scan.json charsity-backend"

        //         }
        //     }
        // }
        
        stage('Unit Test Backend') {
            steps {
                script {
                    def containerName = 'backend-test-container'
                    def imageName = 'charsity-backend-test'
                    def testExitCode
                    dir('backend') {
                        cleanAndStartBackendContainer(  containerName, imageName)

                        // run test on container, exit with status code
                        testExitCode = sh(script: "docker exec ${containerName} npm test", returnStatus: true)
                        echo "Test exit code: ${testExitCode}"
                        if (testExitCode != 0) {
                            currentBuild.result = 'FAILURE'
                            error("Unit tests failed. See the build logs for details.")
                        }

                        stopAndRemoveContainer(containerName)
                    }
                }
            }
        }

        
        stage('Build-Prod') {
            steps {
                dir('frontend') {
                    sh 'docker build -t charsity-frontend .'
                }
                dir('backend') {
                    script {
                        // Build the Docker image for production
                        sh 'docker build -t charsity-backend --target prod .'
                    }
                }
            }
        }

        stage('Deploy Backend') {
            steps {
                script {
                    def containerName = 'charsity-backend-container'
                    def imageName = 'charsity-backend'
                    dir('backend') {
                        cleanAndStartBackendContainer(containerName, imageName)
                    }
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                script {
                    def containerName = 'charsity-frontend-container'
                    dir('frontend') {
                        // Stop and remove the existing container if it exists
                        stopAndRemoveContainer(containerName)
                        
                        // Start the new container, and specify production environment
                        sh "docker run -d --name ${containerName} --network charsitynetwork --env-file .env.production -u root -v /var/run/docker.sock:/var/run/docker.sock -v jenkins-data:/var/jenkins_home -v $HOME:/home -e VIRTUAL_HOST=wazpplabs.com -e VIRTUAL_PORT=3000 charsity-frontend"
                    }
                }
            }
        }

        stage('Cleanup') {
            steps {
                script {
                    // Remove dangling images
                    def danglingImages = sh(script: 'docker images -f "dangling=true" -q', returnStdout: true).trim()
                    if (danglingImages) {
                        def imagesID = danglingImages.tokenize("\n")
                        for (def imageID in imagesID) {
                            sh "docker rmi $imageID"
                        }
                    } else {
                        echo "No dangling images to remove."
                    }

                    // Remove all exited containers
                    def exitedContainers = sh(script: 'docker ps -q -a -f "status=exited"', returnStdout: true).trim()
                    if (exitedContainers) {
                        def containerIds = exitedContainers.tokenize("\n")
                        for (def containerId in containerIds) {
                            sh "docker rm $containerId"
                        }
                    } else {
                        echo "No exited containers to remove."
                    }

                    // Remove unused volumes
                    sh "docker system prune -f"
                }
            }
        }
    }
}


def cleanAndStartBackendContainer(containerName, imageName) {
    stopAndRemoveContainer(containerName)
    
    sh '''
    docker run -d --name ''' + containerName + ''' --network charsitynetwork -u root \
    -e REFRESH_TOKEN_SECRET="${REFRESH_TOKEN_SECRET}" \
    -e ACCESS_TOKEN_SECRET="${ACCESS_TOKEN_SECRET}" \
    -e DATABASE_URI="${DATABASE_URI}" \
    -e SECRET_KEY="${SECRET_KEY}" \
    -e RECAPTCHA_SECRET_KEY="${RECAPTCHA_SECRET_KEY}" \
    -v /var/run/docker.sock:/var/run/docker.sock -v jenkins-data:/var/jenkins_home -v $HOME:/home \
    -e VIRTUAL_HOST=api.wazpplabs.com -e VIRTUAL_PORT=3500 ''' +  imageName

}

def stopAndRemoveContainer(containerName) {
    sh "docker stop ${containerName} || true"
    sh "docker rm -f ${containerName}" 
}