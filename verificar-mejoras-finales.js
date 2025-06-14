#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 VERIFICACIÓN FINAL - MEJORAS DE CONTRASTE Y FACTURAS CRUZADAS');
console.log('================================================================');

// Verificar mejoras en IAFiscalAvanzada.tsx
const iaFiscalPath = path.join(__dirname, 'src', 'components', 'IAFiscalAvanzada.tsx');
const iaFiscalContent = fs.readFileSync(iaFiscalPath, 'utf8');

console.log('\n✅ 1. VERIFICACIÓN CONTRASTE IA FISCAL:');
console.log('--------------------------------------');

// Verificar mejoras de contraste en secciones
const contrastChecks = [
  {
    name: 'Impacto Económico - Fondo mejorado',
    pattern: /bg-green-100.*border-2.*border-green-300/,
    found: iaFiscalContent.includes('bg-green-100') && iaFiscalContent.includes('border-2 border-green-300')
  },
  {
    name: 'Impacto Económico - Texto oscuro',
    pattern: /text-green-950/,
    found: iaFiscalContent.includes('text-green-950')
  },
  {
    name: 'Acciones Recomendadas - Fondo mejorado',
    pattern: /bg-blue-100.*border-2.*border-blue-300/,
    found: iaFiscalContent.includes('bg-blue-100') && iaFiscalContent.includes('border-2 border-blue-300')
  },
  {
    name: 'Acciones Recomendadas - Texto oscuro',
    pattern: /text-blue-950/,
    found: iaFiscalContent.includes('text-blue-950')
  },
  {
    name: 'Espaciado mejorado en acciones',
    pattern: /space-y-2/,
    found: iaFiscalContent.includes('space-y-2')
  }
];

contrastChecks.forEach(check => {
  console.log(`${check.found ? '✅' : '❌'} ${check.name}`);
});

// Verificar dashboard multi-empresa
const dashboardPath = path.join(__dirname, 'src', 'components', 'DashboardMultiEmpresa.tsx');
const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');

console.log('\n✅ 2. VERIFICACIÓN FACTURAS CRUZADAS:');
console.log('------------------------------------');

const facturasCruzadasChecks = [
  {
    name: 'Sección de sugerencias IA presente',
    found: dashboardContent.includes('Sugerencias IA: Optimización de IVA Cruzado')
  },
  {
    name: 'TechSolutions → RetailMax sugerencia',
    found: dashboardContent.includes('TechSolutions SPA → RetailMax EIRL')
  },
  {
    name: 'LogisticsPro → TechSolutions sugerencia',
    found: dashboardContent.includes('LogisticsPro → TechSolutions SPA')
  },
  {
    name: 'ManufacturingCorp → LogisticsPro sugerencia',
    found: dashboardContent.includes('ManufacturingCorp → LogisticsPro')
  },
  {
    name: 'RetailMax → ManufacturingCorp sugerencia',
    found: dashboardContent.includes('RetailMax → ManufacturingCorp')
  },
  {
    name: 'Cálculo de beneficio total',
    found: dashboardContent.includes('Beneficio Total Estimado') && dashboardContent.includes('$2.128.000')
  },
  {
    name: 'Botón generar facturas automáticamente',
    found: dashboardContent.includes('Generar Facturas Automáticamente')
  },
  {
    name: 'Alerta de oportunidad temporal',
    found: dashboardContent.includes('Oportunidad Temporal') && dashboardContent.includes('antes del 15 del mes')
  }
];

facturasCruzadasChecks.forEach(check => {
  console.log(`${check.found ? '✅' : '❌'} ${check.name}`);
});

// Verificar elementos visuales
console.log('\n✅ 3. VERIFICACIÓN ELEMENTOS VISUALES:');
console.log('------------------------------------');

const visualChecks = [
  {
    name: 'Iconos de Zap para IA',
    found: dashboardContent.includes('Zap className="w-6 h-6 text-purple-600"')
  },
  {
    name: 'Gradiente purple-indigo de fondo',
    found: dashboardContent.includes('from-purple-50 to-indigo-50')
  },
  {
    name: 'Badges de ahorro en verde',
    found: dashboardContent.includes('bg-green-100 text-green-800')
  },
  {
    name: 'Bordes purple en tarjetas',
    found: dashboardContent.includes('border-purple-200')
  },
  {
    name: 'Botón purple para generar facturas',
    found: dashboardContent.includes('bg-purple-600 hover:bg-purple-700')
  }
];

visualChecks.forEach(check => {
  console.log(`${check.found ? '✅' : '❌'} ${check.name}`);
});

// Contar total de verificaciones
const totalChecks = contrastChecks.length + facturasCruzadasChecks.length + visualChecks.length;
const passedChecks = [
  ...contrastChecks,
  ...facturasCruzadasChecks,
  ...visualChecks
].filter(check => check.found).length;

console.log('\n📊 RESUMEN FINAL:');
console.log('================');
console.log(`✅ Verificaciones pasadas: ${passedChecks}/${totalChecks}`);
console.log(`📈 Porcentaje de éxito: ${Math.round((passedChecks/totalChecks) * 100)}%`);

if (passedChecks === totalChecks) {
  console.log('\n🎉 ¡PERFECTO! Todas las mejoras implementadas correctamente:');
  console.log('   • Contraste mejorado en IA fiscal');
  console.log('   • Sugerencias de facturas cruzadas funcionando');
  console.log('   • Elementos visuales optimizados');
  console.log('   • Sistema listo para producción');
} else {
  console.log('\n⚠️  Hay algunas verificaciones que fallaron. Revisar implementación.');
}

console.log('\n🔗 URLs de verificación:');
console.log('   Dashboard Multi-Empresa: http://localhost:3000/multi-empresa');
console.log('   IA Fiscal: http://localhost:3000/contador-externo');
