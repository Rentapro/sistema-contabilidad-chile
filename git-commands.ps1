# Script para comandos Git sin conflictos con Pester
# Uso: .\git-commands.ps1 <comando>
# Ejemplo: .\git-commands.ps1 status
# Ejemplo: .\git-commands.ps1 "add ."
# Ejemplo: .\git-commands.ps1 "commit -m 'mensaje'"
# Ejemplo: .\git-commands.ps1 "push origin main"

param(
    [Parameter(Mandatory=$true)]
    [string]$GitCommand
)

# Usar git.exe para evitar conflicto con Pester
$fullCommand = "git.exe $GitCommand"
Write-Host "Ejecutando: $fullCommand" -ForegroundColor Green

try {
    Invoke-Expression $fullCommand
    Write-Host "Comando ejecutado exitosamente" -ForegroundColor Green
} catch {
    Write-Host "Error al ejecutar comando: $($_.Exception.Message)" -ForegroundColor Red
}
