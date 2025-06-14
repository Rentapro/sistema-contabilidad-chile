#!/bin/bash
# setup-project.sh - Script de configuración inicial del proyecto

set -e

echo "🚀 Configurando Sistema de Contabilidad Chileno..."

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

# Verificar prerrequisitos
check_prerequisites() {
    print_status "Verificando prerrequisitos..."
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js no está instalado. Por favor instala Node.js 18 o superior."
        exit 1
    fi
    
    # Verificar versión de Node.js
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Necesitas Node.js 18 o superior. Versión actual: $(node -v)"
        exit 1
    fi
    
    # Verificar npm
    if ! command -v npm &> /dev/null; then
        print_error "npm no está instalado."
        exit 1
    fi
    
    # Verificar Git
    if ! command -v git &> /dev/null; then
        print_error "Git no está instalado."
        exit 1
    fi
    
    print_success "Prerrequisitos verificados correctamente"
}

# Instalar dependencias
install_dependencies() {
    print_status "Instalando dependencias..."
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    print_success "Dependencias instaladas correctamente"
}

# Configurar variables de entorno
setup_environment() {
    print_status "Configurando variables de entorno..."
    
    if [ ! -f ".env.local" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env.local
            print_success "Archivo .env.local creado desde .env.example"
        else
            print_warning "No se encontró .env.example. Creando .env.local básico..."
            cat > .env.local << EOF
# Configuración de desarrollo
NODE_ENV=development
NEXT_PUBLIC_BASE_PATH=
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Claves de seguridad (cambiar en producción)
ENCRYPTION_KEY=development-key-change-in-production-32
JWT_SECRET=development-jwt-secret-change-in-production
SESSION_SECRET=development-session-secret

# Base de datos (cuando se implemente)
# DATABASE_URL=postgresql://user:password@localhost:5432/contabilidad

# Servicios SII (para desarrollo - usar mock)
SII_API_URL=https://mock-sii-api.com
SII_ENVIRONMENT=development

# Email (para desarrollo - usar mock)
EMAIL_SERVICE_API_KEY=mock-sendgrid-key
EMAIL_FROM=noreply@localhost

# Logs
LOG_LEVEL=debug
EOF
            print_success "Archivo .env.local creado con configuración básica"
        fi
    else
        print_warning ".env.local ya existe. No se modificará."
    fi
}

# Generar claves de seguridad
generate_security_keys() {
    print_status "Generando claves de seguridad..."
    
    # Generar clave de encriptación (32 caracteres)
    ENCRYPTION_KEY=$(openssl rand -hex 16)
    
    # Generar JWT secret
    JWT_SECRET=$(openssl rand -base64 64)
    
    # Generar session secret
    SESSION_SECRET=$(openssl rand -base64 32)
    
    # Actualizar .env.local si existe
    if [ -f ".env.local" ]; then
        sed -i.bak "s/ENCRYPTION_KEY=.*/ENCRYPTION_KEY=$ENCRYPTION_KEY/" .env.local
        sed -i.bak "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env.local
        sed -i.bak "s/SESSION_SECRET=.*/SESSION_SECRET=$SESSION_SECRET/" .env.local
        rm .env.local.bak
        print_success "Claves de seguridad generadas y actualizadas en .env.local"
    fi
}

# Verificar configuración
verify_setup() {
    print_status "Verificando configuración..."
    
    # Verificar que se puede ejecutar type-check
    if npm run type-check > /dev/null 2>&1; then
        print_success "TypeScript configurado correctamente"
    else
        print_warning "Advertencias de TypeScript detectadas"
    fi
    
    # Verificar que se puede ejecutar lint
    if npm run lint > /dev/null 2>&1; then
        print_success "ESLint configurado correctamente"
    else
        print_warning "Advertencias de ESLint detectadas"
    fi
    
    # Verificar que se puede hacer build
    print_status "Probando build de la aplicación..."
    if npm run build > /dev/null 2>&1; then
        print_success "Build ejecutado correctamente"
    else
        print_error "Error en el build. Revisa los logs para más detalles."
        return 1
    fi
}

# Configurar Git hooks (opcional)
setup_git_hooks() {
    print_status "Configurando Git hooks..."
    
    # Crear directorio si no existe
    mkdir -p .git/hooks
    
    # Pre-commit hook
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "🔍 Ejecutando verificaciones pre-commit..."

# Ejecutar lint
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ ESLint falló. Corrige los errores antes de hacer commit."
    exit 1
fi

# Ejecutar type-check
npm run type-check
if [ $? -ne 0 ]; then
    echo "❌ TypeScript check falló. Corrige los errores antes de hacer commit."
    exit 1
fi

echo "✅ Verificaciones pre-commit completadas"
EOF
    
    chmod +x .git/hooks/pre-commit
    print_success "Git hooks configurados"
}

# Mostrar información de uso
show_usage_info() {
    print_success "🎉 ¡Configuración completada!"
    echo ""
    echo "📋 Próximos pasos:"
    echo "  1. Ejecutar en desarrollo:    npm run dev"
    echo "  2. Abrir en navegador:        http://localhost:3000"
    echo "  3. Hacer build:               npm run build"
    echo "  4. Ejecutar tests:            npm test"
    echo ""
    echo "📁 Archivos importantes:"
    echo "  - .env.local                  Variables de entorno locales"
    echo "  - DEPLOYMENT.md               Guía de despliegue"
    echo "  - CONTRIBUTING.md             Guía de contribución"
    echo "  - SECURITY.md                 Información de seguridad"
    echo ""
    echo "🔧 Comandos útiles:"
    echo "  - npm run dev                 Desarrollo con hot-reload"
    echo "  - npm run lint                Verificar código con ESLint"
    echo "  - npm run type-check          Verificar tipos TypeScript"
    echo "  - npm run build               Build para producción"
    echo ""
    echo "👥 Usuarios de prueba:"
    echo "  - SuperAdmin:    admin@sistema.com / admin123"
    echo "  - Admin Empresa: admin@empresa.com / admin123"
    echo "  - Contador:      contador@empresa.com / contador123"
    echo "  - Cliente:       cliente@empresa.com / cliente123"
}

# Función principal
main() {
    echo "🇨🇱 Sistema de Contabilidad Chileno - Setup"
    echo "=========================================="
    echo ""
    
    check_prerequisites
    install_dependencies
    setup_environment
    
    # Solo generar claves si openssl está disponible
    if command -v openssl &> /dev/null; then
        generate_security_keys
    else
        print_warning "OpenSSL no disponible. Las claves de seguridad deben configurarse manualmente."
    fi
    
    verify_setup
    
    # Configurar Git hooks solo si es un repositorio Git
    if [ -d ".git" ]; then
        setup_git_hooks
    fi
    
    show_usage_info
}

# Ejecutar función principal
main "$@"
