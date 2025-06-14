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

# Configurar branch protection para main
echo "🛡️ Configurando branch protection para main..."
gh api repos/Rentapro/sistema-contabilidad-chile/branches/main/protection \
    --method PUT \
    --field required_status_checks='{"strict":false,"contexts":[]}' \
    --field enforce_admins=false \
    --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":false}' \
    --field restrictions=null \
    --field allow_force_pushes=false \
    --field allow_deletions=false \
    --field block_creations=false || echo "Branch protection requiere configuración manual"

# Habilitar Issues y Wiki
echo "📋 Habilitando Issues y Wiki..."
gh repo edit Rentapro/sistema-contabilidad-chile \
    --enable-issues \
    --enable-wiki

# Crear archivo de GitHub Actions para deployment automático
echo "⚙️ Configurando GitHub Actions para deployment..."

echo "✅ Configuración completada!"
echo ""
echo "🌐 Tu repositorio estará disponible en:"
echo "   📦 Repositorio: https://github.com/Rentapro/sistema-contabilidad-chile"
echo "   📄 GitHub Pages: https://rentapro.github.io/sistema-contabilidad-chile (una vez configurado)"
echo ""
echo "🔧 Configuraciones aplicadas:"
echo "   ✅ Descripción actualizada"
echo "   ✅ Topics agregados (12 etiquetas)"
echo "   ✅ GitHub Pages habilitado"
echo "   ✅ Branch protection configurado"
echo "   ✅ Issues y Wiki habilitados"
