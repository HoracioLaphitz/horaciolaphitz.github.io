# Script: Initialize Git Branch Structure
# Purpose: Create and configure all branches according to branch strategy
# Usage: .\scripts\init-branches.ps1

Write-Host "🌿 Initializing Git branch structure..." -ForegroundColor Green

# Ensure we're on main
Write-Host "📍 Switching to main branch..." -ForegroundColor Cyan
git checkout main
git pull origin main

# Create develop branch
Write-Host "📝 Creating develop branch..." -ForegroundColor Cyan
$developExists = git show-ref --verify --quiet refs/heads/develop
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ develop branch already exists" -ForegroundColor Yellow
} else {
    git checkout -b develop
    git push -u origin develop
    Write-Host "✅ develop branch created" -ForegroundColor Green
}

# Return to main
git checkout main

Write-Host ""
Write-Host "✅ Branch structure initialized successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Branch structure:" -ForegroundColor Cyan
Write-Host "  main     → Production (protected)" -ForegroundColor White
Write-Host "  develop  → Integration (protected)" -ForegroundColor White
Write-Host ""
Write-Host "To create feature branches:" -ForegroundColor Cyan
Write-Host "  git checkout develop" -ForegroundColor White
Write-Host "  git checkout -b feature/your-feature-name" -ForegroundColor White
Write-Host ""
Write-Host "To create hotfix branches:" -ForegroundColor Cyan
Write-Host "  git checkout main" -ForegroundColor White
Write-Host "  git checkout -b hotfix/critical-fix" -ForegroundColor White
Write-Host ""
Write-Host "See .github/BRANCH_STRATEGY.md for complete documentation" -ForegroundColor Yellow
