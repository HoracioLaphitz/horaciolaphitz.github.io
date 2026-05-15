# Security Cleanup Script (PowerShell)
# Este script ayuda a verificar y limpiar información sensible del historial de git

Write-Host "🔒 Security Cleanup Script" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar si .env está en el historial de git
Write-Host "📋 Verificando archivos sensibles en el historial de git..." -ForegroundColor Yellow
Write-Host ""

$envInHistory = (git log --all --full-history -- .env .env.production 2>$null | Measure-Object -Line).Lines

if ($envInHistory -gt 0) {
    Write-Host "⚠️  ADVERTENCIA: Archivos .env encontrados en el historial de git" -ForegroundColor Red
    Write-Host ""
    Write-Host "Archivos encontrados:"
    git log --all --full-history --oneline -- .env .env.production
    Write-Host ""
    Write-Host "Recomendación: Considera limpiar el historial de git" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Opciones:"
    Write-Host "1. Usar BFG Repo-Cleaner: https://rtyley.github.io/bfg-repo-cleaner/"
    Write-Host "2. Usar git filter-branch (más complejo)"
    Write-Host "3. Crear un nuevo repositorio limpio"
    Write-Host ""
    Write-Host "⚠️  IMPORTANTE: Después de limpiar el historial, DEBES rotar todas las API keys expuestas" -ForegroundColor Red
    Write-Host ""
} else {
    Write-Host "✅ No se encontraron archivos .env en el historial de git" -ForegroundColor Green
    Write-Host ""
}

# 2. Verificar que .env está en .gitignore
Write-Host "📋 Verificando .gitignore..." -ForegroundColor Yellow
Write-Host ""

$gitignoreContent = Get-Content .gitignore -Raw
if ($gitignoreContent -match "\.env" -and $gitignoreContent -match "\.env\.production") {
    Write-Host "✅ .env y .env.production están en .gitignore" -ForegroundColor Green
} else {
    Write-Host "⚠️  Advertencia: Verifica que .env esté correctamente en .gitignore" -ForegroundColor Yellow
}
Write-Host ""

# 3. Verificar que .env no está trackeado actualmente
Write-Host "📋 Verificando archivos trackeados..." -ForegroundColor Yellow
Write-Host ""

$trackedEnv = (git ls-files | Select-String -Pattern "^\.env").Count

if ($trackedEnv -gt 0) {
    Write-Host "⚠️  ADVERTENCIA: Archivos .env están siendo trackeados por git" -ForegroundColor Red
    Write-Host ""
    Write-Host "Archivos trackeados:"
    git ls-files | Select-String -Pattern "^\.env"
    Write-Host ""
    Write-Host "Para dejar de trackear estos archivos:"
    Write-Host "  git rm --cached .env .env.production"
    Write-Host "  git commit -m 'security: remove .env files from tracking'"
    Write-Host ""
} else {
    Write-Host "✅ No hay archivos .env siendo trackeados" -ForegroundColor Green
}
Write-Host ""

# 4. Verificar que existe .env.example
Write-Host "📋 Verificando .env.example..." -ForegroundColor Yellow
Write-Host ""

if (Test-Path ".env.example") {
    Write-Host "✅ .env.example existe" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env.example no existe. Considera crearlo como plantilla" -ForegroundColor Yellow
}
Write-Host ""

# 5. Auditar dependencias
Write-Host "📋 Auditando dependencias de seguridad..." -ForegroundColor Yellow
Write-Host ""

if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    pnpm audit --audit-level=moderate
} else {
    Write-Host "⚠️  pnpm no está instalado. Instálalo para auditar dependencias" -ForegroundColor Yellow
}
Write-Host ""

# 6. Resumen
Write-Host "==========================" -ForegroundColor Cyan
Write-Host "🎯 Resumen de Seguridad" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan
Write-Host ""

if ($envInHistory -eq 0 -and $trackedEnv -eq 0) {
    Write-Host "✅ Estado de seguridad: BUENO" -ForegroundColor Green
    Write-Host ""
    Write-Host "Recomendaciones:"
    Write-Host "- Mantén tus dependencias actualizadas"
    Write-Host "- Rota tus API keys periódicamente"
    Write-Host "- Ejecuta este script regularmente"
} else {
    Write-Host "⚠️  Estado de seguridad: REQUIERE ATENCIÓN" -ForegroundColor Red
    Write-Host ""
    Write-Host "Acciones requeridas:"
    if ($envInHistory -gt 0) {
        Write-Host "- Limpiar archivos .env del historial de git"
        Write-Host "- Rotar todas las API keys expuestas"
    }
    if ($trackedEnv -gt 0) {
        Write-Host "- Dejar de trackear archivos .env"
    }
}
Write-Host ""

Write-Host "Para más información, consulta SECURITY.md"
