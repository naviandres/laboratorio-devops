pipeline {

    agent any

    tools {
        nodejs 'Node24'
    }

    environment {
        IMAGE_NAME = 'naviandres/laboratorio-devops'
        IMAGE_TAG  = "${BUILD_NUMBER}"
    }

    stages {

        stage('Test') {
            steps {
                sh 'node -v'
                sh 'npm ci'
                sh 'npm test --if-present'
            }
        }

        stage('Docker Build') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    sh """
                        echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
                        docker push ${IMAGE_NAME}:${IMAGE_TAG}
                        docker push ${IMAGE_NAME}:latest
                    """
                }
            }
        }
    }
}