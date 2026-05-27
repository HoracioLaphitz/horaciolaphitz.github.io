# Backend — Portfolio API

API REST construida con **Django 5.2 + Django REST Framework 3.17**.

## Stack

- **Framework**: Django 5.2 + DRF 3.17
- **DB dev**: SQLite (default) — sin configuración extra
- **DB prod**: Supabase PostgreSQL via `POSTGRES_URL`
- **Deploy**: Vercel Python Functions (serverless)

## Inicio rápido

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

## Variables de entorno

Ver `backend/.env.example`. Variables principales:

| Variable | Obligatoria | Defecto |
|---|---|---|
| `API_SECRET_KEY` | Sí (prod) | — |
| `DJANGO_DEBUG` | No | `False` |
| `POSTGRES_URL` | No (usa SQLite) | — |
| `ALLOWED_HOSTS` | No | `.vercel.app` |
| `ALLOWED_ORIGINS` | No | localhost:4321 |

## Comandos

```bash
pnpm --filter backend migrate        # Correr migraciones
pnpm --filter backend makemigrations  # Crear migraciones
pnpm --filter backend seed            # Sembrar datos
pnpm --filter backend lint            # ruff check
pnpm --filter backend format          # ruff --fix
```

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/v1/projects` | Proyectos (filtros: category, featured, status) |
| GET | `/api/v1/projects/featured` | Proyectos destacados |
| GET | `/api/v1/projects/{slug}` | Proyecto por slug |
| GET | `/api/v1/technologies` | Tecnologías |
| GET | `/api/v1/experience` | Experiencia laboral |
| GET | `/api/v1/education` | Educación |
| GET | `/api/v1/certifications` | Certificaciones |
| GET | `/api/v1/notebooks` | Notebooks |
| GET | `/api/v1/notebooks/{slug}` | Notebook por slug |
| POST | `/api/v1/contact` | Formulario de contacto |
| GET | `/api/v1/profile` | Perfil público |

## Migraciones DB

En producción (Supabase PostgreSQL):

```bash
POSTGRES_URL="postgres://..." pnpm --filter backend migrate
```

En Vercel, las migraciones se corren localmente una vez (el build no tiene acceso a la DB).

## Estructura

```
backend/
├── api/                    # Entry point Vercel Functions
│   └── index.py            # WSGI wrapper
├── portfolio/              # App Django
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── admin.py
│   └── services/
├── portfolio_backend/      # Config Django
│   └── settings.py
├── scripts/                # Utilidades
└── requirements.txt
```
