# Administrador de Tareas

Esta aplicación permite gestionar tareas personales desde una interfaz web construida con **Next.js** y **TypeScript**. Incluye funcionalidades para crear, editar y eliminar tareas, asignar categorías, filtrar por estado y visualizar estadísticas.

El proyecto demuestra el uso de tres paradigmas de programación:

- **Orientado a Objetos**: clases `Task` y `Category` modelan las entidades principales.
- **Funcional**: utilidades como `filterByStatus`, `filterByCategory` o `percentageCompleted` usan funciones de orden superior.
- **Procedural**: se proporciona un pequeño script de línea de comandos en `my-app/scripts/cli.js` con funciones simples para gestionar un menú y leer/escribir archivos.

## Estructura

- `my-app/` – aplicación web Next.js
- `my-app/scripts/cli.js` – script de consola
- `my-app/data/` – almacena datos del script CLI

## Ejecución

1. Instalar dependencias y ejecutar la aplicación web:

```bash
cd my-app
npm install
npm run dev
```

Abrir `http://localhost:3000` en el navegador.

2. Ejecutar el script de consola (opcional):

```bash
npm run cli
```

## Herramientas

- [Next.js](https://nextjs.org/) + React
- TypeScript
- Node.js

