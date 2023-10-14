pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                dir('frontend') {
                    sh 'docker build -t charsity-frontend . --no-cache'
                }
                dir('backend') {
                    sh 'docker build -t charsity-backend . --no-cache'
                }
            }
        }

        stage('Test') {
            steps {
                sh 'echo "Running tests..."'
                // Add your test commands here
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

                        // Get the IP address of the backend container
                        def backendIp = sh(script: "docker inspect -f '{{.NetworkSettings.Networks.charsitynetwork.IPAddress}}' ${backendContainerName}", returnStdout: true).trim()

                        // Start the new container, and specify production environment
                        sh "docker run -d --name ${containerName} --network charsitynetwork --env-file .env.production -u root -v /var/run/docker.sock:/var/run/docker.sock -v jenkins-data:/var/jenkins_home -v $HOME:/home -e VIRTUAL_HOST=wazpplabs.com -e VIRTUAL_PORT=3000 charsity-frontend"

                        // Modify the /etc/hosts file within the frontend container to add an entry for the backend
                        sh "docker exec ${containerName} sh -c 'echo \"${backendIp} ${backendAPI}\" >> /etc/hosts'"
                    }
                }
            }
        }

        stage('Cleanup'){
            steps {
                script {
                    // Remove dangling docker images
                    sh "docker rmi $(docker images -f 'dangling=true' -q)"
                }
            }
        }
    }
}
