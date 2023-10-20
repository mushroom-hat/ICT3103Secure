// Define common environment variables
def commonEnvVars = [
    ['DATABASE_URI', 'DATABASE_URI'],
    ['NODE_ENV', 'NODE_ENV'],
    ['ACCESS_TOKEN_SECRET', 'ACCESS_TOKEN_SECRET'],
    ['REFRESH_TOKEN_SECRET', 'REFRESH_TOKEN_SECRET']
]

// Define a reusable function to run Docker commands
def runDockerCommand(String containerName, String dockerImage, String dockerCommand) {
    sh "docker stop ${containerName} || true"
    sh "docker rm ${containerName} || true"
    sh "docker run -d --name ${containerName} --network charsitynetwork -u root -e DATABASE_URI=\"$DATABASE_URI\" -e NODE_ENV=\"$NODE_ENV\" -v /var/run/docker.sock:/var/run/docker.sock -v jenkins-data:/var/jenkins_home -v $HOME:/home -e VIRTUAL_HOST=api.wazpplabs.com -e VIRTUAL_PORT=3500 $dockerImage"
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
                    sh 'docker build -t charsity-backend .'
                }
            }
        }


        stage('Scan Docker Images for Vulnerabilities') {
            steps {
                script {
                    // Create a directory to store scan results
                    sh "mkdir -p /trivy-scan-results"
                    sh "chmod 777 /trivy-scan-results"

                    // Scan the frontend Docker image and save results in the Jenkins workspace
                    sh "docker run -v /var/run/docker.sock:/var/run/docker.sock -v /trivy-scan-results:/trivy-scan-results aquasec/trivy image -o /trivy-scan-results/frontend.json charsity-frontend"

                    // Scan the backend Docker image and save results in the Jenkins workspace
                    sh "docker run -v /var/run/docker.sock:/var/run/docker.sock -v /trivy-scan-results:/trivy-scan-results aquasec/trivy image -o /trivy-scan-results/backend.json charsity-backend"

                }
            }
        }

        stage('Run unit tests') {
            steps {
                dir('backend') {
                    script {
                        def dockerImage = 'charsity-backend'
                        def dockerCommand = 'npm test'

                        // Create a directory to mount a volume
                        sh "mkdir -p /unit-test-results"
                        sh "chmod 777 /unit-test-results"

                        // Use the environment variables
                        withCredentials(commonEnvVars) {
                            // Run the tests in the Docker container
                            def exitCode = sh(script: "docker run -v -e DATABASE_URI=\"$DATABASE_URI\" -e NODE_ENV=\"$NODE_ENV\" /unit-test-results:/app $dockerImage $dockerCommand", returnStatus: true)

                            if (exitCode == 0) {
                                currentBuild.result = 'SUCCESS'
                            } else {
                                currentBuild.result = 'FAILURE'
                                error("Unit tests failed. See the build logs for details.")
                            }
                        }
                    }
                }
            }
        }

        stage('Deploy Backend') {
            steps {
                script {
                    def containerName = 'charsity-backend-container'
                    def dockerImage = 'charsity-backend'

                    withCredentials(commonEnvVars) {
                        runDockerCommand(containerName, dockerImage, dockerCommand)
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

        stage('Cleanup'){
            steps {
                    script {
                        def danglingImages = sh(script: 'docker images -f "dangling=true" -q', returnStdout: true).trim()
                        if (danglingImages) {
                            sh "docker rmi $danglingImages"
                        } else {
                            echo "No dangling images to remove."
                        }
                }
            }
        }
    }
}
