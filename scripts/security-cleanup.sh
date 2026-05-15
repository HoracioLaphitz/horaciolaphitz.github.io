#!/bin/bash

# Security Cleanup Script
# Este script ayuda a verificar y limpiar información sensible del historial de git

echo "🔒 Security Cleanup Script"
echo "=========================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar si .env está en el historial de git
echo "📋 Verificando archivos sensibles en el historial de git..."
echo ""

ENV_IN_HISTORY=$(git log --all --full-history -- .env .env.production 2>/dev/null | wc -l)

if [ "$ENV_IN_HISTORY" -gt 0 ]; then
    echo -e "${RED}⚠️  ADVERTENCIA: Archivos .env encontrados en el historial de git${NC}"
    echo ""
    echo "Archivos encontrados:"
    git log --all --full-history --oneline -- .env .env.production
    echo ""
    echo -e "${YELLOW}Recomendación: Considera limpiar el historial de git${NC}"
    echo ""
    echo "Opciones:"
    echo "1. Usar BFG Repo-Cleaner: https://rtyley.github.io/bfg-repo-cleaner/"
    echo "2. Usar git filter-branch (más complejo)"
    echo "3. Crear un nuevo repositorio limpio"
    echo ""
    echo "⚠️  IMPORTANTE: Después de limpiar el historial, DEBES rotar todas las API keys expuestas"
    echo ""
else
    echo -e "${GREEN}✅ No se encontraron archivos .env en el historial de git${NC}"
    echo ""
fi

# 2. Verificar que .env está en .gitignore
echo "📋 Verificando .gitignore..."
echo ""

if grep -q "^\.env$" .gitignore && grep -q "^\.env\.production$" .gitignore; then
    echo -e "${GREEN}✅ .env y .env.production están en .gitignore${NC}"
else
    echo -e "${YELLOW}⚠️  Advertencia: Verifica que .env esté correctamente en .gitignore${NC}"
fi
echo ""

# 3. Verificar que .env no está trackeado actualmente
echo "📋 Verificando archivos trackeados..."
echo ""

TRACKED_ENV=$(git ls-files | grep -E "^\.env" | wc -l)

if [ "$TRACKED_ENV" -gt 0 ]; then
    echo -e "${RED}⚠️  ADVERTENCIA: Archivos .env están siendo trackeados por git${NC}"
    echo ""
    echo "Archivos trackeados:"
    git ls-files | grep -E "^\.env"
    echo ""
    echo "Para dejar de trackear estos archivos:"
    echo "  git rm --cached .env .env.production"
    echo "  git commit -m 'security: remove .env files from tracking'"
    echo ""
else
    echo -e "${GREEN}✅ No hay archivos .env siendo trackeados${NC}"
fi
echo ""

# 4. Verificar que existe .env.example
echo "📋 Verificando .env.example..."
echo ""

if [ -f ".env.example" ]; then
    echo -e "${GREEN}✅ .env.example existe${NC}"
else
    echo -e "${YELLOW}⚠️  .env.example no existe. Considera crearlo como plantilla${NC}"
fi
echo ""

# 5. Auditar dependencias
echo "📋 Auditando dependencias de seguridad..."
echo ""

if command -v pnpm &> /dev/null; then
    pnpm audit --audit-level=moderate
else
    echo -e "${YELLOW}⚠️  pnpm no está instalado. Instálalo para auditar dependencias${NC}"
fi
echo ""

# 6. Resumen
echo "=========================="
echo "🎯 Resumen de Seguridad"
echo "=========================="
echo ""

if [ "$ENV_IN_HISTORY" -eq 0 ] && [ "$TRACKED_ENV" -eq 0 ]; then
    echo -e "${GREEN}✅ Estado de seguridad: BUENO${NC}"
    echo ""
    echo "Recomendaciones:"
    echo "- Mantén tus dependencias actualizadas"
    echo "- Rota tus API keys periódicamente"
    echo "- Ejecuta este script regularmente"
else
    echo -e "${RED}⚠️  Estado de seguridad: REQUIERE ATENCIÓN${NC}"
    echo ""
    echo "Acciones requeridas:"
    if [ "$ENV_IN_HISTORY" -gt 0 ]; then
        echo "- Limpiar archivos .env del historial de git"
        echo "- Rotar todas las API keys expuestas"
    fi
    if [ "$TRACKED_ENV" -gt 0 ]; then
        echo "- Dejar de trackear archivos .env"
    fi
fi
echo ""

echo "Para más información, consulta SECURITY.md"
