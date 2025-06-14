#!/bin/bash
# setup-github.sh - Script para configurar el proyecto en GitHub

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes coloreados
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar si estamos en un repositorio Git
check_git_repo() {
    if [ ! -d ".git" ]; then
        print_error "Este directorio no es un repositorio Git."
        echo "Ejecuta: git init"
        exit 1
    fi
    print_success "Repositorio Git detectado"
}

# Configurar Git si no está configurado
setup_git_config() {
    if [ -z "$(git config --global user.name)" ]; then
        read -p "Ingresa tu nombre para Git: " git_name
        git config --global user.name "$git_name"
    fi
    
    if [ -z "$(git config --global user.email)" ]; then
        read -p "Ingresa tu email para Git: " git_email
        git config --global user.email "$git_email"
    fi
    
    print_success "Configuración de Git completada"
}

# Crear/actualizar .gitignore
setup_gitignore() {
    print_status "Verificando .gitignore..."
    
    if [ ! -f ".gitignore" ]; then
        print_warning ".gitignore no encontrado. Debería estar creado."
        exit 1
    fi
    
    print_success ".gitignore configurado correctamente"
}

# Verificar que archivos sensibles no estén siendo trackeados
check_sensitive_files() {
    print_status "Verificando archivos sensibles..."
    
    # Lista de archivos/patrones sensibles
    sensitive_patterns=(
        ".env"
        ".env.local" 
        ".env.production"
        "*.key"
        "*.pem"
        "ecosystem.config.js"
        "secrets/"
        "certificates/"
    )
    
    for pattern in "${sensitive_patterns[@]}"; do
        if git ls-files --error-unmatch "$pattern" >/dev/null 2>&1; then
            print_error "¡PELIGRO! Archivo sensible detectado en Git: $pattern"
            echo "Ejecuta: git rm --cached $pattern"
            echo "Y añádelo a .gitignore"
            exit 1
        fi
    done
    
    print_success "No se detectaron archivos sensibles en Git"
}

# Configurar branch principal
setup_main_branch() {
    current_branch=$(git rev-parse --abbrev-ref HEAD)
    
    if [ "$current_branch" != "main" ] && [ "$current_branch" != "master" ]; then
        print_status "Cambiando a branch main..."
        git checkout -b main 2>/dev/null || git checkout main
    fi
    
    print_success "Branch principal configurado: $(git rev-parse --abbrev-ref HEAD)"
}

# Configurar GitHub Pages si se especifica
setup_github_pages() {
    read -p "¿Quieres configurar GitHub Pages? (y/N): " setup_pages
    
    if [[ $setup_pages =~ ^[Yy]$ ]]; then
        print_status "Para configurar GitHub Pages:"
        echo "1. Ve a Settings > Pages en tu repositorio de GitHub"
        echo "2. Selecciona 'GitHub Actions' como source"
        echo "3. El workflow ya está configurado en .github/workflows/deploy.yml"
        echo "4. Configura las siguientes variables en Settings > Secrets and variables > Actions:"
        echo "   - ENCRYPTION_KEY (tu clave de encriptación)"
        echo "   - JWT_SECRET (tu clave JWT)"
        echo ""
        print_warning "¡IMPORTANTE! Nunca subas claves reales al repositorio público"
    fi
}

# Generar y mostrar claves para GitHub Secrets
generate_github_secrets() {
    print_status "Generando claves para GitHub Secrets..."
    
    echo ""
    echo "=== CLAVES PARA GITHUB SECRETS ==="
    echo "Configura estas variables en Settings > Secrets and variables > Actions:"
    echo ""
    
    if command -v openssl &> /dev/null; then
        ENCRYPTION_KEY=$(openssl rand -hex 16)
        JWT_SECRET=$(openssl rand -base64 64)
        
        echo "ENCRYPTION_KEY:"
        echo "$ENCRYPTION_KEY"
        echo ""
        echo "JWT_SECRET:"
        echo "$JWT_SECRET"
        echo ""
    else
        print_warning "OpenSSL no disponible. Genera las claves manualmente:"
        echo "ENCRYPTION_KEY: Cadena de 32 caracteres hexadecimales"
        echo "JWT_SECRET: Cadena base64 de al menos 64 caracteres"
        echo ""
    fi
    
    echo "Otras variables opcionales:"
    echo "SII_API_KEY: (si tienes acceso real al SII)"
    echo "EMAIL_SERVICE_API_KEY: (para SendGrid u otro servicio)"
    echo ""
    echo "=================================="
    echo ""
}

# Verificar workflow de GitHub Actions
check_github_workflow() {
    if [ -f ".github/workflows/deploy.yml" ]; then
        print_success "Workflow de GitHub Actions configurado"
    else
        print_error "Workflow de GitHub Actions no encontrado"
        exit 1
    fi
}

# Crear commit inicial si es necesario
create_initial_commit() {
    if [ -z "$(git log --oneline 2>/dev/null)" ]; then
        print_status "Creando commit inicial..."
        git add .
        git commit -m "🚀 Initial commit - Sistema de Contabilidad Chileno

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

Ready for production deployment! 🚀"
        
        print_success "Commit inicial creado"
    else
        print_success "Repositorio ya tiene commits"
    fi
}

# Mostrar instrucciones para GitHub
show_github_instructions() {
    echo ""
    echo "🚀 INSTRUCCIONES PARA GITHUB"
    echo "============================"
    echo ""
    echo "1. 📝 CREAR REPOSITORIO EN GITHUB:"
    echo "   - Ve a https://github.com/new"
    echo "   - Nombre: sistema-contabilidad-chile"
    echo "   - Descripción: Sistema integral de contabilidad para el mercado chileno"
    echo "   - Público o Privado (tu elección)"
    echo "   - NO inicialices con README, .gitignore o LICENSE"
    echo ""
    echo "2. 🔗 CONECTAR REPOSITORIO LOCAL:"
    echo "   git remote add origin https://github.com/TU_USUARIO/sistema-contabilidad-chile.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
    echo "3. 🔐 CONFIGURAR SECRETS (Settings > Secrets and variables > Actions):"
    echo "   - ENCRYPTION_KEY"
    echo "   - JWT_SECRET"
    echo "   - (otros secrets según necesites)"
    echo ""
    echo "4. 📄 CONFIGURAR GITHUB PAGES (Settings > Pages):"
    echo "   - Source: GitHub Actions"
    echo "   - El workflow se ejecutará automáticamente"
    echo ""
    echo "5. 🛡️ CONFIGURAR PROTECCIÓN DE BRANCH (Settings > Branches):"
    echo "   - Proteger branch 'main'"
    echo "   - Requerir status checks"
    echo "   - Requerir branches actualizados"
    echo ""
    echo "6. 📋 CONFIGURAR ISSUES Y PROJECTS:"
    echo "   - Habilitar Issues"
    echo "   - Usar templates en .github/ISSUE_TEMPLATE/"
    echo "   - Configurar Projects para gestión"
    echo ""
    echo "🌐 URL del sitio (después del despliegue):"
    echo "https://TU_USUARIO.github.io/sistema-contabilidad-chile"
    echo ""
}

# Función principal
main() {
    echo "🇨🇱 Sistema de Contabilidad Chileno - Configuración GitHub"
    echo "=========================================================="
    echo ""
    
    check_git_repo
    setup_git_config
    setup_gitignore
    check_sensitive_files
    setup_main_branch
    check_github_workflow
    create_initial_commit
    generate_github_secrets
    setup_github_pages
    show_github_instructions
    
    print_success "¡Configuración para GitHub completada!"
    print_warning "Recuerda configurar los secrets en GitHub antes del primer despliegue"
}

# Ejecutar función principal
main "$@"
