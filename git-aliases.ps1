# Aliases para Git sin conflictos con Pester
# Ejecutar este archivo: . .\git-aliases.ps1

# Aliases básicos
function gs { git.exe status }
function ga { git.exe add $args }
function gc { git.exe commit $args }
function gp { git.exe push $args }
function gl { git.exe log --oneline -10 }
function gd { git.exe diff $args }
function gb { git.exe branch $args }
function gco { git.exe checkout $args }

# Comandos compuestos útiles
function gacp {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Message
    )
    git.exe add .
    git.exe commit -m $Message
    git.exe push origin main
}

function quick-commit {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Message
    )
    git.exe add .
    git.exe commit -m $Message
}

Write-Host "Aliases de Git cargados:" -ForegroundColor Green
Write-Host "gs = git status" -ForegroundColor Yellow
Write-Host "ga = git add" -ForegroundColor Yellow
Write-Host "gc = git commit" -ForegroundColor Yellow
Write-Host "gp = git push" -ForegroundColor Yellow
Write-Host "gl = git log" -ForegroundColor Yellow
Write-Host "gd = git diff" -ForegroundColor Yellow
Write-Host "gb = git branch" -ForegroundColor Yellow
Write-Host "gco = git checkout" -ForegroundColor Yellow
Write-Host "gacp 'mensaje' = add + commit + push" -ForegroundColor Yellow
Write-Host "quick-commit 'mensaje' = add + commit" -ForegroundColor Yellow
