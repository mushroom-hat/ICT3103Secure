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

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    // Set environment variables for Docker Compose
                    def envVars = [
                        "DATABASE_URI=${DATABASE_URI}",
                        "NODE_ENV=${NODE_ENV}",
                    ]
                    
                    // Path to your Docker Compose file
                    def composeFilePath = './docker-compose.yml'

                    // Build and start services with Docker Compose
                    sh "docker-compose -f ${composeFilePath} up -d --build ${envVars.join(' ')}"
                }
            }
        }
    }
}
