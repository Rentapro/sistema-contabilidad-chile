#!/bin/bash

# Script para guardar cambios y hacer commit
echo "🔄 Guardando cambios y haciendo commit..."

# Navegar al directorio del proyecto
cd "/Users/constructoracapizapallar/Downloads/PROYECTOS GPT/contabilidad"

# Verificar estado
echo "📋 Estado actual del repositorio:"
git status

# Agregar todos los cambios
echo "➕ Agregando archivos..."
git add .

# Verificar qué se agregó
echo "📋 Archivos en staging:"
git status --short

# Hacer commit
echo "💾 Creando commit..."
git commit -m "docs: README completo y documentación final del sistema

📚 Documentación Completa:
- README_NUEVO.md con guía detallada del proyecto
- Descripción completa de funcionalidades
- Guías de instalación y configuración
- Documentación de APIs y servicios
- Stack tecnológico detallado

🎯 Funcionalidades Documentadas:
- Sistema multi-tenant con 4 roles de usuario
- 23 módulos funcionales implementados
- IA Fiscal Chilena para optimización tributaria
- Demo Interactivo para presentaciones
- Business Intelligence y Analytics
- Integración completa SII Chile

🔧 Información Técnica:
- Arquitectura del proyecto
- Scripts de deployment
- Variables de entorno
- Estructura de directorios
- Guías de contribución

✅ Estado: Documentación lista para GitHub"

# Push al repositorio remoto
echo "🚀 Subiendo cambios a GitHub..."
git push origin main

echo "✅ ¡Proceso completado exitosamente!"
echo "🎉 Todos los cambios han sido subidos a GitHub"
