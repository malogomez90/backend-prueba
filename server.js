const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/captura", (req, res) => {
  // Guarda los datos recibidos en un archivo 'datos.txt'
  fs.appendFileSync("datos.txt", JSON.stringify(req.body) + "\n");
  res.send({ ok: true });
});

app.listen(process.env.PORT, () => {
  console.log("Servidor escuchando en puerto " + process.env.PORT);
});