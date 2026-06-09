# AI Agent Guidance for Portafolio
 
This file is for AI coding agents to understand the repo quickly and avoid editing generated outputs or stale documentation.
 
## Project scope
- Root is a pnpm workspace with two packages: `frontend` and `backend`.
- `frontend/` is Astro 5 + React 18 + TypeScript + Tailwind CSS static site.
- `backend/` is Django 5.2 + DRF API with SQLite (PostgreSQL optional).
- `frontend/dist/` and `public/Proyectos/` are generated build artifacts — never edit directly.
 
## Recommended root commands
Run from repo root unless otherwise noted:
- `pnpm install` — install all dependencies
- `pnpm dev` — start frontend dev server with API proxy to localhost:8000
- `pnpm backend:dev` — start Django dev server on port 8000
- `pnpm build` — sync projects → generate site data → build frontend
- `pnpm preview` — preview production build
- `pnpm lint` — run eslint on frontend and ruff on backend
- `pnpm format` — prettier for JS/TS/metadata with black for Python
- `pnpm type-check` — Astro type checking for frontend
 
## Frontend commands
- `pnpm --filter frontend dev` — Astro dev server, configured to proxy `/api` to backend
- `pnpm --filter frontend build` — runs sync + generate -> astro check -> astro build
- `pnpm --filter frontend lint` — eslint checks frontend files
- `pnpm --filter frontend type-check` — TypeScript + Astro type validation
- `pnpm --filter frontend generate` — sync projects and generate site data via scripts/
 
## Backend commands
Backend scripts in `backend/package.json` are the source of truth:
- `backend/dev` — runs `manage.py runserver` (venv priority or system python)
- `backend/migrate` — Django migrations: `python manage.py migrate`
- `backend/makemigrations` — create migrations: `python manage.py makemigrations`
- `backend/seed` — populate DB: `python manage.py seed_data`
- `backend/build` — no-op actual build (static output only)
- `backend/lint` — ruff check
- `backend/format` — ruff check --fix
 
## Environment setup
Frontend: no backend connection required in development; Astro dev proxies `/api` to `http://localhost:8000`.
Backend: loads `.env` from `backend/` directory; defaults to SQLite (`db.sqlite3`). For PostgreSQL, set `POSTGRES_URL` or individual DB vars.
Required backend env vars: `API_SECRET_KEY`, `ALLOWED_HOSTS`, `ALLOWED_ORIGINS`.
 
## Architecture details
- Frontend aliases: `@domain`, `@infrastructure`, `@presentation`, `@shared`, `@data` resolve to respective `frontend/src/` subdirectories (see `astro.config.mjs:34-41`).
- Backend API routes registered in `backend/portfolio/urls.py` under v1 namespace (projects, technologies, experience, education, certifications, notebooks, contact).
- Backend seed data includes 26 sample projects, 22 technologies, 3 experiences, 2 educations, 3 certifications in `backend/portfolio/management/commands/seed_data.py`.
- Backend depends on: django==5.2.14, djangorestframework==3.17.1, django-cors-headers==4.9.0, psycopg2-binary==2.9.12, python-dotenv==1.0.1, gunicorn==23.0.0.
 
## Scripts and automation
Frontend scripts (`frontend/scripts/`):
- `sync-all-projects.mjs` — imports projects from `public/Proyectos/` into the frontend
- `generate-site-data.mjs` — builds final site data for Astro consumption
- `generate-projects-from-public.mjs` — initial project import + cleanup
Backend scripts (`backend/scripts/`):
- `db_manager.py` — DB operations
- `generate_projects_md.py` — project markdown generation
- `ingest_projects_from_content.py` — read markdown from content, seed DB
- `sync_projects_to_supabase.py` — sync to Supabase (exists but backend uses SQLite by default)
 
## What to avoid
- Editing `frontend/dist/` or `public/Proyectos/` (they are generated).
- Following `backend/README.md` — it documents FastAPI, the actual backend is Django.
- Modifying root `package.json` engine versions (`node` >=20, `pnpm` >=9) without verifying frontend/backend compatibility.
 
## Root repo configuration
- `pnpm-workspace.yaml` disables `esbuild` and `sharp` builds (`allowBuilds`).
- `vercel.json` contains frontend deployment config plus fallback API rewrites; doesn't have actual backend handlers (backend runs as Python Edge Functions).
- No CI workflows configured; none found in `.github/` or `.cursor/`.
