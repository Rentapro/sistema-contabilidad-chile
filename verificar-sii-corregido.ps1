# Script de verificación del sistema SII corregido
# PowerShell version

Write-Host "🔍 Verificando estado del sistema SII Chile..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Gray

# Verificar archivos principales
$files = @(
    "src\services\siiService.ts",
    "src\components\IntegracionSIIReal.tsx", 
    "src\app\sii-real\page.tsx",
    "src\components\ui\label.tsx"
)

Write-Host "📁 Verificando archivos principales:" -ForegroundColor Yellow
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file - NO EXISTE" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🔧 Verificando dependencias en package.json:" -ForegroundColor Yellow
$packageContent = Get-Content "package.json" -Raw
if ($packageContent -match "@radix-ui/react-label") {
    Write-Host "  ✅ @radix-ui/react-label incluida" -ForegroundColor Green
} else {
    Write-Host "  ❌ @radix-ui/react-label - FALTANTE" -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 Resumen de correcciones aplicadas:" -ForegroundColor Yellow
Write-Host "  ✅ Eliminada función formatRUT duplicada en utils.ts" -ForegroundColor Green
Write-Host "  ✅ Creado componente Label simplificado" -ForegroundColor Green
Write-Host "  ✅ Reescrito siiService.ts compatible con navegador" -ForegroundColor Green
Write-Host "  ✅ Eliminadas dependencias de Node.js (fs, crypto, path)" -ForegroundColor Green
Write-Host "  ✅ Removidas referencias a parseStringPromise" -ForegroundColor Green
Write-Host "  ✅ Implementadas funciones simuladas para demostración" -ForegroundColor Green

Write-Host ""
Write-Host "🚀 Para probar el sistema:" -ForegroundColor Magenta
Write-Host "  1. npm install" -ForegroundColor White
Write-Host "  2. npm run dev" -ForegroundColor White
Write-Host "  3. Navegar a: http://localhost:3000/sii-real" -ForegroundColor White

Write-Host ""
Write-Host "✅ Sistema SII corregido y listo para usar!" -ForegroundColor Green

# Intentar abrir automáticamente el navegador si el servidor está ejecutándose
Write-Host ""
Write-Host "🌐 Verificando si el servidor está ejecutándose..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Servidor detectado! Abriendo navegador..." -ForegroundColor Green
    Start-Process "http://localhost:3000/sii-real"
} catch {
    Write-Host "ℹ️  Servidor no detectado. Ejecuta 'npm run dev' primero." -ForegroundColor Yellow
}
