# Sistema de Generación Automática de Proyectos

Este documento explica cómo funciona el sistema de generación automática de proyectos desde `public/Proyectos/`.

## Arquitectura

### Frontend (Build-time Generation)

El sistema lee la carpeta `public/Proyectos/` en **build time** y genera archivos markdown en `src/content/proyectos/` que se integran con la Content Collection de Astro.

**Flujo:**
1. Script Node.js lee recursivamente `public/Proyectos/`
2. Por cada carpeta de proyecto:
   - Detecta README.md y extrae metadata
   - Detecta package.json para info de GitHub
   - Detecta .git/config para repo URL
   - Encuentra PDFs y calcula tamaño
   - Encuentra imágenes para thumbnails
   - Genera resumen extractivo del README
   - Detecta categoría automáticamente
   - Extrae tecnologías del contenido
3. Genera archivo `.md` con frontmatter YAML
4. Astro procesa estos archivos como parte de la Content Collection

### Backend (Database Ingestion)

Script Python lee los archivos markdown generados y los inserta en Supabase.

**Flujo:**
1. Lee archivos de `frontend/src/content/proyectos/`
2. Parsea frontmatter YAML
3. Extrae highlights del body
4. Crea/actualiza proyectos en Supabase
5. Crea/vincula tecnologías

## Uso

### 1. Generar proyectos desde public/Proyectos/

```bash
cd frontend
pnpm run generate:projects
```

Esto genera archivos en `src/content/proyectos/`.

### 2. Build del frontend (incluye generación automática)

```bash
cd frontend
pnpm run build
```

El comando `build` ejecuta automáticamente `generate:projects` antes de compilar.

### 3. Ingestar proyectos en Supabase

```bash
cd backend
python scripts/ingest_projects_from_content.py
```

**Requisitos:**
- Variables de entorno configuradas en `backend/.env`:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_KEY` o `SUPABASE_ANON_KEY`

### 4. Aplicar migración de base de datos

Si es la primera vez, aplica la migración para agregar los campos nuevos:

```bash
# Usando Supabase CLI
supabase db push

# O manualmente en Supabase Dashboard > SQL Editor
# Ejecuta el contenido de: supabase/migrations/003_add_project_resources.sql
```

## Estructura de Carpetas de Proyectos

Cada proyecto en `public/Proyectos/` puede tener:

```
public/Proyectos/
├── MiProyecto/
│   ├── README.md          # Metadata y descripción (recomendado)
│   ├── package.json       # Info de GitHub (opcional)
│   ├── .git/              # Repo info (opcional)
│   ├── documento.pdf      # PDF descargable (opcional)
│   ├── imagen.jpg         # Thumbnail (opcional)
│   └── ...otros archivos
```

### Metadata Detectada Automáticamente

**Desde README.md:**
- Título (primer heading `#`)
- Descripción (resumen extractivo)
- Tecnologías (menciones de Python, TensorFlow, etc.)
- Categoría (por palabras clave)

**Desde package.json:**
- `repository.url` → GitHub URL
- `description` → Descripción (si no hay README)

**Desde .git/config:**
- `url` → GitHub URL (si no hay package.json)

**Desde archivos:**
- Primer `.pdf` encontrado → PDF descargable
- Primera imagen → Thumbnail

## Categorías Automáticas

El sistema detecta categorías basándose en el nombre de carpeta y contenido:

- **Business Intelligence**: dashboard, power bi, tableau
- **Deep Learning**: red, neural, cnn, gan, tensorflow
- **Machine Learning**: regresion, clasificacion, prediccion, scikit-learn
- **Análisis de Datos**: analisis, eda, pandas
- **Notebooks**: carpeta "notebook"
- **Otros**: por defecto

## Tecnologías Detectadas

El sistema busca menciones de:
- Python, TensorFlow, Keras, PyTorch
- Scikit-learn, Pandas, NumPy
- Matplotlib, Seaborn, Jupyter
- OpenCV, Power BI, Tableau
- SQL, R, BigQuery, Google Analytics

## Campos en Base de Datos

### Tabla `projects`

```sql
- id (UUID)
- slug (TEXT, unique)
- title (TEXT)
- description (TEXT)
- long_description (TEXT)
- category (TEXT)
- status (TEXT)
- featured (BOOLEAN)
- highlights (JSONB)
- github_url (TEXT)
- demo_url (TEXT)
- pdf_url (TEXT)
- pdf_size (TEXT)
- thumbnail_url (TEXT)
- assets (JSONB)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

### Tabla `technologies`

```sql
- id (UUID)
- name (TEXT, unique)
- slug (TEXT, unique)
- icon_url (TEXT)
- category (TEXT)
- created_at (TIMESTAMPTZ)
```

### Tabla `project_technologies` (junction)

```sql
- project_id (UUID, FK)
- technology_id (UUID, FK)
```

## Agregar un Nuevo Proyecto

1. Crea una carpeta en `public/Proyectos/NuevoProyecto/`
2. Agrega un `README.md` con descripción
3. (Opcional) Agrega PDFs, imágenes, etc.
4. Ejecuta `pnpm run generate:projects` en `frontend/`
5. Verifica el archivo generado en `src/content/proyectos/`
6. Ejecuta `python scripts/ingest_projects_from_content.py` en `backend/`

## Troubleshooting

### Los proyectos no aparecen en el sitio

1. Verifica que se generaron los archivos `.md`:
   ```bash
   ls frontend/src/content/proyectos/
   ```

2. Verifica que el build de Astro no tenga errores:
   ```bash
   cd frontend
   pnpm run build
   ```

### Los proyectos no están en Supabase

1. Verifica las variables de entorno en `backend/.env`
2. Verifica que la migración se aplicó:
   ```sql
   SELECT column_name FROM information_schema.columns 
   WHERE table_name = 'projects';
   ```
3. Ejecuta el script de ingesta con logs:
   ```bash
   cd backend
   python scripts/ingest_projects_from_content.py
   ```

### PDFs no se descargan

Los PDFs deben estar en `public/Proyectos/` y el `pdf_url` debe ser relativo a `public/`:
- ✅ Correcto: `/Proyectos/MiProyecto/documento.pdf`
- ❌ Incorrecto: `C:/Users/.../public/Proyectos/...`

## Notas Técnicas

- **Build-time vs Runtime**: La generación es en build-time, no runtime. Necesitas rebuild para agregar proyectos nuevos.
- **Vercel Compatible**: Todo funciona en Vercel porque los PDFs están en `public/` (servidos estáticamente).
- **No Dependencies**: El script usa solo Node.js built-ins (fs, path). No requiere instalación adicional.
- **Idempotente**: Puedes ejecutar los scripts múltiples veces sin duplicar datos.
