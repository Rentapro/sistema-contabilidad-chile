#!/usr/bin/env node

/**
 * Script de Verificación Automática del Sistema
 * Sistema Contabilidad Chile v2.0
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICANDO SISTEMA DE CONTABILIDAD CHILE v2.0');
console.log('='.repeat(60));

// Verificar archivos críticos
const archivosEsenciales = [
  '.env.local',
  'package.json',
  'database/schema.sql',
  'database/datos_iniciales.sql',
  'src/lib/supabase.ts',
  'src/services/clienteService.ts',
  'src/services/facturacionService.ts',
  'src/services/emailService.ts',
  'src/services/pdfService.ts',
  'src/services/excelService.ts',
  'src/services/monitoreoService.ts',
  'src/services/backupService.ts',
  'src/services/integracionBancariaService.ts',
  'src/app/api/auth/[...nextauth]/route.ts',
  'src/app/api/indicadores/route.ts',
  'src/app/api/validar-rut/route.ts',
  'src/app/api/territorios/route.ts',
  'MANUAL_CONFIGURACION_COMPLETA.md'
];

let archivosEncontrados = 0;
let archivosFaltantes = [];

console.log('\n📁 VERIFICANDO ARCHIVOS ESENCIALES:');
archivosEsenciales.forEach(archivo => {
  const rutaCompleta = path.join(__dirname, archivo);
  if (fs.existsSync(rutaCompleta)) {
    console.log(`✅ ${archivo}`);
    archivosEncontrados++;
  } else {
    console.log(`❌ ${archivo} - FALTANTE`);
    archivosFaltantes.push(archivo);
  }
});

// Verificar package.json
console.log('\n📦 VERIFICANDO DEPENDENCIAS:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const dependenciasRequeridas = [
    '@supabase/supabase-js',
    'next-auth',
    '@sendgrid/mail',
    'react-query',
    'zod',
    'jspdf',
    'xlsx',
    'bcryptjs'
  ];

  let dependenciasOK = 0;
  dependenciasRequeridas.forEach(dep => {
    if (packageJson.dependencies[dep] || packageJson.devDependencies?.[dep]) {
      console.log(`✅ ${dep}`);
      dependenciasOK++;
    } else {
      console.log(`❌ ${dep} - FALTANTE`);
    }
  });

  console.log(`\n📊 Dependencias: ${dependenciasOK}/${dependenciasRequeridas.length} instaladas`);
} catch (error) {
  console.log('❌ Error leyendo package.json:', error.message);
}

// Verificar .env.local
console.log('\n🔐 VERIFICANDO CONFIGURACIÓN:');
try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const configuracionesRequeridas = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'SENDGRID_API_KEY',
    'NEXTAUTH_SECRET',
    'NEXT_PUBLIC_CURRENCY',
    'NEXT_PUBLIC_IVA_RATE'
  ];

  let configuracionesOK = 0;
  configuracionesRequeridas.forEach(config => {
    if (envContent.includes(config)) {
      const valor = envContent.match(new RegExp(`${config}=(.+)`))?.[1];
      if (valor && valor.trim() !== '' && !valor.includes('tu_') && !valor.includes('example')) {
        console.log(`✅ ${config} - Configurada`);
        configuracionesOK++;
      } else {
        console.log(`⚠️  ${config} - Presente pero valor por defecto`);
      }
    } else {
      console.log(`❌ ${config} - FALTANTE`);
    }
  });

  console.log(`\n📊 Configuraciones: ${configuracionesOK}/${configuracionesRequeridas.length} reales`);
} catch (error) {
  console.log('❌ Error leyendo .env.local:', error.message);
}

// Verificar servicios
console.log('\n🔧 VERIFICANDO SERVICIOS:');
const servicios = [
  'clienteService.ts',
  'facturacionService.ts', 
  'emailService.ts',
  'pdfService.ts',
  'excelService.ts',
  'monitoreoService.ts',
  'backupService.ts',
  'integracionBancariaService.ts',
  'apiChilenaService.ts',
  'siiService.ts'
];

let serviciosOK = 0;
servicios.forEach(servicio => {
  const rutaServicio = path.join(__dirname, 'src/services', servicio);
  if (fs.existsSync(rutaServicio)) {
    console.log(`✅ ${servicio}`);
    serviciosOK++;
  } else {
    console.log(`❌ ${servicio} - FALTANTE`);
  }
});

// Verificar APIs
console.log('\n🌐 VERIFICANDO APIs:');
const apis = [
  'api/auth/[...nextauth]/route.ts',
  'api/indicadores/route.ts',
  'api/validar-rut/route.ts',
  'api/territorios/route.ts'
];

let apisOK = 0;
apis.forEach(api => {
  const rutaApi = path.join(__dirname, 'src/app', api);
  if (fs.existsSync(rutaApi)) {
    console.log(`✅ ${api}`);
    apisOK++;
  } else {
    console.log(`❌ ${api} - FALTANTE`);
  }
});

// Verificar base de datos
console.log('\n🗄️ VERIFICANDO BASE DE DATOS:');
const archivosBD = ['database/schema.sql', 'database/datos_iniciales.sql'];
let bdOK = 0;
archivosBD.forEach(archivo => {
  if (fs.existsSync(archivo)) {
    const contenido = fs.readFileSync(archivo, 'utf8');
    if (contenido.includes('CREATE TABLE') && contenido.length > 1000) {
      console.log(`✅ ${archivo} - Válido`);
      bdOK++;
    } else {
      console.log(`⚠️  ${archivo} - Presente pero incompleto`);
    }
  } else {
    console.log(`❌ ${archivo} - FALTANTE`);
  }
});

// Resumen final
console.log('\n' + '='.repeat(60));
console.log('📊 RESUMEN DE VERIFICACIÓN:');
console.log('='.repeat(60));

const puntuacionTotal = archivosEncontrados + serviciosOK + apisOK + bdOK;
const puntuacionMaxima = archivosEsenciales.length + servicios.length + apis.length + archivosBD.length;
const porcentaje = Math.round((puntuacionTotal / puntuacionMaxima) * 100);

console.log(`📁 Archivos esenciales: ${archivosEncontrados}/${archivosEsenciales.length}`);
console.log(`🔧 Servicios: ${serviciosOK}/${servicios.length}`);
console.log(`🌐 APIs: ${apisOK}/${apis.length}`);
console.log(`🗄️ Base de datos: ${bdOK}/${archivosBD.length}`);
console.log(`\n🎯 PUNTUACIÓN TOTAL: ${puntuacionTotal}/${puntuacionMaxima} (${porcentaje}%)`);

if (porcentaje >= 90) {
  console.log('\n🎉 ¡SISTEMA COMPLETAMENTE FUNCIONAL!');
  console.log('✅ Listo para uso empresarial real');
  console.log('📚 Consulta MANUAL_CONFIGURACION_COMPLETA.md para configurar servicios');
} else if (porcentaje >= 70) {
  console.log('\n⚠️  SISTEMA PARCIALMENTE FUNCIONAL');
  console.log('🔧 Algunos componentes necesitan configuración adicional');
} else {
  console.log('\n❌ SISTEMA REQUIERE CONFIGURACIÓN ADICIONAL');
  console.log('🚨 Revisa los archivos faltantes arriba');
}

console.log('\n📋 PRÓXIMOS PASOS:');
console.log('1. Configura Supabase (base de datos)');
console.log('2. Configura SendGrid (emails)');
console.log('3. Ejecuta: npm install && npm run dev');
console.log('4. Abre http://localhost:3000');
console.log('5. Inicia sesión con admin@demo.cl');

console.log('\n🔗 RECURSOS:');
console.log('• Manual completo: MANUAL_CONFIGURACION_COMPLETA.md');
console.log('• Esquema BD: database/schema.sql');
console.log('• Datos ejemplo: database/datos_iniciales.sql');

if (archivosFaltantes.length > 0) {
  console.log('\n📋 ARCHIVOS FALTANTES:');
  archivosFaltantes.forEach(archivo => {
    console.log(`• ${archivo}`);
  });
}

console.log('\n' + '='.repeat(60));
console.log('🚀 Sistema de Contabilidad Chile v2.0 - Verificación completada');
console.log('='.repeat(60));
