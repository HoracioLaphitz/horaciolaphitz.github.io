# Supabase — Configuración Completa

> Guía para configurar la base de datos y el almacenamiento en Supabase para el Portfolio.
> Proyecto: **swmsdgvftvfglcgwezxz** (Supabase Dashboard)

---

## Índice

- [1. Variables de Entorno](#1-variables-de-entorno)
- [2. Base de Datos (PostgreSQL)](#2-base-de-datos-postgresql)
- [3. Storage (Almacenamiento de Archivos)](#3-storage-almacenamiento-de-archivos)
- [4. Conexión desde Django](#4-conexión-desde-django)
- [5. Seed Data](#5-seed-data)
- [Apéndice: Esquema Completo](#apéndice-esquema-completo)

---

## 1. Variables de Entorno

### 1.1 Conexión a Base de Datos

| Variable | Descripción | Ejemplo |
|---|---|---|
| `POSTGRES_URL` | Connection string **con pooler** (recomendado para producción) | `postgres://postgres.swmsdgvftvfglcgwezxz:PASS@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require` |
| `POSTGRES_URL_NON_POOLING` | Connection string **sin pooler** (para migrations) | `postgres://postgres.swmsdgvftvfglcgwezxz:PASS@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require` |
| `POSTGRES_HOST` | Host del pooler | `db.swmsdgvftvfglcgwezxz.supabase.co` |
| `POSTGRES_DB` | Nombre de la base de datos | `postgres` |
| `POSTGRES_USER` | Usuario | `postgres` |
| `POSTGRES_PASSWORD` | Contraseña | *ver Supabase Dashboard → Project Settings → Database* |

### 1.2 Supabase Client (para Storage / Auth)

| Variable | Descripción |
|---|---|
| `SUPABASE_URL` | URL del proyecto: `https://swmsdgvftvfglcgwezxz.supabase.co` |
| `SUPABASE_ANON_KEY` | Anon/public key (pública, se puede exponer en el cliente) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key **(solo backend, NUNCA exponer en el cliente)** |
| `SUPABASE_JWT_SECRET` | Secreto JWT para verificar tokens |
| `SUPABASE_SECRET_KEY` | Secret key del proyecto |

### 1.3 Archivo `.env` recomendado para backend/

```env
# ── Django ──────────────────────────────────────────
DJANGO_DEBUG=False
API_SECRET_KEY=<generated-with: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())">
ALLOWED_HOSTS=.vercel.app
ALLOWED_ORIGINS=https://*.vercel.app

# ── Supabase Database ───────────────────────────────
POSTGRES_URL=postgres://postgres.swmsdgvftvfglcgwezxz:<PASSWORD>@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require

# ── Supabase Storage (opcional, si usás Supabase SDK) ──
SUPABASE_URL=https://swmsdgvftvfglcgwezxz.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3bXNkZ3ZmdHZmZ2xjZ3dlenh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4OTM0MDYsImV4cCI6MjA5NDQ2OTQwNn0.Qj41Os6QqZEAc6Qk-mEHKWyDNQG-gRPZbm2a_jLn8TI
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3bXNkZ3ZmdHZmZ2xjZ3dlenh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODg5MzQwNiwiZXhwIjoyMDk0NDY5NDA2fQ.XwSum2V2eGiy2m9N2u8b6fyTFP_F691cjTs06aDVUpE

# ── Cache ───────────────────────────────────────────
CACHE_TTL_SECONDS=3600
```

---

## 2. Base de Datos (PostgreSQL)

### 2.1 Migraciones del Schema

Las migraciones están en `supabase/migrations/` y deben ejecutarse **en orden**:

| Archivo | Descripción |
|---|---|
| `001_initial_schema.sql` | Tablas: `projects`, `technologies`, `project_technologies`, `experience`. RLS público + triggers `updated_at` |
| `002_seed_data.sql` | Datos de ejemplo (technologies + 1 project) |
| `003_add_project_resources.sql` | Columnas: `long_description`, `highlights`, `github_url`, `demo_url`, `pdf_url`, `pdf_size`, `thumbnail_url` |
| `004_fix_and_expand_schema.sql` | Constraints, tablas: `education`, `certifications`, índices adicionales |
| `005_contact_messages.sql` | Tabla: `contact_messages` para el formulario de contacto |

### 2.2 Opción A — Supabase CLI (recomendado)

```bash
# 1. Instalar Supabase CLI (si no lo tenés)
# macOS: brew install supabase/tap/supabase
# Linux: curl -fsSL https://cli.supabase.com/install.sh | sh

# 2. Linkear el proyecto (una sola vez)
supabase link --project-ref swmsdgvftvfglcgwezxz

# 3. Aplicar todas las migraciones pendientes
supabase db push
```

### 2.3 Opción B — SQL Editor manual

Si no querés instalar la CLI, abrí el [Supabase Dashboard](https://supabase.com/dashboard/project/swmsdgvftvfglcgwezxz) y andá a **SQL Editor**. Ejecutá los archivos en orden:

1. Abrí `supabase/migrations/001_initial_schema.sql` → pegar → **Run**
2. `002_seed_data.sql` → **Run**
3. `003_add_project_resources.sql` → **Run**
4. `004_fix_and_expand_schema.sql` → **Run**
5. `005_contact_messages.sql` → **Run**

> **Tip**: Si ejecutaste migraciones anteriores y después cambiaron, podés usar `supabase db push --db-url="$POSTGRES_URL_NON_POOLING"` desde tu máquina para sincronizar sin linkear el proyecto.

### 2.4 Verificar la instalación

Ejecutá este query en SQL Editor para confirmar que todo está en orden:

```sql
SELECT table_name, pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) as size
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Deberías ver: `certifications`, `contact_messages`, `education`, `experience`, `project_technologies`, `projects`, `technologies`.

---

## 3. Storage (Almacenamiento de Archivos)

### 3.1 Buckets recomendados

| Bucket | Uso | Visibilidad |
|---|---|---|
| `project-assets` | Imágenes de proyectos (thumbnails, screenshots, assets) | Público |
| `pdfs` | PDFs de proyectos (CVs, documentos) | Público |

### 3.2 Crear Buckets desde SQL Editor

```sql
-- Bucket: project-assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'project-assets',
    'project-assets',
    true,                            -- público
    5242880,                         -- 5 MB
    ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket: pdfs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'pdfs',
    'pdfs',
    true,                            -- público
    10485760,                        -- 10 MB
    ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket: icons
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'icons',
    'icons',
    true,                            -- público
    1048576,                         -- 1 MB
    ARRAY['image/png', 'image/svg+xml', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;
```

### 3.3 RLS Policies para Storage

```sql
-- === project-assets ===
-- Cualquier persona puede leer archivos públicos
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'project-assets');

-- Solo admins autenticados pueden subir/actualizar/borrar
CREATE POLICY "Admin insert access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-assets');

CREATE POLICY "Admin update access"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'project-assets')
WITH CHECK (bucket_id = 'project-assets');

CREATE POLICY "Admin delete access"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'project-assets');

-- === pdfs ===
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'pdfs');

CREATE POLICY "Admin insert access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'pdfs');

CREATE POLICY "Admin update access"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'pdfs')
WITH CHECK (bucket_id = 'pdfs');

CREATE POLICY "Admin delete access"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'pdfs');

-- === icons ===
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'icons');

CREATE POLICY "Admin insert access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'icons');

CREATE POLICY "Admin update access"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'icons')
WITH CHECK (bucket_id = 'icons');

CREATE POLICY "Admin delete access"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'icons');
```

### 3.4 URL pública de un archivo

Una vez subido un archivo, la URL pública sigue este patrón:

```
https://swmsdgvftvfglcgwezxz.supabase.co/storage/v1/object/public/{bucket}/{ruta/completa/archivo.png}
```

Ejemplo para un avatar subido a `project-assets/mi-proyecto/thumbnail.webp`:

```
https://swmsdgvftvfglcgwezxz.supabase.co/storage/v1/object/public/project-assets/mi-proyecto/thumbnail.webp
```

---

## 4. Conexión desde Django

### 4.1 Configuración actual

El backend Django ya está configurado para usar Supabase. Lee `POSTGRES_URL` del entorno y arma la conexión automáticamente:

```python
# backend/portfolio_backend/settings.py (ya funciona)
db_url = os.getenv('POSTGRES_URL', '')
if db_url:
    result = urlparse(db_url)
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': result.path.lstrip('/'),
            'USER': result.username,
            'PASSWORD': result.password,
            'HOST': result.hostname,
            'PORT': result.port or 5432,
            'OPTIONS': {'sslmode': 'require'},
        }
    }
```

### 4.2 Para desarrollo local

Si querés conectar tu Django local a Supabase:

```bash
# 1. Seteá la variable de entorno
export POSTGRES_URL="postgres://postgres.swmsdgvftvfglcgwezxz:<PASSWORD>@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require"

# 2. Corré las migraciones de Django
pnpm --filter backend migrate

# 3. Sembrá datos
pnpm --filter backend seed
```

> **⚠️ Pooler**: Usá el puerto `6543` (con pooler) para producción.
> Usá `POSTGRES_URL_NON_POOLING` (puerto `5432`) para ejecutar migrations,
> porque el pooler de Supabase no soporta ciertas operaciones DDL.

### 4.3 Para Vercel (producción)

Seteá `POSTGRES_URL` como Environment Variable en el proyecto de Vercel.
El backend se despliega como serverless function y la conexión se configura automáticamente.

---

## 5. Seed Data

Para poblar la base de datos con datos de desarrollo:

```bash
# Desde el backend Django
pnpm --filter backend seed
```

Esto ejecuta el comando `seed_data` que lee los manifests generados por el codegen
(`frontend/scripts/sync-all-projects.mjs` + `generate-site-data.mjs`) y los inserta en la BD.

> Si querés seed data directo en Supabase sin Django, ejecutá
> `supabase/migrations/002_seed_data.sql` en el SQL Editor.

---

## Apéndice: Esquema Completo

### Tablas

| Tabla | Propósito | RLS |
|---|---|---|
| `projects` | Proyectos del portfolio | SELECT público |
| `technologies` | Tecnologías/stack | SELECT público |
| `project_technologies` | Relación M:N proyectos ↔ tecnologías | SELECT público |
| `experience` | Experiencia laboral | SELECT público |
| `education` | Formación académica | SELECT público |
| `certifications` | Certificaciones | SELECT público |
| `contact_messages` | Mensajes del formulario de contacto | INSERT público, SELECT autenticado |

### Buckets de Storage

| Bucket | Max tamaño | Tipos permitidos | Visibilidad |
|---|---|---|---|
| `project-assets` | 5 MB | PNG, JPEG, WebP, GIF, SVG | Público |
| `pdfs` | 10 MB | PDF | Público |
| `icons` | 1 MB | PNG, SVG, WebP | Público |

### Políticas de RLS generales

- **Tablas de contenido** (`projects`, `technologies`, `experience`, `education`, `certifications`): `SELECT` público (cualquiera puede leer).
- **`contact_messages`**: `INSERT` público (para el formulario), `SELECT` solo usuarios autenticados (admin).
- **Storage**: `SELECT` público, escritura solo usuarios autenticados.

---

> **Dashboard**: https://supabase.com/dashboard/project/swmsdgvftvfglcgwezxz
> **Documentación Supabase**: https://supabase.com/docs
