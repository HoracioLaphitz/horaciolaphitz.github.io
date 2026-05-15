# 📊 Proyectos Interactivos con Jupyter Notebooks

Este directorio contiene proyectos de análisis de datos y machine learning convertidos en aplicaciones web interactivas usando Mercury.

## 🏗️ Estructura de Proyectos

Cada proyecto debe seguir esta estructura:

```
/Proyectos
  /nombre-proyecto
    - README.md              # Descripción del proyecto
    - notebook.ipynb         # Notebook principal
    - requirements.txt       # Dependencias Python
    /imagenes               # Imágenes y recursos
    /datos                  # Datasets (opcional)
```

## 🚀 Cómo Agregar un Nuevo Proyecto

### 1. Crear la Estructura

```bash
mkdir Proyectos/mi-nuevo-proyecto
cd Proyectos/mi-nuevo-proyecto
```

### 2. Crear el Notebook

Tu notebook debe incluir:

```python
# En la primera celda (Markdown)
# Título del Proyecto

Descripción breve del proyecto y objetivos.

# En las celdas de código
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Para widgets interactivos con Mercury
import mercury as mr

# Ejemplo de widget
slider = mr.Slider(label="Parámetro", value=50, min=0, max=100)
```

### 3. Crear README.md

```markdown
# Nombre del Proyecto

## Descripción

Breve descripción del proyecto

## Tecnologías

- Python 3.x
- Pandas
- Matplotlib
- Scikit-learn

## Instalación

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## Uso

Descripción de cómo usar el notebook
```

### 4. Crear requirements.txt

```txt
pandas>=2.0.0
numpy>=1.24.0
matplotlib>=3.7.0
seaborn>=0.12.0
scikit-learn>=1.3.0
mercury>=2.3.0
```

### 5. Procesar y Desplegar

```bash
# Procesar todos los notebooks
pnpm run process-notebooks

# Generar configuraciones de Mercury
pnpm run generate-mercury

# O ejecutar ambos
pnpm run notebooks:setup

# Construir y desplegar
pnpm run build
```

## 🎨 Widgets Interactivos con Mercury

### Slider

```python
import mercury as mr

slider = mr.Slider(
    label="Selecciona un valor",
    value=50,
    min=0,
    max=100,
    step=1
)
```

### Select

```python
select = mr.Select(
    label="Elige una opción",
    value="Opción 1",
    choices=["Opción 1", "Opción 2", "Opción 3"]
)
```

### Numeric Input

```python
numeric = mr.Numeric(
    label="Ingresa un número",
    value=10,
    min=0,
    max=1000
)
```

### Checkbox

```python
checkbox = mr.Checkbox(
    label="Activar característica",
    value=True
)
```

### Text Input

```python
text = mr.Text(
    label="Ingresa texto",
    value="Valor por defecto"
)
```

## 📝 Configuración de Mercury (YAML)

El script `generate-mercury-config.mjs` genera automáticamente archivos YAML, pero puedes personalizarlos:

```yaml
---
title: Mi Proyecto Interactivo
description: Análisis de datos con widgets interactivos
show-code: True
show-prompt: False
continuous-update: True
static-notebook: False
allow-download: True
allow-share: True
params:
  slider_param:
    label: Parámetro de ejemplo
    value: 50
    input: slider
    min: 0
    max: 100
---
```

## 🎯 Categorías de Proyectos

Los proyectos se categorizan automáticamente:

- **Machine Learning**: Modelos predictivos, clasificación, regresión
- **Data Analysis**: EDA, estadística, visualizaciones
- **Data Engineering**: ETL, pipelines, transformaciones
- **Computer Vision**: Procesamiento de imágenes, CNNs
- **NLP**: Procesamiento de lenguaje natural
- **Business Intelligence**: Dashboards, análisis de negocio

## 🔧 Scripts Disponibles

- `pnpm run process-notebooks` - Procesa todos los notebooks
- `pnpm run generate-mercury` - Genera configuraciones YAML
- `pnpm run notebooks:setup` - Ejecuta ambos scripts
- `pnpm run dev` - Servidor de desarrollo
- `pnpm run build` - Construir para producción

## 📚 Recursos

- [Mercury Documentation](https://runmercury.com/docs/)
- [Jupyter Notebook](https://jupyter.org/)
- [Astro Documentation](https://docs.astro.build/)

## 🌟 Ejemplos de Proyectos

Revisa los proyectos existentes en este directorio para ver ejemplos completos de implementación.
