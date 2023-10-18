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

        stage('OWASP Dependency-Check Vulnerabilities for Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'  // Install frontend dependencies
                }
                script {
                    def scanResults = dependencyCheck additionalArguments: '''-s './' -f 'ALL' --prettyPrint''', odcInstallation: 'OWASP Dependency-Check Vulnerabilities', returnStatus: true
                    if (scanResults != 0) {
                        error "Vulnerabilities found in frontend dependencies."
                    }
                }
                archiveArtifacts artifacts: 'dependency-check-report.xml', allowEmptyArchive: true
            }
        }

        stage('OWASP Dependency-Check Vulnerabilities for Backend') {
            steps {
                dir('backend') {
                    sh 'npm install'  // Install backend dependencies
                }
                script {
                    def scanResults = dependencyCheck additionalArguments: '''-s './' -f 'ALL' --prettyPrint''', odcInstallation: 'OWASP Dependency-Check Vulnerabilities', returnStatus: true
                    if (scanResults != 0) {
                        error "Vulnerabilities found in backend dependencies."
                    }
                }
                archiveArtifacts artifacts: 'dependency-check-report.xml', allowEmptyArchive: true
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
                    // Remove dangling docker images
                    sh 'docker rmi $(docker images -f \'dangling=true\' -q)'
                }
            }
        }
    }
}
