#!/bin/zsh

# Script simple para verificar estado de Git
echo "=== VERIFICANDO ESTADO DE GIT ==="
cd "/Users/constructoracapizapallar/Downloads/PROYECTOS GPT/contabilidad"
pwd
echo ""
echo "Estado actual:"
git status --porcelain
echo ""
echo "Último commit:"
git log --oneline -1
echo ""
echo "Archivos en staging:"
git diff --cached --name-only
echo ""
echo "=== FIN VERIFICACIÓN ==="
