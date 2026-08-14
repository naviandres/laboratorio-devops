# Intellillent — Laboratorio DevOps CI/CD

**Intellillent** es una aplicación web de demostración servida con Express en Node.js.
El repositorio incluye dos pipelines que automatizan el ciclo de desarrollo:

- **CI con GitHub Actions**: valida el código (instalación de dependencias, pruebas y
  análisis estático) ante cada push o pull request sobre la rama `main`.
- **CD con Jenkins**: clona el repositorio, ejecuta las pruebas, construye la imagen Docker
  y la publica en Docker Hub; un stage `Deploy to Kubernetes` despliega la aplicación en un
  entorno agnóstico (Kubernetes u otro) según la configuración del entorno.

## Requisitos

- Node.js 24 y npm.
- Para ejecutar el CD: Docker, acceso a Docker Hub y Jenkins.

## Uso local

```bash
# Instalar dependencias
npm ci

# Ejecutar pruebas
npm test

# Análisis estático
npm run lint

# Iniciar el servidor
npm start
```

La aplicación queda disponible en <http://localhost:3000>.

## Jenkins local (setup)

Pasos para levantar Jenkins en local con Docker y dejarlo listo para ejecutar el pipeline CD del repositorio.

**1. Instalar Jenkins en Docker**

```bash
docker run -d -p 8080:8080 -p 50000:50000 --name jenkins-local ^
  -v jenkins_home:/var/jenkins_home ^
  -v //var/run/docker.sock:/var/run/docker.sock ^
  jenkins/jenkins:lts-jdk17
```

> Nota: `^` es la continuación de línea de Windows PowerShell. En Linux/macOS usar `\`.

**2. Contraseña admin inicial**

```bash
docker exec jenkins-local cat /var/jenkins_home/secrets/initialAdminPassword
```

Probar ingresando en <http://localhost:8080>.

**3. Ingresar al contenedor de Jenkins como root**

```bash
docker ps
docker exec -u 0 -it <nombre_o_id_contenedor_jenkins> bash
```

**4. Asignar permisos al socket de Docker**

```bash
chmod 666 /var/run/docker.sock
```

**5. Descargar e instalar la versión estable de kubectl dentro del contenedor**

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
mv kubectl /usr/local/bin/
chmod 755 /usr/local/bin/kubectl
```

**6. Validar la instalación**

```bash
kubectl version --client
```

**7. Instalar plugins en Jenkins**

En <http://localhost:8080/manage/pluginManager/> instalar los plugins:

- Pipeline
- Git
- Credentials Binding
- Docker Pipeline
- NodeJS plugin

**8. Configurar Tools**

En <http://localhost:8080/manage/configureTools/>:

- Nombre: Node24
- Versión: Node24

**9. Agregar Credentials dockerhub**

En <http://localhost:8080/manage/credentials/>:

- credentialsId: `dockerhub-credentials`
- scope: global
- username del Docker Hub
- password = personal access token con permisos Read, Write, Delete

**10. Crear Pipeline job**

En <http://localhost:8080/view/all/newJob>:

- Pipeline desde SCM
- SCM = git
- URL = <https://github.com/naviandres/laboratorio-devops>
- Credenciales: las creadas en el paso 9
- Branch Specifier: `*/main`
- Script Path: `Jenkinsfile`

## Estructura

```
├── server.js                # Servidor Express
├── public/                  # Frontend estático
├── test/                    # Pruebas automatizadas (Jest)
├── Dockerfile               # Imagen Docker
├── Jenkinsfile              # Pipeline CD (Jenkins)
├── .github/workflows/ci.yml # Pipeline CI (GitHub Actions)
└── eslint.config.js         # Configuración de ESLint
```

## Enlaces

- Repositorio: <https://github.com/naviandres/laboratorio-devops>
- Documentación técnica: [DOCUMENTACION_TECNICA.md](DOCUMENTACION_TECNICA.md)
