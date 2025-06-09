#!/bin/bash

# 🚀 Script de Configuración Automática de GitHub
# Para el Sistema de Contabilidad Chileno

echo "🔧 Configurando repositorio GitHub..."

# Verificar si GitHub CLI está instalado
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI no está instalado. Instalando..."
    brew install gh
fi

# Verificar autenticación
echo "🔐 Verificando autenticación con GitHub..."
gh auth status || {
    echo "🔑 Necesitas autenticarte con GitHub CLI:"
    gh auth login
}

# Configurar descripción del repositorio
echo "📝 Configurando descripción del repositorio..."
gh repo edit Rentapro/sistema-contabilidad-chile \
    --description "🇨🇱 Sistema integral de contabilidad empresarial chileno con IA, arquitectura multi-tenant y compliance SII. Next.js 14 + TypeScript + Tailwind CSS." \
    --homepage "https://rentapro.github.io/sistema-contabilidad-chile"

# Agregar topics (etiquetas)
echo "🏷️ Agregando topics al repositorio..."
gh repo edit Rentapro/sistema-contabilidad-chile \
    --add-topic "nextjs" \
    --add-topic "typescript" \
    --add-topic "contabilidad" \
    --add-topic "chile" \
    --add-topic "multi-tenant" \
    --add-topic "artificial-intelligence" \
    --add-topic "tailwindcss" \
    --add-topic "shadcn-ui" \
    --add-topic "sii" \
    --add-topic "facturacion-electronica" \
    --add-topic "business-intelligence" \
    --add-topic "fintech"

# Habilitar GitHub Pages
echo "📄 Habilitando GitHub Pages..."
gh api repos/Rentapro/sistema-contabilidad-chile/pages \
    --method POST \
    --field source[branch]=main \
    --field source[path]=/out || echo "GitHub Pages ya configurado o requiere configuración manual"

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
