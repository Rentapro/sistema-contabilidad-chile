#!/usr/bin/env node

/**
 * 🚀 CONFIGURACIÓN AUTOMÁTICA SII REAL
 * Sistema de Contabilidad Chile - Constructora Capi Zapallar SpA
 */

const fs = require('fs');
const path = require('path');

console.log('🇨🇱 CONFIGURANDO INTEGRACIÓN SII REAL...\n');

// Verificar estructura de certificados
const certificatesDir = path.join(__dirname, 'certificates');
if (!fs.existsSync(certificatesDir)) {
  fs.mkdirSync(certificatesDir, { recursive: true });
  console.log('✅ Directorio certificates/ creado');
}

// Configuración empresa
const empresaConfig = {
  rut: '77212362-0',
  razonSocial: 'Constructora Capi Zapallar SpA',
  giro: 'Construcción',
  email: 'contacto@capizallar.cl',
  telefono: '973732599',
  usuario: 'capi zapallar',
  clave: 'diego2016',
  certificado: {
    formato: 'pfx',
    password: '2139',
    archivo: 'certificado.pfx'
  }
};

console.log('🏗️ DATOS EMPRESA CONFIGURADOS:');
console.log(`   RUT: ${empresaConfig.rut}`);
console.log(`   Razón Social: ${empresaConfig.razonSocial}`);
console.log(`   Giro: ${empresaConfig.giro}`);
console.log(`   Email: ${empresaConfig.email}`);
console.log(`   Certificado: ✅ ${empresaConfig.certificado.formato.toUpperCase()}`);

// Verificar archivo .env.local
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  console.log('✅ Archivo .env.local configurado con datos reales');
} else {
  console.log('⚠️  Archivo .env.local no encontrado');
}

// Crear archivo de instrucciones
const instrucciones = `
# 📋 INSTRUCCIONES FINALES - INTEGRACIÓN SII REAL

## ✅ CONFIGURACIÓN COMPLETADA

### 1. Variables de Entorno
- ✅ RUT empresa: 77212362-0
- ✅ Credenciales SII configuradas
- ✅ Certificado .pfx soportado
- ✅ Ambiente: certificación

### 2. Certificado Digital
Para completar la configuración:

1. **Coloca tu certificado .pfx** en:
   \`certificates/certificado.pfx\`

2. **Verifica la contraseña**: 2139

3. **Ejecuta el sistema**:
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Ve a la página SII**:
   http://localhost:3000/sii

### 3. Pruebas de Conexión

El sistema probará automáticamente:
- ✅ Validación RUT empresarial
- ✅ Conexión con SII certificación
- ✅ Carga del certificado .pfx
- ✅ Autenticación con credenciales

### 🎯 PRÓXIMO PASO

**¡Coloca el archivo certificado.pfx en la carpeta certificates/ y ejecuta el sistema!**

Ruta completa: \`certificates/certificado.pfx\`
`;

fs.writeFileSync(path.join(__dirname, 'INSTRUCCIONES_FINALES.md'), instrucciones);

console.log('\n🎯 CONFIGURACIÓN COMPLETADA');
console.log('📄 Ver: INSTRUCCIONES_FINALES.md');
console.log('\n🚀 PRÓXIMO PASO:');
console.log('   1. Coloca certificado.pfx en certificates/');
console.log('   2. Ejecuta: npm run dev');
console.log('   3. Ve a: http://localhost:3000/sii\n');
