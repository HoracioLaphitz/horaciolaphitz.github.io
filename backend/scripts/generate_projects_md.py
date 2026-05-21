"""Script to generate markdown files for all projects"""
import os
from pathlib import Path

PROJECTS_DATA = [
    {
        "slug": "prediccion-precios-casas",
        "title": "Predicción de Precios de Casas",
        "description": "Desarrollo e implementación de modelos de regresión lineal para predicción de precios inmobiliarios",
        "long_description": "Proyecto completo de machine learning aplicado a predicción de precios de casas. Incluye análisis exploratorio de datos (EDA) completo, desarrollo e implementación de modelos de regresión lineal, técnicas de normalización y escalado de datos, y validación rigurosa de modelos predictivos.",
        "category": "Machine Learning",
        "featured": True,
        "technologies": ["Python", "Scikit-learn", "Pandas", "NumPy"],
        "highlights": ["Análisis exploratorio de datos (EDA) completo", "Modelos de regresión lineal", "Normalización y escalado de datos", "Validación y evaluación de modelos"]
    },
    {
        "slug": "regresion-logistica",
        "title": "Regresión Logística - Clasificación Binaria",
        "description": "Aplicación de regresión logística para problemas de clasificación con análisis de rendimiento",
        "long_description": "Implementación completa de regresión logística para tareas de clasificación binaria. Incluye optimización de umbrales de decisión, análisis detallado de métricas de rendimiento como Precision, Recall y F1-Score, generación de curvas ROC y matrices de confusión.",
        "category": "Machine Learning",
        "featured": False,
        "technologies": ["Python", "Scikit-learn", "Matplotlib"],
        "highlights": ["Regresión logística", "Optimización de umbrales", "Métricas: Precision, Recall, F1-Score", "Curvas ROC y matriz de confusión"]
    },
    {
        "slug": "arboles-decision-titanic",
        "title": "Árboles de Decisión - Dataset TITANIC",
        "description": "Desarrollo de árboles de decisión para predicción de supervivencia en el Titanic",
        "long_description": "Proyecto de machine learning usando árboles de decisión sobre el famoso dataset del Titanic. Incluye desarrollo y optimización de árboles de decisión, análisis de importancia de variables, técnicas de poda y optimización, y visualización de estructuras de árbol complejas.",
        "category": "Machine Learning",
        "featured": True,
        "technologies": ["Python", "Scikit-learn", "Pandas", "Graphviz"],
        "highlights": ["Árboles de decisión", "Análisis de importancia de variables", "Poda y optimización", "Visualización de árboles"]
    },
    {
        "slug": "prediccion-precios-acciones",
        "title": "Predicción de Precios de Acciones",
        "description": "Análisis de series temporales y modelos de predicción para precios de acciones",
        "long_description": "Proyecto avanzado de análisis de series temporales aplicado a predicción de precios de acciones. Incluye técnicas de análisis temporal, modelos de predicción de precios, validación cruzada temporal y forecasting con métodos estadísticos avanzados.",
        "category": "Machine Learning",
        "featured": False,
        "technologies": ["Python", "Pandas", "Statsmodels", "ARIMA"],
        "highlights": ["Análisis de series temporales", "Modelos de predicción", "Validación cruzada temporal", "Forecasting avanzado"]
    },
    {
        "slug": "redes-convolucionales-cnn",
        "title": "Redes Neuronales Convolucionales (CNN)",
        "description": "Arquitecturas CNN para predicción y clasificación de imágenes",
        "long_description": "Implementación de redes neuronales convolucionales profundas para visión por computadora. Incluye arquitecturas CNN avanzadas, técnicas de Transfer Learning y Fine-tuning, aumentación de datos y evaluación rigurosa de modelos visuales.",
        "category": "Deep Learning",
        "featured": True,
        "technologies": ["Python", "TensorFlow", "Keras", "OpenCV"],
        "highlights": ["Arquitecturas CNN", "Transfer Learning", "Aumentación de datos", "Evaluación de modelos visuales"]
    },
    {
        "slug": "prediccion-terremotos",
        "title": "Red Neuronal para Predicción de Terremotos",
        "description": "Modelado de eventos sísmicos con series temporales y redes neuronales",
        "long_description": "Proyecto especializado en predicción de terremotos usando redes neuronales. Incluye modelado de eventos sísmicos, procesamiento de series temporales geofísicas, predicción de magnitudes de terremotos y análisis de patrones sísmicos.",
        "category": "Deep Learning",
        "featured": False,
        "technologies": ["Python", "TensorFlow", "NumPy", "Pandas"],
        "highlights": ["Modelado sísmico", "Series temporales geofísicas", "Predicción de magnitudes", "Análisis de patrones"]
    },
    {
        "slug": "redes-generativas-adversariales",
        "title": "Redes Generativas Adversariales (GAN)",
        "description": "Generación de datos sintéticos usando arquitecturas GAN modernas",
        "long_description": "Implementación avanzada de Redes Generativas Adversariales para síntesis de datos. Incluye desarrollo de arquitecturas GAN modernas, generación de datos sintéticos de alta calidad y aplicaciones creativas de redes adversariales.",
        "category": "Deep Learning",
        "featured": False,
        "technologies": ["Python", "TensorFlow", "Keras"],
        "highlights": ["Arquitecturas GAN", "Síntesis de datos", "Redes adversariales", "Aplicaciones creativas"]
    },
    {
        "slug": "deep-dreams-arte-neural",
        "title": "Deep Dreams - Generación de Arte Neural",
        "description": "Generación de imágenes artísticas usando redes neuronales profundas",
        "long_description": "Proyecto creativo que utiliza Deep Dreams para generar imágenes artísticas. Incluye generación de imágenes con redes neuronales, visualización de características aprendidas y aplicaciones artísticas de deep learning.",
        "category": "Deep Learning",
        "featured": False,
        "technologies": ["Python", "TensorFlow", "PIL"],
        "highlights": ["Deep Dreams", "Generación de imágenes", "Visualización de características", "Arte neural"]
    },
    {
        "slug": "red-clasificacion-optimizada",
        "title": "Red de Clasificación Optimizada",
        "description": "Arquitecturas neuronales profundas optimizadas para tareas de clasificación",
        "long_description": "Desarrollo de arquitecturas neuronales profundas altamente optimizadas. Incluye optimización de capas y funciones de activación, regularización avanzada y dropout para evitar overfitting.",
        "category": "Deep Learning",
        "featured": False,
        "technologies": ["Python", "TensorFlow", "Keras"],
        "highlights": ["Arquitecturas profundas", "Optimización de capas", "Regularización", "Prevención de overfitting"]
    },
    {
        "slug": "clustering-agrupamientos",
        "title": "Clustering - Análisis de Agrupamientos",
        "description": "Implementación de algoritmos de clustering para segmentación de datos",
        "long_description": "Proyecto completo de clustering y segmentación de datos. Incluye implementación de K-Means y otros algoritmos de clustering, análisis de segmentación, determinación del número óptimo de clusters y validación rigurosa de resultados.",
        "category": "Machine Learning",
        "featured": False,
        "technologies": ["Python", "Scikit-learn", "Pandas"],
        "highlights": ["K-Means", "Algoritmos de clustering", "Segmentación de datos", "Validación de clusters"]
    },
    {
        "slug": "etl-procesamiento-datos",
        "title": "ETL - Procesamiento Integral de Datos",
        "description": "Extracción, transformación y carga completa de datos de múltiples fuentes",
        "long_description": "Proyecto integral de procesamiento ETL. Incluye extracción de múltiples fuentes de datos, transformación y limpieza rigurosa, carga en sistemas de análisis y desarrollo de pipelines de datos automatizados y robustos.",
        "category": "Data Engineering",
        "featured": True,
        "technologies": ["Python", "Pandas", "SQL", "n8n"],
        "highlights": ["Extracción de múltiples fuentes", "Transformación y limpieza", "Carga en sistemas", "Pipelines automatizados"]
    },
    {
        "slug": "analisis-datos-r",
        "title": "Análisis Computacional de Datos en R",
        "description": "Análisis estadístico avanzado y modelado computacional con R",
        "long_description": "Proyecto de análisis avanzado usando R. Incluye análisis estadístico avanzado, modelado computacional, visualización avanzada de datos y generación de reportes estadísticos complejos.",
        "category": "Data Analysis",
        "featured": False,
        "technologies": ["R", "ggplot2", "dplyr"],
        "highlights": ["Análisis estadístico", "Modelado computacional", "Visualización avanzada", "Reportes estadísticos"]
    },
    {
        "slug": "analisis-poblacional",
        "title": "Análisis Poblacional",
        "description": "Análisis de datos demográficos y distribuciones poblacionales",
        "long_description": "Proyecto de análisis demográfico completo. Incluye análisis de datos demográficos, visualizaciones de distribuciones poblacionales, análisis de tendencias poblacionales e interpretación de patrones demográficos.",
        "category": "Data Analysis",
        "featured": False,
        "technologies": ["Python", "Pandas", "Matplotlib"],
        "highlights": ["Datos demográficos", "Distribuciones poblacionales", "Tendencias poblacionales", "Patrones demográficos"]
    },
    {
        "slug": "pandas-profiling",
        "title": "Pandas Profiling - Perfilado Automático de Datos",
        "description": "Generación automática de reportes EDA y análisis de calidad de datos",
        "long_description": "Implementación de Pandas Profiling para análisis automático de datos. Incluye generación automática de reportes EDA completos, análisis de calidad de datos, detección de valores faltantes e identificación de outliers y anomalías.",
        "category": "Data Analysis",
        "featured": False,
        "technologies": ["Python", "Pandas Profiling", "Pandas"],
        "highlights": ["Reportes EDA automáticos", "Análisis de calidad", "Detección de faltantes", "Identificación de anomalías"]
    },
    {
        "slug": "bigquery-limpieza",
        "title": "Clean for Google BigQuery",
        "description": "Limpieza y preparación de datos para BigQuery",
        "long_description": "Proyecto de preparación de datos para BigQuery. Incluye limpieza rigurosa de datos, optimización de esquemas, particionamiento inteligente de datos y mejora de rendimiento de queries.",
        "category": "Data Engineering",
        "featured": False,
        "technologies": ["Python", "BigQuery", "SQL"],
        "highlights": ["Limpieza de datos", "Optimización de esquemas", "Particionamiento", "Mejora de rendimiento"]
    },
    {
        "slug": "google-analytics-analisis",
        "title": "Análisis de Datos de Google Analytics",
        "description": "Extracción y análisis de datos de Google Analytics",
        "long_description": "Proyecto de análisis de Google Analytics. Incluye extracción de datos de Google Analytics, análisis de tráfico web, segmentación de usuarios y análisis profundo de comportamiento del usuario.",
        "category": "Data Analysis",
        "featured": False,
        "technologies": ["Python", "Google Analytics API", "Pandas"],
        "highlights": ["Extracción de GA", "Análisis de tráfico", "Segmentación de usuarios", "Comportamiento del usuario"]
    },
    {
        "slug": "sano-y-fresco-dashboard",
        "title": "Proyecto Sano y Fresco - Dashboard Integral",
        "description": "Dashboard completo de ventas, productos y análisis comercial",
        "long_description": "Dashboard integral para empresa de alimentos frescos. Incluye dashboard de ventas y productos, análisis de clientes y comportamiento de compra, métricas de desempeño comercial, KPI's interactivos y análisis de tendencias de venta con segmentación de productos.",
        "category": "Business Intelligence",
        "featured": True,
        "technologies": ["Python", "Power BI", "SQL"],
        "highlights": ["Dashboard de ventas", "Análisis de clientes", "Comportamiento de compra", "KPI's comerciales", "Segmentación de productos"]
    },
    {
        "slug": "dashboard-ventas-interactivo",
        "title": "Dashboard Interactivo de Ventas",
        "description": "Visualización de datos comerciales con KPI's en tiempo real",
        "long_description": "Dashboard interactivo de análisis comercial. Incluye visualización de datos comerciales en tiempo real, KPI's interactivos y actualizados, análisis de tendencias por período y análisis de rentabilidad por producto.",
        "category": "Business Intelligence",
        "featured": False,
        "technologies": ["Python", "Tableau", "SQL"],
        "highlights": ["Datos en tiempo real", "KPI's interactivos", "Tendencias por período", "Rentabilidad por producto"]
    },
    {
        "slug": "nba-analisis-deportivo",
        "title": "NBA Analysis - Análisis de Datos Deportivos",
        "description": "Análisis estadístico de jugadores y rendimiento deportivo",
        "long_description": "Análisis estadístico completo de datos deportivos de NBA. Incluye análisis de estadísticas de jugadores, visualización de rendimiento deportivo, análisis comparativo de equipos y predicción de resultados.",
        "category": "Data Analysis",
        "featured": False,
        "technologies": ["Python", "Pandas", "Matplotlib"],
        "highlights": ["Estadísticas de jugadores", "Rendimiento deportivo", "Análisis comparativo", "Predicción de resultados"]
    },
    {
        "slug": "warriors-games-analisis",
        "title": "Warriors Games - Análisis de Videojuegos",
        "description": "Análisis de datos y estadísticas de videojuegos",
        "long_description": "Análisis de datos de videojuegos Warriors. Incluye análisis de datos de juegos, estadísticas de jugadores y análisis de mecánicas de juego.",
        "category": "Data Analysis",
        "featured": False,
        "technologies": ["Python", "Pandas", "Matplotlib"],
        "highlights": ["Datos de juegos", "Estadísticas de jugadores", "Mecánicas de juego", "Análisis de rendimiento"]
    },
    {
        "slug": "banks-project-analisis",
        "title": "Banks Project - Análisis Bancario",
        "description": "Análisis de datos financieros y riesgo crediticio",
        "long_description": "Proyecto de análisis bancario y financiero. Incluye análisis de datos financieros, modelos de riesgo crediticio y análisis de cartera de clientes.",
        "category": "Business Intelligence",
        "featured": False,
        "technologies": ["Python", "Pandas", "Scikit-learn"],
        "highlights": ["Datos financieros", "Riesgo crediticio", "Cartera de clientes", "Análisis de riesgos"]
    },
    {
        "slug": "conversion-temperatura",
        "title": "Conversión de Temperatura - Celsius a Fahrenheit",
        "description": "Herramienta de procesamiento y conversión de unidades de temperatura",
        "long_description": "Utilidad de procesamiento de temperaturas. Incluye procesamiento de conversiones precisas, automatización de transformaciones y pipelines de conversión de unidades.",
        "category": "Utilities",
        "featured": False,
        "technologies": ["Python"],
        "highlights": ["Conversión precisa", "Automatización", "Pipelines de conversión", "Manejo de unidades"]
    },
    {
        "slug": "programacion-orientada-objetos",
        "title": "Análisis Orientado a Objetos en Python",
        "description": "Conceptos fundamentales y aplicaciones de POO",
        "long_description": "Proyecto educativo de programación orientada a objetos. Incluye conceptos fundamentales de POO, diseño de aplicaciones escalables y patrones de diseño profesionales.",
        "category": "Programming",
        "featured": False,
        "technologies": ["Python"],
        "highlights": ["Conceptos de POO", "Diseño de aplicaciones", "Patrones de diseño", "Aplicaciones escalables"]
    },
]

def generate_markdown_files():
    """Generate markdown files for all projects"""
    output_dir = Path(__file__).parent / "generated_projects"
    output_dir.mkdir(exist_ok=True)
    
    for idx, project in enumerate(PROJECTS_DATA, 1):
        slug = project["slug"]
        title = project["title"]
        description = project["description"]
        long_description = project["long_description"]
        category = project["category"]
        featured = project["featured"]
        technologies = project["technologies"]
        highlights = project["highlights"]
        
        # Create markdown file
        filename = f"{idx:02d}-{slug}.md"
        filepath = output_dir / filename
        
        featured_str = "true" if featured else "false"
        tech_list = ", ".join([f'"{t}"' for t in technologies])
        highlights_list = "\n    - ".join([f'"{h}"' for h in highlights])
        
        content = f"""---
title: "{title}"
description: "{description}"
category: "{category}"
featured: {featured_str}
status: "completed"
technologies: [{tech_list}]
createdAt: 2024-03-15
---

## Descripción del Proyecto

{long_description}

### Características Destacadas

- {highlights_list.replace('"', '')}

### Tecnologías Utilizadas

{chr(10).join([f"- {t}" for t in technologies])}
"""
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        
        print(f"✓ Generado: {filename}")

if __name__ == "__main__":
    generate_markdown_files()
    print("\n✅ Todos los archivos de proyectos han sido generados exitosamente.")
