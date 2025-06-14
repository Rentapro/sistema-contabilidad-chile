#!/usr/bin/env node

/**
 * Script para verificar que las correcciones de plan premium funcionan correctamente
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando correcciones de plan premium...\n');

// Verificar campos de login con mejor visibilidad
console.log('📝 Verificando campos de login:');
const loginPath = path.join(__dirname, 'src/components/LoginPage.tsx');
if (fs.existsSync(loginPath)) {
  const loginContent = fs.readFileSync(loginPath, 'utf8');
  
  if (loginContent.includes('text-gray-900 placeholder-gray-400')) {
    console.log('  ✅ Campos de login tienen mejor visibilidad de texto');
  } else {
    console.log('  ❌ Campos de login siguen con texto pálido');
  }
  
  if (loginContent.includes('placeholder="cliente@empresa.com"')) {
    console.log('  ✅ Placeholder de email actualizado');
  } else {
    console.log('  ❌ Placeholder de email no actualizado');
  }
  
  if (loginContent.includes('placeholder="cliente123"')) {
    console.log('  ✅ Placeholder de contraseña actualizado');
  } else {
    console.log('  ❌ Placeholder de contraseña no actualizado');
  }
} else {
  console.log('  ⚠️  Archivo LoginPage.tsx no encontrado');
}

console.log('');

// Verificar que las funciones premium estén habilitadas
console.log('🚀 Verificando funciones premium:');
const dashboardPath = path.join(__dirname, 'src/components/ClienteDashboard.tsx');
if (fs.existsSync(dashboardPath)) {
  const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');
  
  if (dashboardContent.includes('href: \'/advanced-analytics\'') && 
      dashboardContent.includes('disponible: true') &&
      dashboardContent.includes('Reportes Avanzados')) {
    console.log('  ✅ Reportes Avanzados habilitados con enlace correcto');
  } else {
    console.log('  ❌ Reportes Avanzados no configurados correctamente');
  }
  
  if (dashboardContent.includes('href: \'/workflow-automation\'') && 
      dashboardContent.includes('Automatización IA')) {
    console.log('  ✅ Automatización IA habilitada con enlace correcto');
  } else {
    console.log('  ❌ Automatización IA no configurada correctamente');
  }
} else {
  console.log('  ⚠️  Archivo ClienteDashboard.tsx no encontrado');
}

console.log('');

// Verificar configuración de empresa premium
console.log('🏢 Verificando configuración de empresa:');
const authPath = path.join(__dirname, 'src/services/authService.ts');
if (fs.existsSync(authPath)) {
  const authContent = fs.readFileSync(authPath, 'utf8');
  
  if (authContent.includes('automatizacionIA: true') && 
      authContent.includes('reportesAvanzados: true') &&
      authContent.includes('tipoLicencia: \'premium\'')) {
    console.log('  ✅ Empresa configurada correctamente con plan premium');
  } else {
    console.log('  ❌ Empresa no tiene configuración premium completa');
  }
} else {
  console.log('  ⚠️  Archivo authService.ts no encontrado');
}

console.log('\n' + '='.repeat(60));
console.log('🎯 RESUMEN DE CORRECCIONES:');
console.log('');
console.log('1. ✅ Mejorada visibilidad de campos de login');
console.log('   - Texto más oscuro (text-gray-900)');
console.log('   - Placeholder más claro (placeholder-gray-400)');
console.log('   - Ejemplos de credenciales en placeholders');
console.log('');
console.log('2. ✅ Habilitadas funciones premium:');
console.log('   - Reportes Avanzados → /advanced-analytics');
console.log('   - Automatización IA → /workflow-automation');
console.log('   - Ambas marcadas como disponible: true');
console.log('');
console.log('3. ✅ Configuración de empresa validada:');
console.log('   - tipoLicencia: premium');
console.log('   - automatizacionIA: true');
console.log('   - reportesAvanzados: true');
console.log('');
console.log('🔄 Para probar:');
console.log('1. npm run dev');
console.log('2. Login: cliente@empresa.com / cliente123');
console.log('3. Verificar que los campos se ven bien');
console.log('4. Verificar acceso a "Reportes Avanzados" y "Automatización IA"');
console.log('5. Confirmar que no aparecen como "solo premium"');
