#!/bin/bash
# Script: Initialize Git Branch Structure
# Purpose: Create and configure all branches according to branch strategy
# Usage: bash scripts/init-branches.sh

set -e

echo "🌿 Initializing Git branch structure..."

# Ensure we're on main
git checkout main
git pull origin main

# Create develop branch
echo "📝 Creating develop branch..."
if git show-ref --verify --quiet refs/heads/develop; then
    echo "✅ develop branch already exists"
else
    git checkout -b develop
    git push -u origin develop
    echo "✅ develop branch created"
fi

# Return to main
git checkout main

echo ""
echo "✅ Branch structure initialized successfully!"
echo ""
echo "Branch structure:"
echo "  main     → Production (protected)"
echo "  develop  → Integration (protected)"
echo ""
echo "To create feature branches:"
echo "  git checkout develop"
echo "  git checkout -b feature/your-feature-name"
echo ""
echo "To create hotfix branches:"
echo "  git checkout main"
echo "  git checkout -b hotfix/critical-fix"
echo ""
echo "See .github/BRANCH_STRATEGY.md for complete documentation"
