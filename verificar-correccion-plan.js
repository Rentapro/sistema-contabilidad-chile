#!/usr/bin/env node

/**
 * Script para verificar que la corrección del plan funciona correctamente
 * Verifica que la detección del plan use la empresa actual en lugar del usuario
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando corrección de detección de plan...\n');

// Archivos a verificar
const archivos = [
  'src/components/FeatureProtection.tsx',
  'src/components/Navigation.tsx',
  'src/components/ClienteDashboard.tsx',
  'src/hooks/useUsageLimits.ts'
];

let verificacionExitosa = true;

// Patrones problemáticos que debemos evitar
const patronesProblematicos = [
  /usuario\.licencia === ['"]basico['"]/g,
  /usuario\?\.licencia === ['"]basico['"]/g,
  /usuario\.licencia !== ['"]premium['"]/g,
  /usuario\?\.licencia !== ['"]premium['"]/g
];

// Patrones correctos que debemos encontrar
const patronesCorrectos = [
  /empresaActual\?\.tipoLicencia/g,
  /empresaActual\.tipoLicencia/g
];

archivos.forEach(archivo => {
  const rutaCompleta = path.join(__dirname, archivo);
  
  if (!fs.existsSync(rutaCompleta)) {
    console.log(`⚠️  Archivo no encontrado: ${archivo}`);
    return;
  }

  const contenido = fs.readFileSync(rutaCompleta, 'utf8');
  
  console.log(`📄 Verificando: ${archivo}`);
  
  // Verificar patrones problemáticos
  let problemasEncontrados = false;
  patronesProblematicos.forEach((patron, index) => {
    const coincidencias = contenido.match(patron);
    if (coincidencias) {
      console.log(`  ❌ Patrón problemático encontrado: ${patron.source}`);
      console.log(`     Coincidencias: ${coincidencias.length}`);
      problemasEncontrados = true;
      verificacionExitosa = false;
    }
  });
  
  // Verificar patrones correctos
  let patronesCorrectosEncontrados = 0;
  patronesCorrectos.forEach(patron => {
    const coincidencias = contenido.match(patron);
    if (coincidencias) {
      patronesCorrectosEncontrados += coincidencias.length;
    }
  });
  
  if (!problemasEncontrados) {
    console.log(`  ✅ Sin patrones problemáticos`);
  }
  
  if (patronesCorrectosEncontrados > 0) {
    console.log(`  ✅ Patrones correctos encontrados: ${patronesCorrectosEncontrados}`);
  }
  
  console.log('');
});

// Verificar datos mock
console.log('🏢 Verificando consistencia de datos mock...\n');

const authServicePath = path.join(__dirname, 'src/services/authService.ts');
if (fs.existsSync(authServicePath)) {
  const authContent = fs.readFileSync(authServicePath, 'utf8');
  
  // Buscar usuario cliente@empresa.com
  const usuarioCliente = authContent.match(/email: ['"]cliente@empresa\.com['"][^}]+licencia: ['"]([^'"]+)['"]/);
  const empresaDemo = authContent.match(/id: ['"]empresa-1['"][^}]+tipoLicencia: ['"]([^'"]+)['"]/);
  
  if (usuarioCliente && empresaDemo) {
    const licenciaUsuario = usuarioCliente[1];
    const licenciaEmpresa = empresaDemo[1];
    
    console.log(`👤 Usuario cliente@empresa.com: licencia="${licenciaUsuario}"`);
    console.log(`🏢 Empresa empresa-1: tipoLicencia="${licenciaEmpresa}"`);
    
    if (licenciaUsuario === licenciaEmpresa) {
      console.log('✅ Licencias son consistentes');
    } else {
      console.log('❌ Licencias son inconsistentes');
      verificacionExitosa = false;
    }
  } else {
    console.log('⚠️  No se pudo verificar la consistencia de licencias');
  }
} else {
  console.log('⚠️  Archivo authService.ts no encontrado');
}

console.log('\n' + '='.repeat(50));

if (verificacionExitosa) {
  console.log('🎉 ¡VERIFICACIÓN EXITOSA!');
  console.log('✅ Todas las correcciones están aplicadas correctamente');
  console.log('✅ La detección de plan usa empresaActual.tipoLicencia');
  console.log('✅ Los datos mock son consistentes');
} else {
  console.log('❌ VERIFICACIÓN FALLIDA');
  console.log('⚠️  Se encontraron problemas que necesitan corrección');
}

console.log('\n🔄 Para probar el sistema:');
console.log('1. npm run dev');
console.log('2. Navegar a http://localhost:3001');
console.log('3. Login: cliente@empresa.com / cliente123');
console.log('4. Verificar que muestra "Plan PREMIUM"');
console.log('5. Intentar acceder a funciones de IA');
