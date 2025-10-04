// Archivo de entrada principal para Render
// Este archivo simplemente requiere el servidor desde src/server.js

console.log('🔄 Iniciando servidor backend-prueba...');
console.log('📂 Cargando desde: ./src/server.js');

try {
  // Cargar el servidor desde la nueva ubicación
  require('./src/server.js');
  console.log('✅ Servidor cargado correctamente');
} catch (error) {
  console.error('❌ Error al cargar el servidor:', error.message);
  process.exit(1);
}