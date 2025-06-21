# Solución al Conflicto Git + PowerShell/Pester

## 🚨 Problema
Cuando PowerShell tiene Pester cargado, los comandos `git` que contienen "it" (como `git commit`) causan errores porque Pester intercepta estos comandos.

## ✅ Soluciones

### Solución 1: Usar git.exe (Inmediata)
```powershell
# En lugar de:
git status
git commit -m "mensaje"
git push origin main

# Usar:
git.exe status
git.exe commit -m "mensaje"
git.exe push origin main
```

### Solución 2: Script Git-Commands
```powershell
# Ejecutar comandos git usando el script
.\git-commands.ps1 status
.\git-commands.ps1 "add ."
.\git-commands.ps1 "commit -m 'Optimización estructura usuarios Zoho'"
.\git-commands.ps1 "push origin main"
```

### Solución 3: Aliases (Recomendada)
```powershell
# Cargar aliases (hacer esto al inicio de cada sesión)
. .\git-aliases.ps1

# Usar aliases cortos
gs              # git status
ga .            # git add .
gc -m "mensaje" # git commit -m "mensaje"
gp origin main  # git push origin main
gl              # git log

# Comando combinado
gacp "mensaje"  # git add . + commit + push
```

### Solución 4: Perfil PowerShell (Permanente)
Para cargar automáticamente los aliases en cada sesión:

1. Verificar si existe perfil:
```powershell
Test-Path $PROFILE
```

2. Crear/editar perfil:
```powershell
New-Item -Path $PROFILE -Type File -Force
notepad $PROFILE
```

3. Agregar al perfil:
```powershell
# Cargar aliases de Git al iniciar PowerShell
if (Test-Path "C:\Users\dfa21\OneDrive\Documentos\Proyectos IA\sistema-contabilidad-chile\git-aliases.ps1") {
    . "C:\Users\dfa21\OneDrive\Documentos\Proyectos IA\sistema-contabilidad-chile\git-aliases.ps1"
}
```

## 🎯 Uso Recomendado

Para commits rápidos del proyecto:
```powershell
# Cargar aliases
. .\git-aliases.ps1

# Commit y push en una línea
gacp "Optimización estructura usuarios Zoho multi-tenant"

# O paso a paso
ga .
gc -m "Mensaje descriptivo del commit"
gp origin main
```

## 📋 Lista de Aliases Disponibles

| Alias | Comando Original | Descripción |
|-------|------------------|-------------|
| `gs` | `git.exe status` | Ver estado del repositorio |
| `ga` | `git.exe add` | Agregar archivos |
| `gc` | `git.exe commit` | Hacer commit |
| `gp` | `git.exe push` | Hacer push |
| `gl` | `git.exe log --oneline -10` | Ver últimos 10 commits |
| `gd` | `git.exe diff` | Ver diferencias |
| `gb` | `git.exe branch` | Gestionar ramas |
| `gco` | `git.exe checkout` | Cambiar rama |
| `gacp` | add + commit + push | Comando combinado |
| `quick-commit` | add + commit | Solo add y commit |

## 🔧 Verificación

Para verificar que no hay conflictos:
```powershell
Get-Module Pester  # Si muestra algo, usar las soluciones arriba
gs                 # Debería funcionar sin errores
```

## ✨ Estado Actual
- ✅ Git push realizado exitosamente
- ✅ Scripts de solución creados
- ✅ Aliases configurados y probados
- ✅ Sistema multi-tenant optimizado
- ✅ Estructura Zoho implementada
