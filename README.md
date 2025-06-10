# Administrador de Tareas

Esta aplicación permite gestionar tareas personales desde una interfaz web construida con **Next.js** y **TypeScript**. Incluye funcionalidades para crear, editar y eliminar tareas, asignar categorías, filtrar por estado y visualizar estadísticas.

El proyecto demuestra el uso de tres paradigmas de programación:

- **Orientado a Objetos**: clases `Task` y `Category` modelan las entidades principales.
- **Funcional**: utilidades como `filterByStatus`, `filterByCategory` o `percentageCompleted` usan funciones de orden superior.
- **Procedural**: la API en `src/app/api/tasks` implementa funciones simples para manipular los archivos de datos.

## Estructura

- `my-app/` – aplicación web Next.js
- `my-app/data/` – almacena datos en formato JSON

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

Abrir `http://localhost:3000` en el navegador.

## Herramientas

- [Next.js](https://nextjs.org/) + React
- TypeScript
- Node.js
