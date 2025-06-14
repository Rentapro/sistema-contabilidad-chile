# setup-github.ps1 - Script para configurar el proyecto en GitHub (Windows)

param(
    [switch]$Help
)

# Colores para output
$Colors = @{
    Red = "Red"
    Green = "Green"
    Yellow = "Yellow"
    Blue = "Blue"
    White = "White"
}

function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Colors.Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Colors.Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Colors.Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Colors.Red
}

function Show-Help {
    Write-Host @"
🇨🇱 Sistema de Contabilidad Chileno - Configuración GitHub
========================================================

Este script configura el proyecto para despliegue en GitHub.

Uso:
    .\setup-github.ps1           # Ejecutar configuración completa
    .\setup-github.ps1 -Help     # Mostrar esta ayuda

Prerrequisitos:
    - Git instalado y configurado
    - PowerShell 5.1 o superior
    - Proyecto inicializado

El script verificará y configurará:
    ✓ Repositorio Git
    ✓ Configuración de usuario Git
    ✓ Archivos sensibles
    ✓ Branch principal
    ✓ Workflow de GitHub Actions
    ✓ Claves de seguridad
"@
}

function Test-GitRepo {
    if (-not (Test-Path ".git")) {
        Write-Error "Este directorio no es un repositorio Git."
        Write-Host "Ejecuta: git init"
        exit 1
    }
    Write-Success "Repositorio Git detectado"
}

function Set-GitConfig {
    $gitName = git config --global user.name
    if (-not $gitName) {
        $name = Read-Host "Ingresa tu nombre para Git"
        git config --global user.name $name
    }
    
    $gitEmail = git config --global user.email
    if (-not $gitEmail) {
        $email = Read-Host "Ingresa tu email para Git"
        git config --global user.email $email
    }
    
    Write-Success "Configuración de Git completada"
}

function Test-GitIgnore {
    Write-Status "Verificando .gitignore..."
    
    if (-not (Test-Path ".gitignore")) {
        Write-Warning ".gitignore no encontrado. Debería estar creado."
        exit 1
    }
    
    Write-Success ".gitignore configurado correctamente"
}

function Test-SensitiveFiles {
    Write-Status "Verificando archivos sensibles..."
    
    $sensitivePatterns = @(
        ".env",
        ".env.local", 
        ".env.production",
        "*.key",
        "*.pem",
        "ecosystem.config.js",
        "secrets/",
        "certificates/"
    )
    
    foreach ($pattern in $sensitivePatterns) {
        try {
            $result = git ls-files --error-unmatch $pattern 2>$null
            if ($result) {
                Write-Error "¡PELIGRO! Archivo sensible detectado en Git: $pattern"
                Write-Host "Ejecuta: git rm --cached $pattern"
                Write-Host "Y añádelo a .gitignore"
                exit 1
            }
        }
        catch {
            # El archivo no está siendo trackeado, que es lo que queremos
        }
    }
    
    Write-Success "No se detectaron archivos sensibles en Git"
}

function Set-MainBranch {
    $currentBranch = git rev-parse --abbrev-ref HEAD
    
    if ($currentBranch -ne "main" -and $currentBranch -ne "master") {
        Write-Status "Cambiando a branch main..."
        try {
            git checkout -b main 2>$null
        }
        catch {
            git checkout main
        }
    }
    
    $newBranch = git rev-parse --abbrev-ref HEAD
    Write-Success "Branch principal configurado: $newBranch"
}

function New-GitHubSecrets {
    Write-Status "Generando claves para GitHub Secrets..."
    
    Write-Host ""
    Write-Host "=== CLAVES PARA GITHUB SECRETS ===" -ForegroundColor $Colors.Yellow
    Write-Host "Configura estas variables en Settings > Secrets and variables > Actions:" -ForegroundColor $Colors.Yellow
    Write-Host ""
    
    # Verificar si OpenSSL está disponible
    $opensslAvailable = $false
    try {
        $null = Get-Command openssl -ErrorAction Stop
        $opensslAvailable = $true
    }
    catch {
        # OpenSSL no disponible, usar .NET
    }
    
    if ($opensslAvailable) {
        $encryptionKey = & openssl rand -hex 16
        $jwtSecret = & openssl rand -base64 64
        
        Write-Host "ENCRYPTION_KEY:"
        Write-Host $encryptionKey -ForegroundColor $Colors.Green
        Write-Host ""
        Write-Host "JWT_SECRET:"
        Write-Host $jwtSecret -ForegroundColor $Colors.Green
        Write-Host ""
    }
    else {
        # Generar con .NET si OpenSSL no está disponible
        $rng = [System.Security.Cryptography.RNGCryptoServiceProvider]::new()
        
        # Encryption Key (32 bytes hex)
        $encryptionBytes = New-Object byte[] 16
        $rng.GetBytes($encryptionBytes)
        $encryptionKey = [BitConverter]::ToString($encryptionBytes) -replace '-'
        
        # JWT Secret (64 bytes base64)
        $jwtBytes = New-Object byte[] 48
        $rng.GetBytes($jwtBytes)
        $jwtSecret = [Convert]::ToBase64String($jwtBytes)
        
        Write-Host "ENCRYPTION_KEY:"
        Write-Host $encryptionKey -ForegroundColor $Colors.Green
        Write-Host ""
        Write-Host "JWT_SECRET:"
        Write-Host $jwtSecret -ForegroundColor $Colors.Green
        Write-Host ""
        
        $rng.Dispose()
    }
    
    Write-Host "Otras variables opcionales:"
    Write-Host "SII_API_KEY: (si tienes acceso real al SII)"
    Write-Host "EMAIL_SERVICE_API_KEY: (para SendGrid u otro servicio)"
    Write-Host ""
    Write-Host "=================================="
    Write-Host ""
}

function Test-GitHubWorkflow {
    if (Test-Path ".github/workflows/deploy.yml") {
        Write-Success "Workflow de GitHub Actions configurado"
    }
    else {
        Write-Error "Workflow de GitHub Actions no encontrado"
        exit 1
    }
}

function New-InitialCommit {
    try {
        $null = git log --oneline 2>$null
        Write-Success "Repositorio ya tiene commits"
    }
    catch {
        Write-Status "Creando commit inicial..."
        git add .
        git commit -m @"
🚀 Initial commit - Sistema de Contabilidad Chileno

✨ Features:
- Multi-tenant architecture for accounting firms
- SII Chile integration ready
- Role-based access control
- AI-powered automation
- Modern React/Next.js interface
- Docker support
- GitHub Actions CI/CD

🔧 Tech Stack:
- Next.js 14 + TypeScript
- React + Tailwind CSS
- Node.js 18+
- Docker ready
- PostgreSQL ready (future)

📚 Documentation:
- README.md with complete setup guide
- DEPLOYMENT.md for production deployment
- CONTRIBUTING.md for development guidelines
- SECURITY.md for security best practices

Ready for production deployment! 🚀
"@
        
        Write-Success "Commit inicial creado"
    }
}

function Set-GitHubPages {
    $setupPages = Read-Host "¿Quieres configurar GitHub Pages? (y/N)"
    
    if ($setupPages -match "^[Yy]$") {
        Write-Status "Para configurar GitHub Pages:"
        Write-Host "1. Ve a Settings > Pages en tu repositorio de GitHub"
        Write-Host "2. Selecciona 'GitHub Actions' como source"
        Write-Host "3. El workflow ya está configurado en .github/workflows/deploy.yml"
        Write-Host "4. Configura las siguientes variables en Settings > Secrets and variables > Actions:"
        Write-Host "   - ENCRYPTION_KEY (tu clave de encriptación)"
        Write-Host "   - JWT_SECRET (tu clave JWT)"
        Write-Host ""
        Write-Warning "¡IMPORTANTE! Nunca subas claves reales al repositorio público"
    }
}

function Show-GitHubInstructions {
    Write-Host ""
    Write-Host "INSTRUCCIONES PARA GITHUB" -ForegroundColor $Colors.Blue
    Write-Host "============================" -ForegroundColor $Colors.Blue
    Write-Host ""
    Write-Host "1. CREAR REPOSITORIO EN GITHUB:"
    Write-Host "   - Ve a https://github.com/new"
    Write-Host "   - Nombre: sistema-contabilidad-chile"
    Write-Host "   - Descripcion: Sistema integral de contabilidad para el mercado chileno"
    Write-Host "   - Publico o Privado (tu eleccion)"
    Write-Host "   - NO inicialices con README, .gitignore o LICENSE"
    Write-Host ""
    Write-Host "2. CONECTAR REPOSITORIO LOCAL:"
    Write-Host "   git remote add origin https://github.com/TU_USUARIO/sistema-contabilidad-chile.git"
    Write-Host "   git branch -M main"
    Write-Host "   git push -u origin main"
    Write-Host ""
    Write-Host "3. CONFIGURAR SECRETS (Settings > Secrets and variables > Actions):"
    Write-Host "   - ENCRYPTION_KEY"
    Write-Host "   - JWT_SECRET"
    Write-Host "   - (otros secrets segun necesites)"
    Write-Host ""
    Write-Host "4. CONFIGURAR GITHUB PAGES (Settings > Pages):"
    Write-Host "   - Source: GitHub Actions"
    Write-Host "   - El workflow se ejecutara automaticamente"
    Write-Host ""
    Write-Host "5. CONFIGURAR PROTECCION DE BRANCH (Settings > Branches):"
    Write-Host "   - Proteger branch 'main'"
    Write-Host "   - Requerir status checks"
    Write-Host "   - Requerir branches actualizados"
    Write-Host ""
    Write-Host "6. CONFIGURAR ISSUES Y PROJECTS:"
    Write-Host "   - Habilitar Issues"
    Write-Host "   - Usar templates en .github/ISSUE_TEMPLATE/"
    Write-Host "   - Configurar Projects para gestion"
    Write-Host ""
    Write-Host "URL del sitio (despues del despliegue):" -ForegroundColor $Colors.Green
    Write-Host "https://TU_USUARIO.github.io/sistema-contabilidad-chile" -ForegroundColor $Colors.Green
    Write-Host ""
}

function Main {
    if ($Help) {
        Show-Help
        return
    }
      Write-Host "Sistema de Contabilidad Chileno - Configuracion GitHub" -ForegroundColor $Colors.Blue
    Write-Host "==========================================================" -ForegroundColor $Colors.Blue
    Write-Host ""
    
    Test-GitRepo
    Set-GitConfig
    Test-GitIgnore
    Test-SensitiveFiles
    Set-MainBranch
    Test-GitHubWorkflow
    New-InitialCommit
    New-GitHubSecrets
    Set-GitHubPages
    Show-GitHubInstructions
      Write-Success "Configuracion para GitHub completada!"
    Write-Warning "Recuerda configurar los secrets en GitHub antes del primer despliegue"
}

# Ejecutar función principal
Main
