pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'echo "Building the project..."'
                // Add your build commands here
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
                        sh 'docker build -t charsity-frontend .'

                        // Check if the container exists before stopping and removing it
                        if (sh(script: "docker ps -a --format '{{.Names}}' | grep -E '^${containerName}$'", returnStatus: true) == 0) {
                            sh "docker stop ${containerName}"
                            sh "docker rm ${containerName}"
                        }

                        // Start the new container
                        sh "docker run -d --name ${containerName} -u root -v /var/run/docker.sock:/var/run/docker.sock -v jenkins-data:/var/jenkins_home -v $HOME:/home -e VIRTUAL_HOST=wazpplabs.com -e VIRTUAL_PORT=3000 charsity-frontend"
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
                        ]) {
                            sh 'docker build -t charsity-backend .'

                            // Check if the container exists before stopping and removing it
                            if (sh(script: "docker ps -a --format '{{.Names}}' | grep -E '^${containerName}$'", returnStatus: true) == 0) {
                                sh "docker stop ${containerName}"
                                sh "docker rm ${containerName}"
                            }

                            // Start the new container
                            sh "docker run -d --name ${containerName} -u root -e DATABASE_URI=\"$DATABASE_URI\" -e NODE_ENV=\"$NODE_ENV\" -v /var/run/docker.sock:/var/run/docker.sock -v jenkins-data:/var/jenkins_home -v $HOME:/home -e VIRTUAL_HOST=api.wazpplabs.com -e VIRTUAL_PORT=3500 charsity-backend"
                        }
                    }
                }
            }
        }
    }
}
