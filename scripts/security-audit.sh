#!/bin/bash

# Security Audit Script
# Verifica configuraciones de seguridad del portfolio

echo "🔒 Portfolio Security Audit"
echo "=========================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# 1. Check if .env is in .gitignore
echo "1. Checking .gitignore configuration..."
if grep -q "^\.env$" .gitignore; then
    echo -e "${GREEN}✓${NC} .env is in .gitignore"
else
    echo -e "${RED}✗${NC} .env is NOT in .gitignore - CRITICAL!"
    ERRORS=$((ERRORS + 1))
fi

# 2. Check if .env exists and is not tracked
echo ""
echo "2. Checking .env file status..."
if [ -f .env ]; then
    if git ls-files --error-unmatch .env 2>/dev/null; then
        echo -e "${RED}✗${NC} .env is tracked in Git - CRITICAL!"
        echo "   Run: git rm --cached .env"
        ERRORS=$((ERRORS + 1))
    else
        echo -e "${GREEN}✓${NC} .env exists and is not tracked"
    fi
else
    echo -e "${YELLOW}⚠${NC} .env file not found (using .env.example?)"
    WARNINGS=$((WARNINGS + 1))
fi

# 3. Check for exposed secrets in code
echo ""
echo "3. Scanning for exposed secrets..."
SECRETS_FOUND=0

# Check for hardcoded emails
if grep -r "horaciolaphitz99@gmail.com" src/ --exclude-dir=node_modules 2>/dev/null | grep -v "// SAFE:" | grep -v ".map"; then
    echo -e "${YELLOW}⚠${NC} Email found in source code"
    WARNINGS=$((WARNINGS + 1))
    SECRETS_FOUND=1
fi

# Check for API keys
if grep -rE "[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}" src/ --exclude-dir=node_modules 2>/dev/null; then
    echo -e "${RED}✗${NC} Potential API key found in source code - CRITICAL!"
    ERRORS=$((ERRORS + 1))
    SECRETS_FOUND=1
fi

if [ $SECRETS_FOUND -eq 0 ]; then
    echo -e "${GREEN}✓${NC} No obvious secrets found in source code"
fi

# 4. Check security headers file
echo ""
echo "4. Checking security headers..."
if [ -f public/_headers ]; then
    echo -e "${GREEN}✓${NC} _headers file exists"
    
    # Check for important headers
    if grep -q "X-Frame-Options" public/_headers; then
        echo -e "${GREEN}  ✓${NC} X-Frame-Options configured"
    else
        echo -e "${RED}  ✗${NC} X-Frame-Options missing"
        ERRORS=$((ERRORS + 1))
    fi
    
    if grep -q "Content-Security-Policy" public/_headers; then
        echo -e "${GREEN}  ✓${NC} Content-Security-Policy configured"
    else
        echo -e "${RED}  ✗${NC} Content-Security-Policy missing"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}✗${NC} _headers file not found"
    ERRORS=$((ERRORS + 1))
fi

# 5. Check security.txt
echo ""
echo "5. Checking security.txt..."
if [ -f public/.well-known/security.txt ]; then
    echo -e "${GREEN}✓${NC} security.txt exists"
else
    echo -e "${YELLOW}⚠${NC} security.txt not found"
    WARNINGS=$((WARNINGS + 1))
fi

# 6. Check for DOMPurify installation
echo ""
echo "6. Checking security dependencies..."
if grep -q "isomorphic-dompurify" package.json; then
    echo -e "${GREEN}✓${NC} DOMPurify installed"
else
    echo -e "${YELLOW}⚠${NC} DOMPurify not installed"
    WARNINGS=$((WARNINGS + 1))
fi

# 7. Check for vulnerable dependencies
echo ""
echo "7. Checking for vulnerable dependencies..."
if command -v pnpm &> /dev/null; then
    pnpm audit --audit-level=high --json > /tmp/audit.json 2>/dev/null
    VULNS=$(cat /tmp/audit.json | grep -o '"high":[0-9]*' | cut -d':' -f2)
    if [ -z "$VULNS" ] || [ "$VULNS" -eq 0 ]; then
        echo -e "${GREEN}✓${NC} No high-severity vulnerabilities found"
    else
        echo -e "${RED}✗${NC} Found $VULNS high-severity vulnerabilities"
        echo "   Run: pnpm audit fix"
        ERRORS=$((ERRORS + 1))
    fi
    rm -f /tmp/audit.json
else
    echo -e "${YELLOW}⚠${NC} pnpm not found, skipping audit"
    WARNINGS=$((WARNINGS + 1))
fi

# 8. Check robots.txt
echo ""
echo "8. Checking robots.txt..."
if [ -f public/robots.txt ]; then
    echo -e "${GREEN}✓${NC} robots.txt exists"
else
    echo -e "${YELLOW}⚠${NC} robots.txt not found"
    WARNINGS=$((WARNINGS + 1))
fi

# Summary
echo ""
echo "=========================="
echo "Audit Summary"
echo "=========================="
echo -e "Errors:   ${RED}$ERRORS${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All security checks passed!${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ Audit completed with warnings${NC}"
    exit 0
else
    echo -e "${RED}✗ Audit failed with critical errors${NC}"
    echo "Please fix the errors above before deploying."
    exit 1
fi
