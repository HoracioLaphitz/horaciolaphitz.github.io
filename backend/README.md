# Backend API - Portfolio

API backend construida con FastAPI y Supabase.

## Inicio Rápido

### Requisitos
- Python 3.11+
- pip o uv

### Instalación

```bash
# Crear entorno virtual
python -m venv .venv

# Activar entorno virtual (Windows)
.\.venv\Scripts\activate

# Activar entorno virtual (Linux/Mac)
source .venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

### Configuración

Crear archivo `.env` en el directorio `backend/`:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_KEY=tu-service-role-key
SUPABASE_ANON_KEY=tu-anon-key
API_SECRET_KEY=tu-secret-key-segura
```

### Ejecutar

```bash
# Opción 1: Script PowerShell (Windows)
.\start.ps1

# Opción 2: Comando directo
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

La API estará disponible en:
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

## Estructura

```
backend/
├── api/
│   ├── core/
│   │   ├── config.py      # Configuración
│   │   ├── logging.py     # Sistema de logs
│   │   └── exceptions.py  # Excepciones custom
│   ├── routes/            # Endpoints
│   ├── schemas/           # Pydantic schemas
│   ├── services/          # Lógica de negocio
│   └── main.py            # App principal
├── scripts/
│   └── ingest_projects_from_content.py  # Ingesta de proyectos
├── .env                   # Variables de entorno
├── requirements.txt       # Dependencias
└── start.ps1             # Script de inicio
```

## Base de Datos

### Aplicar Migraciones

```bash
# Usando Supabase CLI
supabase db push

# O manualmente en Supabase Dashboard > SQL Editor
# Ejecuta los archivos en orden:
# 1. supabase/migrations/001_initial_schema.sql
# 2. supabase/migrations/002_seed_data.sql
# 3. supabase/migrations/003_add_project_resources.sql
```

### Ingestar Proyectos

Después de generar proyectos en el frontend, ingéstalos en Supabase:

```bash
cd backend
python scripts/ingest_projects_from_content.py
```

Este script:
1. Lee archivos markdown de `frontend/src/content/proyectos/`
2. Parsea frontmatter y contenido
3. Crea/actualiza proyectos en Supabase
4. Crea/vincula tecnologías automáticamente

**Requisitos:**
- Variables `SUPABASE_URL` y `SUPABASE_SERVICE_KEY` configuradas
- Migración `003_add_project_resources.sql` aplicada
- Proyectos generados en el frontend

## Desarrollo

### Agregar dependencias

```bash
pip install nombre-paquete
pip freeze > requirements.txt
```

### Tests

```bash
pytest
```

## Endpoints

### Health Check
```
GET /api/health
```

Respuesta:
```json
{
  "status": "healthy",
  "version": "1.0.0"
}
```

### Projects
```
GET /api/projects              # Listar todos los proyectos
GET /api/projects/{slug}       # Obtener proyecto por slug
GET /api/projects/featured     # Proyectos destacados
```

### Technologies
```
GET /api/technologies          # Listar todas las tecnologías
```

## Schemas

### Project Schema

```python
{
  "id": "uuid",
  "slug": "string",
  "title": "string",
  "description": "string",
  "long_description": "string | null",
  "category": "string",
  "status": "completed | in-progress | planned",
  "featured": "boolean",
  "highlights": ["string"],
  "technologies": ["string"],
  "github_url": "string | null",
  "demo_url": "string | null",
  "pdf_url": "string | null",
  "pdf_size": "string | null",
  "thumbnail_url": "string | null",
  "assets": [{"type": "image|video|link", "url": "string"}],
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

## Seguridad

- **NUNCA** commitear el archivo `.env`
- Usar `SUPABASE_SERVICE_KEY` solo en backend
- Usar `SUPABASE_ANON_KEY` en frontend
- Rotar `API_SECRET_KEY` en producción
- Row Level Security (RLS) habilitado en todas las tablas

## Referencias

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Supabase Python Client](https://supabase.com/docs/reference/python/introduction)
- [Pydantic](https://docs.pydantic.dev/)

