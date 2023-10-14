pipeline {
    agent any

    stages {

        // Github Webhooks Trigger

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

        stage('Test') {
            steps {
                sh 'echo "Running tests..."'
                // Add your test commands here
            }
        }

        stage('Deploy Frontend') {
            steps {
                script {
                    def containerName = 'charsity-frontend-container'
                    dir('frontend') {
                        // Use withCredentials to set environment variables
                        withCredentials([
                            string(credentialsId: 'NODE_ENV', variable: 'NODE_ENV'),
                        ]) {
                            // Stop and remove the existing container if it exists
                            sh "docker stop ${containerName} || true"
                            sh "docker rm ${containerName} || true"

                            // Start the new container
                            sh "docker run -d --name ${containerName} -u root -e NODE_ENV=\"$NODE_ENV\"  -v /var/run/docker.sock:/var/run/docker.sock -v jenkins-data:/var/jenkins_home -v $HOME:/home -e VIRTUAL_HOST=wazpplabs.com -e VIRTUAL_PORT=3000 charsity-frontend"
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
                            sh "docker run -d --name ${containerName} -u root -e DATABASE_URI=\"$DATABASE_URI\" -e NODE_ENV=\"$NODE_ENV\" -v /var/run/docker.sock:/var/run/docker.sock -v jenkins-data:/var/jenkins_home -v $HOME:/home -e VIRTUAL_HOST=api.wazpplabs.com -e VIRTUAL_PORT=3500 charsity-backend"
                        }
                    }
                }
            }
        }
    }
}
