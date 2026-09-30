# Amigos Unidos integrado

Este paquete reúne el sitio original de Amigos Unidos con la aplicación AmigosU. Al seleccionar “IA Ayudante” en el sitio, se abre la aplicación AmigosU en el mismo servidor.

## Iniciar

Requiere Node.js y npm.

1. Abre una terminal en esta carpeta.
2. Instala dependencias con `npm install`.
3. Copia `.env.example` a `.env` y configura `GEMINI_API_KEY` para habilitar las respuestas con Gemini.
4. Inicia con `npm run dev`.
5. Abre `http://localhost:3000/sitio/` para el sitio original. El enlace “IA Ayudante” abre AmigosU en `http://localhost:3000/`.

Para preparar el servidor de producción, ejecuta `npm run build` y después `npm start`. La aplicación escucha en el puerto 3000.

## Contenido

- `src/` y `server.ts`: aplicación AmigosU y su API.
- `public/sitio/`: páginas y recursos originales de Amigos Unidos.
- `README-INTEGRACION.md`: estas instrucciones.
