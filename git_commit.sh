#!/bin/bash
# Script para hacer add, commit y push de los cambios

echo "🔄 Iniciando proceso de Git..."

# Navegar al directorio del proyecto
cd "/Users/constructoracapizapallar/Downloads/PROYECTOS GPT/contabilidad"

echo "📁 Directorio actual: $(pwd)"

# Verificar status
echo "📊 Estado actual del repositorio:"
git status

# Agregar todos los archivos
echo "➕ Agregando archivos al staging area..."
git add .

# Verificar status después del add
echo "📊 Estado después del add:"
git status

# Hacer commit
echo "💾 Creando commit..."
git commit -m "docs: README completo y documentación final del sistema

📚 Documentación Completa:
- README_NUEVO.md con guía detallada del proyecto
- Descripción completa de funcionalidades y arquitectura
- Guías de instalación y configuración
- Documentación de APIs y servicios integrados
- Stack tecnológico detallado

🎯 Funcionalidades Documentadas:
- Sistema multi-tenant con 4 roles de usuario
- 23 módulos funcionales implementados
- IA Fiscal Chilena para optimización tributaria
- Demo Interactivo para presentaciones a clientes
- Business Intelligence y Analytics avanzados
- Integración completa SII Chile

🔧 Información Técnica:
- Arquitectura completa del proyecto
- Scripts de deployment y configuración
- Variables de entorno necesarias
- Estructura detallada de directorios
- Guías de contribución y estándares

✅ Estado: Documentación lista para producción"

# Push al repositorio remoto
echo "🚀 Subiendo cambios a GitHub..."
git push origin main

echo "✅ Proceso completado exitosamente!"
