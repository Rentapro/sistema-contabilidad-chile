// Script de verificación de configuración Groq API
// Ejecutar con: node verificar-groq-config.js

console.log('🚀 Verificando configuración de Groq API...\n');

// Verificar archivo .env.local
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');

if (!fs.existsSync(envPath)) {
  console.error('❌ Error: No se encontró el archivo .env.local');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');

// Verificar variables de entorno
const requiredVars = [
  'GROQ_API_KEY',
  'GROQ_API_URL',
  'GROQ_MODEL'
];

let hasGroqKey = false;
let groqKeyValue = '';

console.log('📋 Verificando variables de entorno:');
requiredVars.forEach(varName => {
  const regex = new RegExp(`${varName}=(.+)`, 'g');
  const match = regex.exec(envContent);
  
  if (match) {
    const value = match[1].trim();
    if (varName === 'GROQ_API_KEY') {
      hasGroqKey = value !== 'tu_clave_groq_aqui';
      groqKeyValue = value;
    }
    console.log(`  ✅ ${varName}: ${value.length > 20 ? value.substring(0, 20) + '...' : value}`);
  } else {
    console.log(`  ❌ ${varName}: No encontrada`);
  }
});

console.log('\n🔐 Estado de la API Key de Groq:');
if (hasGroqKey) {
  if (groqKeyValue.startsWith('gsk_')) {
    console.log('  ✅ API Key configurada correctamente (formato válido)');
  } else {
    console.log('  ⚠️  API Key configurada pero formato inusual (debería empezar con "gsk_")');
  }
} else {
  console.log('  ❌ API Key no configurada (usando valor por defecto)');
  console.log('  📝 Necesitas reemplazar "tu_clave_groq_aqui" con tu API key real');
}

console.log('\n🔧 Próximos pasos:');
if (!hasGroqKey) {
  console.log('  1. Ve a: https://console.groq.com/');
  console.log('  2. Regístrate y crea una API Key');
  console.log('  3. Edita .env.local y reemplaza "tu_clave_groq_aqui" con tu API key');
  console.log('  4. Reinicia el servidor con: npm run dev');
} else {
  console.log('  1. ✅ Configuración completa');
  console.log('  2. 🚀 Reinicia el servidor si no lo has hecho: npm run dev');
  console.log('  3. 🧪 Prueba la IA en: http://localhost:3000/contador-externo');
}

console.log('\n📊 Resumen de configuración:');
console.log(`  • Groq configurado: ${hasGroqKey ? '✅' : '❌'}`);
console.log(`  • Fallback OpenAI: ${envContent.includes('OPENAI_API_KEY') ? '✅' : '❌'}`);
console.log(`  • Fallback local: ✅ (siempre disponible)`);

if (hasGroqKey) {
  console.log('\n🎉 ¡Configuración lista! Tu IA fiscal debería funcionar a máxima velocidad.');
} else {
  console.log('\n⏳ Falta configurar la API Key de Groq para funcionalidad completa.');
}
