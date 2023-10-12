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
                dir('frontend') {
                    sh 'docker build -t charsity-frontend .'
                    sh 'docker run -d --rm -u root -v /var/run/docker.sock:/var/run/docker.sock -v jenkins-data:/var/jenkins_home -v "$HOME":/home -e VIRTUAL_HOST=wazpplabs.com -e VIRTUAL_PORT=3000 charsity-frontend'
                }
            }
        }

        stage('Deploy Backend') {
            steps {
                dir('backend') {
                    // Use withCredentials to set environment variables
                    withCredentials([
                        string(credentialsId: 'DATABASE_URI', variable: 'DATABASE_URI'),
                        string(credentialsId: 'NODE_ENV', variable: 'NODE_ENV'),
                    ]) {
                        sh 'docker build -t charsity-backend .'
                        sh 'docker run -d --rm -u root -e DATABASE_URI="$DATABASE_URI" -e NODE_ENV="$NODE_ENV" -v /var/run/docker.sock:/var/run/docker.sock -v jenkins-data:/var/jenkins_home -v "$HOME":/home -e VIRTUAL_HOST=api.wazpplabs.com -e VIRTUAL_PORT=3500 charsity-backend'
                    }
                }
            }
        }
    }
    
}