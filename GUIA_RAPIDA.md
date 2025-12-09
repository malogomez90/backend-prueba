# 🚀 Guía Rápida de las APIs

Una referencia rápida para entender y usar las APIs del proyecto.

## 📡 Endpoints Disponibles

### 1️⃣ GET / - Info del Servidor
```bash
curl https://backend-prueba-o523.onrender.com/
```
**Uso**: Verificar que el servidor está funcionando

---

### 2️⃣ GET /health - Estado del Servidor
```bash
curl https://backend-prueba-o523.onrender.com/health
```
**Uso**: Monitorear la salud y el rendimiento del servidor

---

### 3️⃣ POST /captura - Enviar Datos
```bash
curl -X POST https://backend-prueba-o523.onrender.com/captura \
  -H "Content-Type: application/json" \
  -d '{"mensaje":"Hola","tipo":"test"}'
```
**Uso**: Guardar datos en el servidor

---

### 4️⃣ GET /ver-keylogger - Ver Datos
```
https://backend-prueba-o523.onrender.com/ver-keylogger
```
**Uso**: Ver todos los datos capturados (abrir en navegador)

---

## 💻 Ejemplo Mínimo en JavaScript

```javascript
// Enviar datos al servidor
async function enviarDatos() {
  const respuesta = await fetch('https://backend-prueba-o523.onrender.com/captura', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mensaje: 'Hola Mundo' })
  });
  
  const resultado = await respuesta.json();
  console.log(resultado); // { ok: true, message: '...' }
}
```

---

## 📝 HTML Mínimo Funcional

```html
<!DOCTYPE html>
<html>
<head>
  <title>Test API</title>
</head>
<body>
  <button onclick="enviar()">Enviar Datos</button>
  
  <script>
    async function enviar() {
      try {
        const res = await fetch('https://backend-prueba-o523.onrender.com/captura', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ test: 'Mi primer dato', fecha: new Date() })
        });
        
        const data = await res.json();
        alert(data.message);
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  </script>
</body>
</html>
```

---

## 🔑 Conceptos Clave en 1 Minuto

### ¿Qué es una API?
Una **API** (Interfaz de Programación de Aplicaciones) permite que diferentes programas se comuniquen entre sí.

### ¿Qué es REST?
**REST** es un estilo de arquitectura para APIs que usa:
- **URLs** para identificar recursos (ej: `/captura`)
- **Métodos HTTP** para operaciones (GET, POST, etc.)
- **JSON** para intercambiar datos

### Métodos HTTP Básicos
- **GET**: Obtener/leer datos (no modifica nada)
- **POST**: Crear/enviar datos (modifica el servidor)

### ¿Qué es JSON?
**JSON** es un formato para representar datos:
```json
{
  "nombre": "Juan",
  "edad": 25,
  "activo": true
}
```

### Request vs Response
- **Request** = Lo que envías al servidor
- **Response** = Lo que el servidor te devuelve

---

## 📊 Códigos de Estado HTTP

| Código | Significado | Ejemplo |
|--------|-------------|---------|
| 200 | ✅ Todo bien | Datos guardados correctamente |
| 404 | ❌ No encontrado | La ruta `/abc` no existe |
| 500 | ❌ Error del servidor | Error al guardar en archivo |

---

## 🎯 Flujo Básico de una API

```
1. Usuario hace algo en la página (click, escribir, etc.)
                    ↓
2. JavaScript captura el evento
                    ↓
3. JavaScript envía datos al servidor con fetch()
                    ↓
4. Servidor recibe los datos
                    ↓
5. Servidor procesa (guarda, calcula, etc.)
                    ↓
6. Servidor responde con resultado
                    ↓
7. JavaScript recibe la respuesta
                    ↓
8. Se muestra resultado al usuario
```

---

## 🛠️ Anatomía de una Petición Fetch

```javascript
fetch('URL', {
  method: 'POST',              // Qué operación hacer
  headers: {                   // Información adicional
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(datos)  // Los datos a enviar
})
.then(res => res.json())       // Convertir respuesta a objeto
.then(data => console.log(data)) // Usar los datos
.catch(err => console.error(err)); // Manejar errores
```

---

## 🔍 Cómo Funciona Este Proyecto

### Backend (app.js)
1. Importa Express (framework para crear servidor web)
2. Crea servidor
3. Configura middleware (CORS para permitir requests externos)
4. Define rutas (endpoints)
5. Inicia servidor en puerto 3000

### Frontend (HTML + JavaScript)
1. Usuario interactúa con la página
2. JavaScript captura el evento
3. Envía datos al backend con `fetch()`
4. Recibe respuesta
5. Muestra resultado al usuario

### Flujo Completo
```
Frontend (Netlify)  ←→  Backend (Render)  ←→  datos.txt
   HTML/JS               Express/Node.js      Archivo local
```

---

## 📚 Archivos Importantes

| Archivo | Descripción | Para qué sirve |
|---------|-------------|----------------|
| `app.js` | Servidor backend | Define todos los endpoints |
| `public/config.js` | Configuración URLs | Centraliza URLs del backend |
| `public/*.html` | Páginas frontend | Interfaz de usuario |
| `DOCUMENTACION_API.md` | Guía completa | Explicación detallada |
| `EJEMPLOS_API.md` | Ejemplos prácticos | Código funcionable |
| `README.md` | Visión general | Info del proyecto |

---

## 🎓 Aprende Más

### Para Principiantes
1. Lee esta guía rápida ✅
2. Prueba el ejemplo HTML mínimo
3. Experimenta modificando los datos
4. Mira los datos guardados en `/ver-keylogger`

### Para Profundizar
1. Lee [`DOCUMENTACION_API.md`](./DOCUMENTACION_API.md) - Explicación completa
2. Estudia [`EJEMPLOS_API.md`](./EJEMPLOS_API.md) - Ejemplos funcionables
3. Revisa `app.js` con los comentarios detallados
4. Experimenta creando tus propios endpoints

---

## 💡 Tips Rápidos

### Debugging
```javascript
// Ver qué se está enviando
console.log('Enviando:', datos);

// Ver qué responde el servidor
fetch(url, options)
  .then(res => {
    console.log('Status:', res.status);
    return res.json();
  })
  .then(data => console.log('Respuesta:', data));
```

### Testing Rápido
```bash
# En la terminal
curl https://backend-prueba-o523.onrender.com/

# En la consola del navegador (F12)
fetch('https://backend-prueba-o523.onrender.com/').then(r=>r.json()).then(console.log)
```

### Ver Logs del Servidor
Los `console.log()` en `app.js` aparecen en los logs de Render:
```javascript
console.log('📥 Datos recibidos:', req.body);
```

---

## ❓ FAQ - Preguntas Frecuentes

**P: ¿Por qué usar fetch() y no <form>?**  
R: fetch() permite enviar datos sin recargar la página, dando mejor experiencia de usuario.

**P: ¿Qué es CORS y por qué lo necesito?**  
R: CORS permite que tu frontend (en un dominio) haga peticiones a tu backend (en otro dominio).

**P: ¿Dónde se guardan los datos?**  
R: En el archivo `datos.txt` en el servidor.

**P: ¿Puedo usar esto en producción?**  
R: Este es un proyecto educativo. Para producción, usa una base de datos real.

**P: ¿Cómo agrego un nuevo endpoint?**  
R: En `app.js`, agrega:
```javascript
app.post('/mi-ruta', async (req, res) => {
  // Tu código aquí
  res.json({ ok: true });
});
```

---

## 🆘 Problemas Comunes

### Error: "CORS policy"
- **Causa**: El servidor no permite requests desde tu dominio
- **Solución**: Verifica que el middleware CORS esté en `app.js`

### Error: "404 Not Found"
- **Causa**: La ruta no existe
- **Solución**: Verifica que el endpoint esté bien escrito

### Error: "Network Error"
- **Causa**: No se puede conectar al servidor
- **Solución**: Verifica que el servidor esté corriendo y la URL sea correcta

### No veo console.log() del servidor
- **Causa**: Los logs están en el servidor, no en tu navegador
- **Solución**: Revisa los logs en Render.com

---

## ✅ Checklist de Aprendizaje

- [ ] Entiendo qué es una API
- [ ] Sé usar fetch() para hacer requests
- [ ] Comprendo la diferencia entre GET y POST
- [ ] Puedo leer y escribir JSON
- [ ] Entiendo el flujo request → servidor → response
- [ ] Sé cómo debuggear problemas con console.log
- [ ] Puedo leer los códigos de estado HTTP
- [ ] He probado todos los endpoints

---

**¿Listo para más?** Lee la [documentación completa](./DOCUMENTACION_API.md) para convertirte en un experto. 🚀
