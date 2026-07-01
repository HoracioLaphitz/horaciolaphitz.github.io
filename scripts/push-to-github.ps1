# Script de Push a GitHub
# Este script verifica el estado y hace push a GitHub

Write-Host "`n🚀 PUSH A GITHUB`n" -ForegroundColor Cyan

# Verificar que estamos en un repositorio Git
if (-not (Test-Path ".git")) {
    Write-Host "❌ No es un repositorio Git" -ForegroundColor Red
    Write-Host "Ejecuta: git init" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Repositorio Git encontrado" -ForegroundColor Green

# Verificar rama actual
$currentBranch = git branch --show-current
Write-Host "📍 Rama actual: $currentBranch" -ForegroundColor Cyan

if ($currentBranch -ne "main") {
    Write-Host "⚠️  No estás en la rama 'main'" -ForegroundColor Yellow
    $response = Read-Host "¿Quieres cambiar a 'main'? (s/n)"
    if ($response -eq "s") {
        git checkout main
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Error al cambiar a 'main'" -ForegroundColor Red
            exit 1
        }
    }
}

# Verificar remote
$remote = git remote get-url origin 2>$null
if (-not $remote) {
    Write-Host "❌ Remote 'origin' no configurado" -ForegroundColor Red
    Write-Host "Ejecuta: git remote add origin <URL>" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Remote origin: $remote" -ForegroundColor Green

# Verificar estado
Write-Host "`n📊 Estado del repositorio:" -ForegroundColor Cyan
git status --short

$hasChanges = git status --short
if ($hasChanges) {
    Write-Host "`n⚠️  Hay cambios sin commitear" -ForegroundColor Yellow
    $response = Read-Host "¿Quieres hacer commit de estos cambios? (s/n)"
    
    if ($response -eq "s") {
        Write-Host "`n📝 Agregando cambios..." -ForegroundColor Cyan
        git add .
        
        $commitMessage = Read-Host "Mensaje del commit"
        if (-not $commitMessage) {
            $commitMessage = "chore: update project files"
        }
        
        git commit -m $commitMessage
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Error al hacer commit" -ForegroundColor Red
            exit 1
        }
        
        Write-Host "✅ Commit realizado" -ForegroundColor Green
    }
}

# Verificar si hay commits para pushear
$unpushedCommits = git log origin/main..HEAD --oneline 2>$null
if (-not $unpushedCommits) {
    Write-Host "`nℹ️  No hay commits nuevos para pushear" -ForegroundColor Cyan
    Write-Host "El repositorio local está sincronizado con GitHub" -ForegroundColor Green
    exit 0
}

Write-Host "`n📤 Commits a pushear:" -ForegroundColor Cyan
git log origin/main..HEAD --oneline

# Confirmar push
Write-Host "`n¿Quieres hacer push a GitHub?" -ForegroundColor Yellow
$response = Read-Host "(s/n)"

if ($response -ne "s") {
    Write-Host "❌ Push cancelado" -ForegroundColor Red
    exit 0
}

# Hacer push
Write-Host "`n🚀 Haciendo push a GitHub..." -ForegroundColor Cyan
git push origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Error al hacer push" -ForegroundColor Red
    Write-Host "`nPosibles causas:" -ForegroundColor Yellow
    Write-Host "1. No tienes permisos en el repositorio" -ForegroundColor Yellow
    Write-Host "2. Necesitas autenticarte con GitHub" -ForegroundColor Yellow
    Write-Host "3. El repositorio no existe en GitHub" -ForegroundColor Yellow
    Write-Host "`nSoluciones:" -ForegroundColor Cyan
    Write-Host "- Instala GitHub CLI: winget install --id GitHub.cli" -ForegroundColor Cyan
    Write-Host "- Autentica: gh auth login" -ForegroundColor Cyan
    Write-Host "- O usa un Personal Access Token" -ForegroundColor Cyan
    exit 1
}

Write-Host "`n✅ Push exitoso!" -ForegroundColor Green
Write-Host "`n📋 Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Ve a: https://github.com/$($remote -replace '.*github.com[:/]', '' -replace '.git$', '')" -ForegroundColor White
Write-Host "2. Click en 'Settings' → 'Pages'" -ForegroundColor White
Write-Host "3. En 'Source', selecciona 'GitHub Actions'" -ForegroundColor White
Write-Host "4. Espera a que el workflow se ejecute (pestaña 'Actions')" -ForegroundColor White
Write-Host "5. Tu sitio estará en: https://horaciolaphitz.github.io`n" -ForegroundColor White
