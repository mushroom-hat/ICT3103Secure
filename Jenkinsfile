pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'echo "Building the project..."'
            }
        }

        stage('Test') {
            steps {
                sh 'echo "Running tests..."'
            }
        }

        stage('Deploy'){
            steps {
                sh 'cd frontend'
                sh 'docker build -t charsity-frontend .'
                sh 'docker run -d --rm -u root -v /var/run/docker.sock:/var/run/docker.sock -v jenkins-data:/var/jenkins_home -v "$HOME":/home -e VIRTUAL_HOST=wazpplabs.com -e VIRTUAL_PORT=3000 charsity-frontend'

                sh 'cd ../backend'
                sh 'docker build -t charsity-backend .'
                sh 'docker run -d --rm -u root -v /var/run/docker.sock:/var/run/docker.sock -v jenkins-data:/var/jenkins_home -v "$HOME":/home -e VIRTUAL_HOST=api.wazpplabs.com -e VIRTUAL_PORT=3500 charsity-backend'
            }
        }
    }
}