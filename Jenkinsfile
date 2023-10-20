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
                    // Run the unit tests in a Docker container
                    script {
                        def dockerImage = 'charsity-backend:latest' 
                        def dockerCommand = 'npm test' 

                        // Create a directory to mount a volume
                        sh "mkdir -p /unit-test-results"
                        sh "chmod 777 /unit-test-results"

                        // Run the tests in the Docker container
                        def exitCode = sh(script: "docker run -v /unit-test-results:/app $dockerImage $dockerCommand", returnStatus: true)
                        
                        // Check the exit code to determine success or failure
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

        stage('Deploy Backend') {
            steps {
                script {
                    def containerName = 'charsity-backend-container'
                    dir('backend') {
                        // Use withCredentials to set environment variables
                        withCredentials([
                            string(credentialsId: 'DATABASE_URI', variable: 'DATABASE_URI'),
                            string(credentialsId: 'NODE_ENV', variable: 'NODE_ENV'),
                            string(credentialsId: 'ACCESS_TOKEN_SECRET', variable: 'ACCESS_TOKEN_SECRET'),
                            string(credentialsId: 'REFRESH_TOKEN_SECRET', variable: 'REFRESH_TOKEN_SECRET'),
                        ]) {
                            // Stop and remove the existing container if it exists
                            sh "docker stop ${containerName} || true"
                            sh "docker rm ${containerName} || true"

                            // Start the new container
                            sh "docker run -d --name ${containerName} --network charsitynetwork -u root -e DATABASE_URI=\"$DATABASE_URI\" -e NODE_ENV=\"$NODE_ENV\" -v /var/run/docker.sock:/var/run/docker.sock -v jenkins-data:/var/jenkins_home -v $HOME:/home -e VIRTUAL_HOST=api.wazpplabs.com -e VIRTUAL_PORT=3500 charsity-backend"
                        }
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
