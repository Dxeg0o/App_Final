# Administrador de Tareas

Esta aplicación permite gestionar tareas personales desde una interfaz web construida con **Next.js** y **TypeScript**. Incluye funcionalidades para crear, editar y eliminar tareas, asignar categorías, filtrar por estado y visualizar estadísticas.

El proyecto demuestra el uso de tres paradigmas de programación:

- **Orientado a Objetos**: clases `Task` y `Category` modelan las entidades principales.
- **Funcional**: utilidades como `filterByStatus`, `filterByCategory` o `percentageCompleted` usan funciones de orden superior.
- **Procedural**: la API en `src/app/api/tasks` implementa funciones simples para manipular los archivos de datos.

## Estructura

- `my-app/` – aplicación web Next.js
- `my-app/data/` – (obsoleto) datos antiguos en JSON

## API

La API expone los siguientes endpoints:

- `GET /api/tasks` – lista todas las tareas
- `POST /api/tasks` – crea una nueva tarea (recibe `title`, `status` y `category`)
- `GET /api/tasks/:id` – obtiene una tarea específica
- `PUT /api/tasks/:id` – actualiza una tarea
- `DELETE /api/tasks/:id` – elimina una tarea

## Ejecución

1. Instalar dependencias y ejecutar la aplicación web:

```bash
cd my-app
npm install
npm run dev
```

Antes de iniciar, cree un archivo `.env.local` dentro de `my-app` con la cadena de conexión a MongoDB:

```bash
MONGODB_URI="mongodb+srv://dsolerolguin:<db_password>@cluster0.1zeyvn9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
AUTH0_DOMAIN="<tu-dominio>.auth0.com"
AUTH0_CLIENT_ID="<tu-client-id>"
AUTH0_CLIENT_SECRET="<tu-client-secret>"
AUTH0_SECRET="<secreto-largo>"
APP_BASE_URL="http://localhost:3000"
AUTH0_SCOPE="openid profile email"
AUTH0_AUDIENCE=""
SIGN_IN_RETURN_TO_PATH="/dashboard"
```

Abrir `http://localhost:3000` en el navegador.

Al abrir la aplicación, utiliza el enlace **Iniciar sesión** para autenticarte mediante Auth0. Tras completar el proceso se te redirigirá automáticamente al tablero de tareas.

## Herramientas

- [Next.js](https://nextjs.org/) + React
- TypeScript
- Node.js
