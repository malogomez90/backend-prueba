# Backend de Prueba

Este es un proyecto de backend simple para pruebas con funcionalidad de keylogger web.

## Estructura del Proyecto

```
backend-prueba/
├── src/
│   └── server.js          # Servidor Express principal
├── public/
│   ├── index.html         # Página principal
│   ├── keylogger.html     # Demo del keylogger
│   └── script.js          # Scripts del frontend
├── package.json           # Configuración del proyecto
├── README.md             # Este archivo
└── datos.txt             # Archivo donde se guardan los datos capturados
```

## Instalación y Uso

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Iniciar el servidor:
   ```bash
   npm start
   ```

3. Abrir en el navegador: `http://localhost:3000`

## Funcionalidades

- **Servidor Express**: Backend con rutas para captura de datos
- **Keylogger Web**: Demo de captura de teclas del teclado
- **Visualización de datos**: Endpoint para ver los datos capturados
- **Archivos estáticos**: Servido desde la carpeta `public`

## API Endpoints

- `GET /` - Página principal
- `POST /captura` - Capturar datos del keylogger
- `GET /ver-keylogger` - Ver datos capturados

## Notas de Desarrollo

- Usar `npm run dev` para desarrollo
- Los archivos estáticos se sirven desde `/public`
- Los datos se guardan en `datos.txt`