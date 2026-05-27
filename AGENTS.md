# Portfolio Profesional 2026 — Agent Guide

This guide documents the complete project structure, setup requirements, development workflows, and deployment configuration for the Portfolio (Horacio's professional portfolio). It covers the full-stack architecture (Astro frontend + Django backend), local development setup, CI/CD pipeline, and troubleshooting.

**Intended audience**: New developers, agents/AI tools, and contributors.

## Stack
- **Frontend**: Astro 5 + React 18 + TypeScript 5 + Tailwind CSS 3 (static SSG)
- **Backend**: Django 5.2 + DRF 3.17 (Python 3.11+)
- **Database**: Supabase PostgreSQL (prod), SQLite (dev default)
- **Deploy**: 
  - Frontend: Vercel static site (auto-deployed from `frontend/dist`; build command: `pnpm build`)
  - Backend: Vercel serverless functions via `/api/index.py` (WSGI adapter); routes configured in `vercel.json` with pattern `{"src": "/api/(.*)", "dest": "/api/index.py"}`; buildCommand: `pnpm --filter frontend build && pnpm --filter backend build` (backend build is no-op; Django runs on request)
- **Package manager**: pnpm >= 9 (workspace with `frontend`/`backend` packages)

## Commands

| Command | What |
|---|---|
| `pnpm dev` | Frontend only (Astro dev server) |
| `pnpm dev:all` | Frontend + backend concurrently (runs both dev servers; see package.json for script details) |
| `pnpm backend:dev` | Django `manage.py runserver 0.0.0.0:8000` (requires `backend/venv/` directory; see Setup section) |
| `pnpm build` | Frontend build (codegen → astro check → astro build) + backend no-op |
| `pnpm preview` | Preview production build |
| `pnpm lint` | `eslint` (frontend) + `ruff check` (backend) |
| `pnpm format` | `prettier` for JS/TS/JSON/MD + `ruff check --fix` for Python backend (consistent with `pnpm --filter backend format`) |
| `pnpm type-check` | `astro check` |
| `pnpm --filter backend migrate` | Django migrations |
| `pnpm --filter backend makemigrations` | New Django migrations |
| `pnpm --filter backend seed` | Django `seed_data` command |
| `pnpm --filter backend lint` | `ruff check .` |
| `pnpm --filter backend format` | `ruff check --fix .` (not black) |

**CI pipeline**: `pnpm build` (includes codegen + type-check); optionally add `pnpm lint` and `pnpm --filter backend lint` for stricter checks.

**Local dev**: Use `pnpm dev` (frontend only) or `pnpm dev:all` (both). Run `pnpm type-check` before committing.

## Architecture

### Frontend — Clean Architecture layers

| Path alias | Directory | Purpose |
|---|---|---|
| `@domain/*` | `src/domain/` | Entities, repository interfaces, use-cases (empty — only .gitkeep) |
| `@infrastructure/*` | `src/infrastructure/` | API clients, DTOs, mappers, repos (only `localStorage-theme.repository.ts`) |
| `@presentation/*` | `src/presentation/` | React components, hooks, layouts, Astro-tailored pages |
| `@shared/*` | `src/shared/` | DI container (empty — DI is manual), utilities |
| `@data/*` | `src/data/` | Generated manifests, `profile-data.ts` (hand-written CV data) |

- Astro pages in `src/pages/`, layouts in `src/presentation/layouts/`
- React components in `src/presentation/components/{atoms,layout,proyectos,sections,ui}/`
- **Dual-theme**: CSS variables via `data-theme="light|dark"` on `<html>`. Three modes: `light`, `dark`, `system`. Theme applied via `useTheme` hook + repository pattern (`localStorage-theme.repository.ts`).
- **Design system**: Apple-inspired. All components use `--color-*` CSS variables from `tokens.css` + theme files. Glassmorphism via `.glass` class. Consistent radii (`rounded-xl`=1rem, `rounded-2xl`=1.5rem). Colors: `#0071e3` (light) / `#2997ff` (dark) accent. Animations merged into `global.css` — `animations.css` deleted. Duplicate `.tsx`/`.astro` components consolidated (NotebooksGrid/NotebookProjectCard kept only `.astro`).
- **Data loaders**: `src/lib/data/` exports typed getter functions (`getProjects`, `getNotebooks`, `getProfile`, `getExperience`) reading from generated JSON manifests in `src/data/generated/`.
- **Schemas**: `src/lib/schemas/` defines Zod schemas for project, notebook, profile, and experience.

### Backend

- Django app: `portfolio/` (models, views, serializers, services)
- Settings module: `portfolio_backend.settings` via `DJANGO_SETTINGS_MODULE`
- Auto-detects database: `POSTGRES_URL` env var → PostgreSQL, else SQLite
- Services: `contact_service.py`, `notebook_service.py` in `portfolio/services/`
- **API endpoints** (read-only ViewSets + health + contact):
  `GET /api/health`, `GET /api/v1/projects[?category=][&featured=][&status=]`, `GET /api/v1/projects/{slug}`, `GET /api/v1/projects/featured`, `GET /api/v1/technologies`, `GET /api/v1/experience`, `GET /api/v1/education`, `GET /api/v1/certifications`, `GET /api/v1/notebooks`, `GET /api/v1/notebooks/{slug}`, `POST /api/v1/contact`
- Backend `package.json` wraps Django commands; the `dev` script auto-detects `venv/` directory.
- Backend scripts (`backend/scripts/`): `db_manager.py`, `generate_projects_md.py`, `ingest_projects_from_content.py`, `sync_projects_to_supabase.py`

## Codegen pipeline (runs during `pnpm build` only)

**Execution sequence**: `pnpm build` runs three scripts in `frontend/scripts/` (all Node.js ESM `.mjs`), in this exact order:

1. **`sync-all-projects.mjs`** — Reads GitHub repos JSON + `public/Proyectos/` → generates Astro content markdown in `src/content/proyectos/`
2. **`generate-site-data.mjs`** — Reads content markdown + `profile-data.ts` → generates static JSON manifests in `src/data/generated/` and `public/data/`
3. **`generate-projects-from-public.mjs`** — Initial project import + cleanup (legacy); **do NOT run during `pnpm build`**; manual-only at setup

**Execution rules**:
- During `pnpm build`: Only scripts 1 and 2 execute (in order). Script 3 is SKIPPED.
- Manual import (one-time, at repo setup): `node frontend/scripts/generate-projects-from-public.mjs` (never during automated builds)
- Failure modes: If script 1 or 2 fails, `pnpm build` stops. Scripts do not auto-retry. Fix errors and re-run `pnpm build`.
- No retry logic: Failed builds do not resume; always run full `pnpm build` again.

## Style conventions

- **Prettier**: `semi: true`, `singleQuote: true`, `trailingComma: es5`, `printWidth: 100`, `arrowParens: always`
- **Ruff**: targets py311, selects E/F/I/N/W/UP, `line-length = 100`
- **Black**: `line-length = 100`, target `py311`
- **ESLint**: extends `@typescript-eslint`, `eslint-plugin-astro`
- **TypeScript**: `astro/tsconfigs/strict` with `noUnusedLocals: true`, `noUnusedParameters: true`, `strictNullChecks: true`

## Dev server notes & error handling

- **Vite proxy `/api` routes**: Forwards `/api` → `http://localhost:8000` (backend MUST be running; if backend is down, API requests fail immediately with no fallback or mock)
  - **Fix if proxy fails**: Ensure `pnpm backend:dev` is running before `pnpm dev`. If backend is not reachable, you will see connection refused errors in browser console.
  - **No mock fallback exists**: Currently there is no mock API server. To implement one, create `frontend/scripts/mock-api.js` and set `FALLBACK_API_URL` env var (not yet implemented).
- SSR noExternal includes `@tabler/icons-react` and `framer-motion`
- Public dir is `../public` (shared across frontend + backend)
- Astro content collection: `src/content/config.ts` defines a `proyectos` collection with Zod validation
- `public/_headers` and `public/_redirects` control deploy-time security + caching behavior

## Setup & Environment

### Required environment variables

Create `.env.example` in project root (reference) and `.env` for your environment:
```
POSTGRES_URL=postgres://user:pass@localhost:5432/portfolio_db
DJANGO_SECRET_KEY=your-secret-key-here (generate with: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")
DJANGO_SETTINGS_MODULE=portfolio_backend.settings
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
VERCEL_ENV=development (or production for prod builds)
```

### Backend setup

1. **Create virtual environment**: `python3 -m venv backend/venv`
   - On Windows: `py -3 -m venv backend\venv`
2. **Activate environment**:
   - Unix/macOS: `source backend/venv/bin/activate`
   - Windows: `backend\venv\Scripts\Activate.ps1`
3. **Install dependencies**: `pip install -r backend/requirements.txt`
4. **Run migrations**: `pnpm --filter backend migrate`
5. **Start backend server**: `pnpm backend:dev`

**Error handling**: If `backend/venv/` directory does not exist, `pnpm backend:dev` will fail with an error. You MUST create the venv and install dependencies first (steps 1–3). The dev script will not auto-create venv; it explicitly requires it to exist.

## Tests & CI

### Local testing

- **Backend API tests**: `python backend/test_api.py --base-url http://localhost:8000` (requires backend running at port 8000)
- **Backend linting**: `pnpm --filter backend lint` (runs `ruff check .`)
- **Frontend type-check**: `pnpm type-check` (runs `astro check`)
- **Frontend linting**: `pnpm lint` (runs `eslint`)

### CI pipeline (authoritative order)

Run these commands in order:
```bash
pnpm lint                                    # ESLint (frontend) + Ruff (backend)
pnpm type-check                              # Astro type-check
pnpm build                                   # Frontend build (includes codegen + astro build); backend no-op
# Optional: python backend/test_api.py --base-url http://localhost:8000 (if external test backend available)
```

**Build output expectations**:
- Frontend: `frontend/dist/` (static HTML/CSS/JS for Vercel static deployment)
- Backend: No build output (Django managed via `manage.py` commands on server)
- Codegen outputs: `src/data/generated/*.json` and `public/data/*.json`

## Notable gotchas

- **`doc/AGENTS.md` and `doc/knowledge.md`** — stale duplicates. This file is the source of truth.
- **Backend README is stale** — references FastAPI/uvicorn; actual code is Django DRF.
- **Root `pnpm-workspace.yaml`** has `esbuild: false, sharp: false` — frontend's `pnpm-workspace.yaml` overrides these to `true`.
- **`backend/linux_porfolio/`** is a venv directory — should be gitignored.
- **No frontend tests**; backend has stub `tests.py` + manual `test_api.py`; consider adding pytest.
- **Supabase migrations** in `supabase/migrations/` (SQL); Django manages schema separately via `manage.py migrate`.
- **`frontend/dist/` and `public/Proyectos/`** are generated artifacts — never edit directly.
- **Backend must run** for frontend dev server to work; start `pnpm backend:dev` before `pnpm dev` or `pnpm dev:all`.
