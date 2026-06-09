# Portfolio Profesional 2026 — Knowledge Base

## Project Overview
Portfolio personal de **Horacio Laphitz** (Analista de Datos). Full-stack con frontend Astro + React, backend Django REST Framework, y base de datos PostgreSQL (Supabase). Desplegado en Vercel.

---

## Commands

### Root (pnpm workspace)
| Command | Description |
|---------|------------|
| `pnpm dev` | Start frontend (Astro) |
| `pnpm dev:all` | Start frontend + backend |
| `pnpm build` | Build frontend |
| `pnpm backend:dev` | Start backend (Django) |
| `pnpm preview` | Preview built frontend |
| `pnpm type-check` | Astro type check |
| `pnpm lint` | Lint frontend |
| `pnpm format` | Prettier + Black formatting |

### Backend (cd backend)
| Command | Description |
|---------|------------|
| `python manage.py runserver 0.0.0.0:8000` | Start dev server |
| `python manage.py makemigrations` | Create migrations |
| `python manage.py migrate` | Apply migrations |
| `python manage.py seed_data` | Seed DB with initial data |

### Frontend (cd frontend)
| Command | Description |
|---------|------------|
| `pnpm dev` | Astro dev server (port 4321) |
| `pnpm build` | Generate static site |
| `pnpm generate:projects` | Sync markdown projects from GitHub |
| `pnpm generate:data` | Generate static JSON manifests |
| `pnpm generate` | Both of the above |
| `pnpm type-check` | `astro check` |

---

## Project Structure (Key Paths)

### Frontend
- `frontend/src/pages/` — Astro pages (index, projects, notebooks, experience, contact)
- `frontend/src/presentation/components/` — React components
  - `sections/` — Hero, About, Contact, Timeline, ProjectsGrid, ProjectFilters, etc.
  - `layout/` — Header, Footer
  - `atoms/` — ThemeToggle
  - `ui/` — AnimatedSection, Button, Card, ScrollProgress
- `frontend/src/domain/entities/` — Domain models (Project, Experience, Technology, Profile, Theme)
- `frontend/src/domain/repositories/` — Repository interfaces
- `frontend/src/infrastructure/` — Concrete implementations (e.g. localStorage theme repo)
- `frontend/src/data/profile-data.ts` — CV data (experience, certifications, education, skills)
- `frontend/src/content/proyectos/` — 20+ project markdown files with frontmatter
- `frontend/src/presentation/styles/` — CSS (global.css, animations.css, tokens.css, themes/*)
- `frontend/src/presentation/hooks/` — useTheme, useIntersectionObserver

### Backend
- `backend/portfolio/models.py` — Django models: Project, Technology, Experience, Education, Certification
- `backend/portfolio/views.py` — REST ViewSets + API endpoints
- `backend/portfolio/urls.py` — URL routing (`/api/v1/projects`, `/api/v1/technologies`, etc.)
- `backend/portfolio/serializers.py` — DRF serializers
- `backend/portfolio/services/` — Business logic (contact_service, notebook_service)
- `backend/portfolio_backend/settings.py` — Django settings (DB, CORS, cache, REST framework)

### Infrastructure
- `public/Proyectos/Notebooks/` — 20+ Jupyter notebooks (ML, data analysis, etc.)
- `public/notebooks-html/` — Rendered HTML versions of notebooks
- `supabase/migrations/` — SQL migrations (001-004)
- `scripts/setup.sh` — Setup script

### Config Files
- `vercel.json` — Vercel deploy config (static frontend + Python edge functions)
- `frontend/astro.config.mjs` — Astro config (React, Tailwind, path aliases, proxy)
- `frontend/tailwind.config.mjs` — Theme-aware Tailwind config with CSS variables
- `frontend/tsconfig.json` — TS strict mode with path aliases (@domain, @infrastructure, etc.)

---

## Conventions & Constraints

### Architecture
- **Clean Architecture**: Domain → Infrastructure → Presentation layers
- **Astro pages** use `.astro` files; interactive components are **React** (`.tsx`)
- **Static site generation** (`output: 'static'`), no SSR

### Code Style
- TypeScript: **strict mode** (`strict: true`, `noUnusedLocals`, `noUnusedParameters`, etc.)
- React: functional components with TypeScript interfaces for props
- Path aliases: `@domain/*`, `@infrastructure/*`, `@presentation/*`, `@shared/*`, `@data/*`
- CSS: Tailwind utility classes + CSS variables in `styles/` (dual theme: light/dark)

### Theme System
- Dark mode via `data-theme` attribute on `<html>`
- `useTheme` hook persists preference in localStorage
- Tailwind colors use CSS variables (`var(--color-*)`) for theme switching

### Backend Conventions
- Django REST Framework with `ReadOnlyModelViewSet` for public data
- Cache: 5-min `@cache_page(300)` on list/retrieve endpoints (in-memory LocMemCache)
- SQLite for local dev, PostgreSQL (Supabase) for production
- CORS: `ALLOWED_ORIGINS` env var, credentials allowed

### API Endpoints
```
GET  /api/health
GET  /api/v1/projects[?category=][&featured=][&status=]
GET  /api/v1/projects/{slug}
GET  /api/v1/projects/featured
GET  /api/v1/technologies
GET  /api/v1/experience
GET  /api/v1/education
GET  /api/v1/certifications
GET  /api/v1/notebooks
GET  /api/v1/notebooks/{slug}
POST /api/v1/contact
```

### Data Layer (Static Manifests)
- **Script:** `frontend/scripts/generate-site-data.mjs` — generates JSON manifests from:
  - `src/content/proyectos/*.md` → `projects.json`
  - `public/Proyectos/` + `public/notebooks-html/` → `notebooks.json`
  - `src/data/profile-data.ts` → `profile.json` + `experience.json`
- Output: `src/data/generated/` (build-time imports) + `public/data/` (runtime access)
- **Loaders:** `src/lib/data/` — typed getter functions (getProjects, getNotebooks, getProfile, getExperience)
- **API client:** `src/lib/data/api/contact.ts` — typed POST wrapper for contact form

### Project Content
- Markdown files in `frontend/src/content/proyectos/` with frontmatter schema defined in `config.ts`
- Frontmatter fields: title, description, category, featured, status, createdAt, githubUrl, demoUrl, technologies

### Git
- There are uncommitted changes (migrations consolidated, deleted old layers, config updates)
- `.env` files should not be committed

### Known Gotchas
- `@tabler/icons-react` and `framer-motion` are set as `ssr.noExternal` in Vite config (needed for ESM compatibility)
- `proxy` in Astro config forwards `/api` to `localhost:8000` (Django backend)
- The backend README mentions FastAPI but the actual codebase uses **Django REST Framework** (the README is outdated)
- No test suite is currently configured for the frontend
- `pnpm dev:all` runs both frontend and backend with a single command
