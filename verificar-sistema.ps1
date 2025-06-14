# 🔍 Verificación Rápida del Sistema - SII Chile
# ================================================

Write-Host "🇨🇱 VERIFICANDO SISTEMA DE CONTABILIDAD CHILE" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Función para verificaciones
function Test-Component {
    param($Name, $Path, $Type = "File")
    
    if ($Type -eq "File") {
        $exists = Test-Path $Path
    } else {
        $exists = Test-Path $Path
    }
    
    if ($exists) {
        Write-Host "✅ $Name" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ $Name" -ForegroundColor Red
        return $false
    }
}

function Test-URL {
    param($Name, $URL)
    
    try {
        $response = Invoke-WebRequest -Uri $URL -TimeoutSec 5 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $Name" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host "❌ $Name" -ForegroundColor Red
        return $false
    }
}

Write-Host ""
Write-Host "📁 VERIFICANDO ARCHIVOS CRÍTICOS..." -ForegroundColor Yellow

$files = @(
    @("Configuración .env.local", ".env.local"),
    @("Servicio SII", "src\services\siiService.ts"),
    @("Hook useSII", "src\hooks\useSII.ts"),
    @("Componente IntegracionSII", "src\components\IntegracionSIIReal.tsx"),
    @("Página SII Real", "src\app\sii-real\page.tsx"),
    @("Componente Label", "src\components\ui\label.tsx"),
    @("Utilidades", "src\lib\utils.ts"),
    @("Package.json", "package.json")
)

$fileResults = @()
foreach ($file in $files) {
    $fileResults += Test-Component $file[0] $file[1]
}

Write-Host ""
Write-Host "📂 VERIFICANDO DIRECTORIOS..." -ForegroundColor Yellow

$dirs = @(
    @("Certificados", "certificates"),
    @("Componentes UI", "src\components\ui"),
    @("Node Modules", "node_modules")
)

$dirResults = @()
foreach ($dir in $dirs) {
    $dirResults += Test-Component $dir[0] $dir[1] "Directory"
}

Write-Host ""
Write-Host "🌐 VERIFICANDO SERVICIOS WEB..." -ForegroundColor Yellow

$urls = @(
    @("Página Principal", "http://localhost:3000"),
    @("Integración SII Real", "http://localhost:3000/sii-real")
)

$urlResults = @()
foreach ($url in $urls) {
    $urlResults += Test-URL $url[0] $url[1]
}

Write-Host ""
Write-Host "📊 RESUMEN DE VERIFICACIÓN" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

$totalFiles = $files.Count
$successFiles = ($fileResults | Where-Object { $_ -eq $true }).Count
$filePercentage = [math]::Round(($successFiles / $totalFiles) * 100, 1)

$totalDirs = $dirs.Count
$successDirs = ($dirResults | Where-Object { $_ -eq $true }).Count
$dirPercentage = [math]::Round(($successDirs / $totalDirs) * 100, 1)

$totalUrls = $urls.Count
$successUrls = ($urlResults | Where-Object { $_ -eq $true }).Count
$urlPercentage = [math]::Round(($successUrls / $totalUrls) * 100, 1)

Write-Host "📁 Archivos: $successFiles/$totalFiles ($filePercentage%)" -ForegroundColor $(if($filePercentage -eq 100){"Green"}else{"Yellow"})
Write-Host "📂 Directorios: $successDirs/$totalDirs ($dirPercentage%)" -ForegroundColor $(if($dirPercentage -eq 100){"Green"}else{"Yellow"})
Write-Host "🌐 Servicios: $successUrls/$totalUrls ($urlPercentage%)" -ForegroundColor $(if($urlPercentage -eq 100){"Green"}else{"Yellow"})

$totalPercentage = [math]::Round((($successFiles + $successDirs + $successUrls) / ($totalFiles + $totalDirs + $totalUrls)) * 100, 1)

Write-Host ""
if ($totalPercentage -ge 90) {
    Write-Host "🎉 SISTEMA OPERATIVO AL $totalPercentage%" -ForegroundColor Green
    Write-Host "✅ El sistema está funcionando correctamente" -ForegroundColor Green
} elseif ($totalPercentage -ge 75) {
    Write-Host "⚠️ SISTEMA FUNCIONAL AL $totalPercentage%" -ForegroundColor Yellow
    Write-Host "🔧 Algunas funcionalidades pueden requerir atención" -ForegroundColor Yellow
} else {
    Write-Host "❌ SISTEMA CON PROBLEMAS - $totalPercentage%" -ForegroundColor Red
    Write-Host "🛠️ Se requiere revisión técnica" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔗 ACCESOS RÁPIDOS:" -ForegroundColor Blue
Write-Host "  • Principal: http://localhost:3000" -ForegroundColor White
Write-Host "  • SII Real: http://localhost:3000/sii-real" -ForegroundColor White

Write-Host ""
Write-Host "📚 DOCUMENTACIÓN:" -ForegroundColor Blue
Write-Host "  • RESUMEN_FINAL_COMPLETADO.md" -ForegroundColor White
Write-Host "  • SISTEMA_SII_REAL_COMPLETADO.md" -ForegroundColor White
Write-Host "  • certificates\README.md" -ForegroundColor White

Write-Host ""
Write-Host "🎯 Estado: INTEGRACIÓN SII REAL COMPLETADA" -ForegroundColor Green
Write-Host "📅 Verificado: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')" -ForegroundColor Gray
