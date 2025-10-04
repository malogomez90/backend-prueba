const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

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