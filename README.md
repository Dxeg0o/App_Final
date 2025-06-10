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
```

Abrir `http://localhost:3000` en el navegador.

## Herramientas

- [Next.js](https://nextjs.org/) + React
- TypeScript
- Node.js
