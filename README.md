# 🛠️ Backend de Prueba - Demo Hub

Proyecto de backend con múltiples demostraciones de técnicas de captura de datos web para propósitos educativos y de testing de seguridad.

## 🏗️ Arquitectura del Proyecto

```
backend-prueba/
├── app.js                 # 🚀 Servidor Express principal (autocontenido)
├── package.json           # 📦 Configuración del proyecto
├── render.yaml           # ☁️ Configuración para Render
├── README.md             # 📖 Este archivo
├── public/               # 🌐 Frontend - Archivos estáticos
│   ├── index.html        # 🏠 Hub principal con navegación
│   ├── keylogger.html    # ⌨️ Demo captura de teclas
│   ├── clipboard-capture.html  # 📋 Demo captura portapapeles
│   ├── phishing.html     # 🎣 Demo formulario phishing
│   ├── form-manipulation.html  # 📝 Demo manipulación formularios
│   ├── config.js         # ⚙️ Configuración URLs
│   └── script.js         # 📜 Scripts auxiliares
└── datos.txt             # 💾 Datos capturados (generado automáticamente)
```

## 🌍 URLs de Despliegue

- **Frontend (Netlify)**: `https://papadelta2.netlify.app/`
- **Backend (Render)**: `https://backend-prueba-o523.onrender.com`

## 🚀 Instalación y Uso

### Local Development
```bash
# 1. Clonar repositorio
git clone https://github.com/malogomez90/backend-prueba.git
cd backend-prueba

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor
npm start

# 4. Abrir navegador
http://localhost:3000
```

### Producción
- **Backend**: Automáticamente desplegado en Render
- **Frontend**: Automáticamente desplegado en Netlify

## 🎯 Funcionalidades

### 🖥️ Backend (app.js)
- **Servidor Express** autocontenido
- **CORS** configurado para Netlify
- **Manejo robusto de errores**
- **Logs detallados** para diagnóstico
- **Endpoints RESTful** para captura de datos

### 🌐 Frontend (public/)
- **Hub de navegación** con todas las demos
- **Diseño responsive** y moderno
- **Feedback visual** en tiempo real
- **Enlaces directos** al backend

### 📊 Demos Disponibles
1. **🎹 Keylogger**: Captura teclas en tiempo real
2. **📋 Clipboard Capture**: Captura datos del portapapeles
3. **🎣 Phishing Simulado**: Formulario de login falso
4. **📝 Form Manipulation**: Captura datos de formularios

## 🔌 API Endpoints

| Método | Endpoint | Descripción | Uso |
|--------|----------|-------------|-----|
| `GET` | `/` | Info del servidor | Diagnóstico |
| `GET` | `/health` | Estado del servidor | Monitoreo |
| `POST` | `/captura` | Capturar datos | Demos frontend |
| `GET` | `/ver-keylogger` | Ver datos capturados | Visualización |

### 📖 Documentación Completa

**¿Necesitas entender cómo funcionan las APIs?** 

👉 Lee la [**Documentación Completa de las APIs**](./DOCUMENTACION_API.md) - Guía detallada en español con:
- Explicación de la arquitectura del servidor
- Descripción detallada de cada endpoint con ejemplos
- Diagramas de flujo de datos
- Conceptos clave (HTTP, REST, JSON, CORS)
- Ejemplos prácticos completos
- Guía de debugging y troubleshooting

### Ejemplo de uso de la API:
```javascript
// Enviar datos al backend
fetch('https://backend-prueba-o523.onrender.com/captura', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    key: 'a',
    type: 'keylogger',
    timestamp: new Date().toISOString()
  })
});
```

## 🔧 Configuración de Desarrollo

### Variables de Entorno
- `NODE_ENV`: `development` | `production`
- `PORT`: Puerto del servidor (automático en Render)

### Scripts Disponibles
```bash
npm start    # Iniciar servidor en producción
npm run dev  # Iniciar servidor en desarrollo
```

## 🛡️ Notas de Seguridad

⚠️ **IMPORTANTE**: Este proyecto es solo para propósitos educativos y testing de seguridad. No debe usarse para actividades maliciosas.

- Las demos muestran técnicas comunes de captura de datos
- Útil para entender vulnerabilidades web
- Ayuda a desarrollar medidas de protección

## 🤝 Contribución

1. Fork del proyecto
2. Crear branch para feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia ISC - ver el archivo `package.json` para detalles.