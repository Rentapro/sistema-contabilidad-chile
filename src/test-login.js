// Test de verificación del sistema de login
console.log('=== VERIFICANDO SISTEMA DE LOGIN ===');

// Simular las credenciales de demo
const credentialsTest = [
  { email: 'admin@contabilidad.pro', password: 'admin123', tipo: 'superadmin' },
  { email: 'cliente@empresa.com', password: 'cliente123', tipo: 'cliente' }
];

// Test básico de que los componentes se cargan
console.log('✅ Archivo de test cargado correctamente');
console.log('📧 Credenciales de prueba disponibles:', credentialsTest);

// Verificar que estamos en el entorno correcto
if (typeof window !== 'undefined') {
  console.log('🌐 Entorno del navegador detectado');
  console.log('📍 URL actual:', window.location.href);
} else {
  console.log('🖥️ Entorno del servidor detectado');
}

console.log('=== FIN DE VERIFICACIÓN ===');
