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
