# Portfolio Profesional 2026

Portfolio Full Stack con arquitectura híbrida Astro + Django REST Framework, diseño dual-theme y backend serverless.

## Stack Tecnológico

- **Frontend**: Astro 5.x + React 18 + TypeScript + Tailwind CSS
- **Backend**: Django 5.2 + Django REST Framework (Python 3.11+)
- **Database**: Supabase PostgreSQL + Row Level Security
- **Storage**: Supabase Storage + CDN
- **Deploy**: Vercel (Edge Functions + Static)

## Estructura del Proyecto

```
portfolio-profesional-2026/
├── frontend/          # Astro + React application
├── backend/           # Django REST Framework application
├── shared/            # Shared types and utilities
└── scripts/           # Automation scripts
```

## Requisitos

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- Python >= 3.11

## Instalación

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local

# Iniciar desarrollo
pnpm dev
```

## Comandos Disponibles

```bash
pnpm dev              # Iniciar frontend en desarrollo
pnpm backend:dev      # Iniciar backend en desarrollo
pnpm build            # Build completo (frontend + backend)
pnpm preview          # Preview del build
pnpm lint             # Linting
pnpm format           # Formateo de código
pnpm type-check       # Verificación de tipos
```

## Arquitectura

El proyecto sigue Clean Architecture con separación clara de capas:

- **Domain**: Entidades y lógica de negocio pura
- **Application**: Casos de uso y servicios
- **Infrastructure**: Implementaciones concretas (DB, APIs)
- **Presentation**: UI y componentes visuales

## Despliegue

El proyecto está configurado para despliegue automático en Vercel:

- Frontend: Static Site Generation + ISR
- Backend: Edge Functions (Python runtime)
- Database: Supabase (managed PostgreSQL)

## Licencia

Privado - Todos los derechos reservados
