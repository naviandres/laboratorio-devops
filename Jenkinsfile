// ============================================================================
// Jenkinsfile — Pipeline CD declarative (entregable: Git + Docker + Kubernetes)
//
// Flujo: clonar el repositorio -> test -> construir imagen Docker -> publicar
// en DockerHub -> desplegar a Kubernetes/entorno agnóstico.
//
// Convenciones del laboratorio (docs/conventions.md):
//   - Jenkinsfile declarative con un stage por etapa del CD.
//   - Credenciales vía el credential store de Jenkins (nunca literales).
//   - Tag versionado (BUILD_NUMBER) para producción; `latest` solo como alias
//     práctico de desarrollo.
//   - Despliegue parametrizado por variables de entorno (entorno agnóstico).
// ============================================================================

pipeline {

    agent any

    tools {
        nodejs 'Node24'
    }

    environment {
        IMAGE_NAME = 'naviandres/laboratorio-devops'
        IMAGE_TAG  = "${BUILD_NUMBER}"

        // Parámetros del despliegue (entorno agnóstico/k8s).
        // Tienen default para que el pipeline sea ejecutable sin configuración
        // previa; pueden sobrescribirse en el job de Jenkins.
        KUBE_NAMESPACE = 'default'
        K8S_DEPLOYMENT = 'laboratorio-devops'
        K8S_MANIFESTS  = 'k8s/'
    }

    stages {

        // 1. Clone Repository: garantiza que el pipeline trabaja sobre la
        //    revisión exacta configurada en el job (checkout scm). Es la base
        //    de todos los stages siguientes.
        stage('Clone Repository') {
            steps {
                checkout scm
            }
        }

        // 2. Test: valida que la app compila y pasa la suite antes de
        //    construir la imagen; evita publicar artefactos rotos.
        stage('Test') {
            steps {
                sh 'node -v'
                sh 'npm ci'
                sh 'npm test --if-present'
            }
        }

        // 3. Build Docker Image: empaqueta la app en una imagen reproducible y
        //    portable. Se etiqueta con BUILD_NUMBER (tag versionado, usado en
        //    producción) y con `latest` como alias de conveniencia para
        //    desarrollo; producción siempre usa el tag versionado.
        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest ."
            }
        }

        // 4. Publish Image: publica la imagen en DockerHub para que el cluster
        //    pueda descargarla al desplegar. Las credenciales se leen del
        //    credential store de Jenkins (dockerhub-credentials).
        stage('Publish Image') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    sh '''
                        echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
                        docker push ${IMAGE_NAME}:${IMAGE_TAG}
                        docker push ${IMAGE_NAME}:latest
                    '''
                }
            }
        }

        // 5. Deploy to Kubernetes: despliega la imagen en Kubernetes o entorno
        //    agnóstico. Aplica los manifiestos (k8s/) si existen y, en cualquier
        //    caso, actualiza la imagen del Deployment existente con el tag
        //    versionado y espera a que el rollout termine.
        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl version --client'
                sh '''
                    set -e
                    if [ -d "${K8S_MANIFESTS}" ]; then
                        kubectl apply -f ${K8S_MANIFESTS} -n ${KUBE_NAMESPACE}
                    fi
                    kubectl set image deployment/${K8S_DEPLOYMENT} ${K8S_DEPLOYMENT}=${IMAGE_NAME}:${IMAGE_TAG} -n ${KUBE_NAMESPACE}
                    kubectl rollout status deployment/${K8S_DEPLOYMENT} -n ${KUBE_NAMESPACE}
                '''
            }
        }
    }
}
