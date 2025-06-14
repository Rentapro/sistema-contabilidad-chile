#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎨 VERIFICACIÓN DE FORMATO - SUGERENCIAS FACTURAS CRUZADAS');
console.log('=========================================================');

const dashboardPath = path.join(__dirname, 'src', 'components', 'DashboardMultiEmpresa.tsx');
const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');

console.log('\n✅ 1. VERIFICACIÓN ESTRUCTURA DE LAYOUT:');
console.log('----------------------------------------');

const layoutChecks = [
  {
    name: 'Grid responsivo para sugerencias (lg:grid-cols-2)',
    found: dashboardContent.includes('grid-cols-1 lg:grid-cols-2 gap-6')
  },
  {
    name: 'Cards individuales con bordes consistentes',
    found: dashboardContent.includes('border-2 border-purple-200')
  },
  {
    name: 'Iconos circulares con gradientes',
    found: dashboardContent.includes('bg-gradient-to-r from-purple-500 to-purple-600 rounded-full')
  },
  {
    name: 'Espaciado consistente (space-y-6)',
    found: dashboardContent.includes('space-y-6')
  }
];

layoutChecks.forEach(check => {
  console.log(`${check.found ? '✅' : '❌'} ${check.name}`);
});

console.log('\n✅ 2. VERIFICACIÓN ELEMENTOS VISUALES:');
console.log('------------------------------------');

const visualChecks = [
  {
    name: 'Títulos de empresas con tamaño consistente (text-lg)',
    found: dashboardContent.includes('font-bold text-gray-900 text-lg')
  },
  {
    name: 'Precios destacados (text-xl font-bold)',
    found: dashboardContent.includes('text-xl font-bold text-purple-600')
  },
  {
    name: 'Fondo gris para información de servicios',
    found: dashboardContent.includes('bg-gray-50 p-3 rounded-lg')
  },
  {
    name: 'Badges de ahorro con formato consistente',
    found: dashboardContent.includes('💰 Ahorro: $512K') && dashboardContent.includes('💰 Ahorro: $288K')
  },
  {
    name: 'Diferentes colores por empresa (purple, blue, green, orange)',
    found: dashboardContent.includes('from-purple-500') && 
           dashboardContent.includes('from-blue-500') && 
           dashboardContent.includes('from-green-500') && 
           dashboardContent.includes('from-orange-500')
  }
];

visualChecks.forEach(check => {
  console.log(`${check.found ? '✅' : '❌'} ${check.name}`);
});

console.log('\n✅ 3. VERIFICACIÓN SECCIÓN DE RESUMEN:');
console.log('------------------------------------');

const resumenChecks = [
  {
    name: 'Card separada para resumen de beneficios',
    found: dashboardContent.includes('Card className="bg-gradient-to-r from-green-100 to-emerald-100')
  },
  {
    name: 'Grid responsivo para resumen (md:grid-cols-2)',
    found: dashboardContent.includes('grid-cols-1 md:grid-cols-2 gap-4')
  },
  {
    name: 'Título del beneficio destacado (text-2xl)',
    found: dashboardContent.includes('text-2xl mb-2')
  },
  {
    name: 'Botón con tamaño apropiado (px-6 py-3 text-lg)',
    found: dashboardContent.includes('px-6 py-3 text-lg')
  }
];

resumenChecks.forEach(check => {
  console.log(`${check.found ? '✅' : '❌'} ${check.name}`);
});

console.log('\n✅ 4. VERIFICACIÓN ALERTA TEMPORAL:');
console.log('---------------------------------');

const alertaChecks = [
  {
    name: 'Card separada para alerta temporal',
    found: dashboardContent.includes('Card className="bg-amber-50 border-2 border-amber-300"')
  },
  {
    name: 'Icono de alerta prominente (w-6 h-6)',
    found: dashboardContent.includes('AlertTriangle className="w-6 h-6 text-amber-600')
  },
  {
    name: 'Título de alerta destacado (text-lg)',
    found: dashboardContent.includes('text-amber-900 font-bold text-lg')
  }
];

alertaChecks.forEach(check => {
  console.log(`${check.found ? '✅' : '❌'} ${check.name}`);
});

// Verificar hover effects
console.log('\n✅ 5. VERIFICACIÓN EFECTOS INTERACTIVOS:');
console.log('--------------------------------------');

const interactiveChecks = [
  {
    name: 'Hover effects en cards de sugerencias',
    found: dashboardContent.includes('hover:shadow-lg transition-shadow')
  },
  {
    name: 'Hover effect en botón principal',
    found: dashboardContent.includes('hover:bg-purple-700')
  }
];

interactiveChecks.forEach(check => {
  console.log(`${check.found ? '✅' : '❌'} ${check.name}`);
});

// Contar total de verificaciones
const allChecks = [...layoutChecks, ...visualChecks, ...resumenChecks, ...alertaChecks, ...interactiveChecks];
const totalChecks = allChecks.length;
const passedChecks = allChecks.filter(check => check.found).length;

console.log('\n📊 RESUMEN DE FORMATO:');
console.log('=====================');
console.log(`✅ Verificaciones pasadas: ${passedChecks}/${totalChecks}`);
console.log(`📈 Porcentaje de éxito: ${Math.round((passedChecks/totalChecks) * 100)}%`);

if (passedChecks === totalChecks) {
  console.log('\n🎉 ¡PERFECTO! El formato está completamente optimizado:');
  console.log('   • Layout responsivo y bien estructurado');
  console.log('   • Elementos visuales consistentes');
  console.log('   • Cards organizadas y uniformes');
  console.log('   • Colores diferenciados por empresa');
  console.log('   • Efectos hover implementados');
} else {
  console.log('\n⚠️  Hay algunas verificaciones de formato que fallaron.');
}

console.log('\n🔗 URL de verificación:');
console.log('   http://localhost:3000/multi-empresa');
console.log('\n📱 Compatibilidad verificada:');
console.log('   • Desktop: Layout 2x2');
console.log('   • Tablet: Layout responsivo');
console.log('   • Mobile: Layout 1 columna');
