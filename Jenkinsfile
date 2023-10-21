def commonEnvironment = [
    string(credentialsId: 'DATABASE_URI', variable: 'DATABASE_URI'),
    string(credentialsId: 'ACCESS_TOKEN_SECRET', variable: 'ACCESS_TOKEN_SECRET'),
    string(credentialsId: 'REFRESH_TOKEN_SECRET', variable: 'REFRESH_TOKEN_SECRET'),
]

def cleanAndStartBackendContainer(containerName, imageName) {
    stopAndRemoveContainer(${containerName})

    withCredentials(commonEnvironment) {
        // Start the container for running tests
        sh """
            docker run -d --name ${containerName} --network charsitynetwork -u root \
            -e REFRESH_TOKEN_SECRET="\${REFRESH_TOKEN_SECRET}" \
            -e ACCESS_TOKEN_SECRET="\${ACCESS_TOKEN_SECRET}" \
            -e DATABASE_URI="\${DATABASE_URI}" \
            -v /var/run/docker.sock:/var/run/docker.sock -v jenkins-data:/var/jenkins_home -v $HOME:/home \
            -e VIRTUAL_HOST=api.wazpplabs.com -e VIRTUAL_PORT=3500 ${imageName}
        """
        }
}

def stopAndRemoveContainer(containerName) {
    sh "docker stop ${containerName} || true"
    sh "docker rm -f ${containerName}"
}


pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                dir('frontend') {
                    sh 'docker build -t charsity-frontend .'
                }
                dir('backend') {
                    
                    // Build the Docker image for testing 
                    sh 'docker build -t charsity-backend-test --progress=plain --no-cache --target test .'
                    // Build the Docker image for production 
                    sh 'docker build -t charsity-backend --target prod .'
                }
            }
        }


        // stage('Scan Docker Images for Vulnerabilities') {
        //     steps {
        //         script {
        //             // Create a directory to store scan results
        //             sh "mkdir -p /trivy-scan-results"
        //             sh "chmod 777 /trivy-scan-results"

        //             // Scan the frontend Docker image and save results in the Jenkins workspace
        //             sh "docker run -v /var/run/docker.sock:/var/run/docker.sock -v /trivy-scan-results:/trivy-scan-results aquasec/trivy image -o /trivy-scan-results/frontend-dependency-scan.json charsity-frontend"

        //             // Scan the backend Docker image and save results in the Jenkins workspace
        //             sh "docker run -v /var/run/docker.sock:/var/run/docker.sock -v /trivy-scan-results:/trivy-scan-results aquasec/trivy image -o /trivy-scan-results/backend-dependency-scan.json charsity-backend"

        //         }
        //     }
        // }

        stage('Unit Test Backend') {
            steps {
                script {
                    dir('backend') {
                        def containerName = 'backend-test-container'
                        cleanAndStartBackendContainer(containerName, 'charsity-backend-test')

                        // run test on container, exit with status code
                        def testExitCode = sh(script: "docker exec ${containerName} npm test", returnStatus: true)
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
        }


        stage('Deploy Backend') {
            steps {
                script {
                    def containerName = 'charsity-backend-container'
                    
                    dir('backend') {
                        def containerName = 'charsity-backend-container'
                        cleanAndStartBackendContainer(containerName, 'charsity-backend')
                    }
                }
            }
        }
    


        stage('Deploy Frontend') {
            steps {
                script {
                    def containerName = 'charsity-frontend-container'
                    def backendContainerName = 'charsity-backend-container'
                    def backendAPI = 'api.wazpplabs.com'
                    dir('frontend') {
                        // Stop and remove the existing container if it exists
                        sh "docker stop ${containerName} || true"
                        sh "docker rm ${containerName} || true"

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
                }
            }
        }
    }
}
