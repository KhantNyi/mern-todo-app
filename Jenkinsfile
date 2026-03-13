pipeline {
    agent any

    environment {
        IMAGE_REPOSITORY = 'finead-todo-app'
        IMAGE_TAG = 'latest'
        DOCKERFILE_PATH = 'Dockerfile'
    }

    stages {
        stage('Build') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                dir('TODO/todo_backend') {
                    sh 'npm install'
                }
                dir('TODO/todo_frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Containerise') {
            steps {
                sh 'docker build -t ${IMAGE_REPOSITORY}:${IMAGE_TAG} -f ${DOCKERFILE_PATH} .'
            }
        }

        stage('Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_PASSWORD')]) {
                    sh '''
                        docker tag ${IMAGE_REPOSITORY}:${IMAGE_TAG} ${DOCKERHUB_USERNAME}/${IMAGE_REPOSITORY}:${IMAGE_TAG}
                        echo "${DOCKERHUB_PASSWORD}" | docker login -u "${DOCKERHUB_USERNAME}" --password-stdin
                        docker push ${DOCKERHUB_USERNAME}/${IMAGE_REPOSITORY}:${IMAGE_TAG}
                        docker logout
                    '''
                }
            }
        }

        stage('Deployment Command') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_PASSWORD')]) {
                    sh '''
                        echo "docker run --rm -p 8080:5000 -e MONGODB_URI=<your-mongodb-uri> ${DOCKERHUB_USERNAME}/${IMAGE_REPOSITORY}:${IMAGE_TAG}"
                    '''
                }
            }
        }
    }
}