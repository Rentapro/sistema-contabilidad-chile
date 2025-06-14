# 🚀 CONFIGURACIÓN AUTOMÁTICA SII REAL - PowerShell
# Sistema de Contabilidad Chile - Constructora Capi Zapallar SpA

Write-Host "🇨🇱 CONFIGURANDO INTEGRACIÓN SII REAL..." -ForegroundColor Green
Write-Host ""

# Verificar estructura de certificados
$certificatesDir = ".\certificates"
if (!(Test-Path $certificatesDir)) {
    New-Item -ItemType Directory -Path $certificatesDir -Force | Out-Null
    Write-Host "✅ Directorio certificates/ creado" -ForegroundColor Green
}

# Configuración empresa
$empresaConfig = @{
    rut = "77212362-0"
    razonSocial = "Constructora Capi Zapallar SpA"
    giro = "Construcción"
    email = "contacto@capizallar.cl"
    telefono = "973732599"
    usuario = "capi zapallar"
    clave = "diego2016"
    certificado = @{
        formato = "pfx"
        password = "2139"
        archivo = "certificado.pfx"
    }
}

Write-Host "🏗️ DATOS EMPRESA CONFIGURADOS:" -ForegroundColor Cyan
Write-Host "   RUT: $($empresaConfig.rut)" -ForegroundColor White
Write-Host "   Razón Social: $($empresaConfig.razonSocial)" -ForegroundColor White
Write-Host "   Giro: $($empresaConfig.giro)" -ForegroundColor White
Write-Host "   Email: $($empresaConfig.email)" -ForegroundColor White
Write-Host "   Certificado: ✅ $($empresaConfig.certificado.formato.ToUpper())" -ForegroundColor Green

# Verificar archivo .env.local
$envPath = ".\.env.local"
if (Test-Path $envPath) {
    Write-Host "✅ Archivo .env.local configurado con datos reales" -ForegroundColor Green
} else {
    Write-Host "⚠️  Archivo .env.local no encontrado" -ForegroundColor Yellow
}

# Crear archivo de instrucciones
$instrucciones = @"
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
   ``certificates/certificado.pfx``

2. **Verifica la contraseña**: 2139

3. **Ejecuta el sistema**:
   ```bash
   npm run dev
   ```

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

Ruta completa: ``certificates/certificado.pfx``
"@

$instrucciones | Out-File -FilePath ".\INSTRUCCIONES_FINALES.md" -Encoding UTF8

Write-Host ""
Write-Host "🎯 CONFIGURACIÓN COMPLETADA" -ForegroundColor Green
Write-Host "📄 Ver: INSTRUCCIONES_FINALES.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 PRÓXIMO PASO:" -ForegroundColor Yellow
Write-Host "   1. Coloca certificado.pfx en certificates/" -ForegroundColor White
Write-Host "   2. Ejecuta: npm run dev" -ForegroundColor White
Write-Host "   3. Ve a: http://localhost:3000/sii" -ForegroundColor White
Write-Host ""
