from django.core.management.base import BaseCommand
from portfolio.models import Project, Technology, Experience, Education, Certification


PROJECTS_DATA = [
    {
        "slug": "prediccion-precios-casas",
        "title": "Predicción de Precios de Casas",
        "description": "Desarrollo e implementación de modelos de regresión lineal para predicción de precios inmobiliarios",
        "long_description": "Proyecto completo de machine learning aplicado a predicción de precios de casas. Incluye análisis exploratorio de datos (EDA) completo, desarrollo e implementación de modelos de regresión lineal, técnicas de normalización y escalado de datos, y validación rigurosa de modelos predictivos.",
        "category": "Machine Learning",
        "status": "completed",
        "featured": True,
        "highlights": ["Análisis exploratorio de datos (EDA) completo", "Modelos de regresión lineal", "Normalización y escalado de datos", "Validación y evaluación de modelos"],
        "technologies": ["Python", "Scikit-learn", "Pandas", "NumPy"],
        "assets": []
    },
    {
        "slug": "regresion-logistica",
        "title": "Regresión Logística - Clasificación Binaria",
        "description": "Aplicación de regresión logística para problemas de clasificación con análisis de rendimiento",
        "long_description": "Implementación completa de regresión logística para tareas de clasificación binaria. Incluye optimización de umbrales de decisión, análisis detallado de métricas de rendimiento como Precision, Recall y F1-Score, generación de curvas ROC y matrices de confusión.",
        "category": "Machine Learning",
        "status": "completed",
        "featured": False,
        "highlights": ["Regresión logística", "Optimización de umbrales", "Métricas: Precision, Recall, F1-Score", "Curvas ROC y matriz de confusión"],
        "technologies": ["Python", "Scikit-learn", "Matplotlib"],
        "assets": []
    },
    {
        "slug": "arboles-decision-titanic",
        "title": "Árboles de Decisión - Dataset TITANIC",
        "description": "Desarrollo de árboles de decisión para predicción de supervivencia en el Titanic",
        "long_description": "Proyecto de machine learning usando árboles de decisión sobre el famoso dataset del Titanic. Incluye desarrollo y optimización de árboles de decisión, análisis de importancia de variables, técnicas de poda y optimización, y visualización de estructuras de árbol complejas.",
        "category": "Machine Learning",
        "status": "completed",
        "featured": True,
        "highlights": ["Árboles de decisión", "Análisis de importancia de variables", "Poda y optimización", "Visualización de árboles"],
        "technologies": ["Python", "Scikit-learn", "Pandas", "Graphviz"],
        "assets": []
    },
    {
        "slug": "prediccion-precios-acciones",
        "title": "Predicción de Precios de Acciones",
        "description": "Análisis de series temporales y modelos de predicción para precios de acciones",
        "long_description": "Proyecto avanzado de análisis de series temporales aplicado a predicción de precios de acciones. Incluye técnicas de análisis temporal, modelos de predicción de precios, validación cruzada temporal y forecasting con métodos estadísticos avanzados.",
        "category": "Machine Learning",
        "status": "completed",
        "featured": False,
        "highlights": ["Análisis de series temporales", "Modelos de predicción", "Validación cruzada temporal", "Forecasting avanzado"],
        "technologies": ["Python", "Pandas", "Statsmodels", "ARIMA"],
        "assets": []
    },
    {
        "slug": "redes-convolucionales-cnn",
        "title": "Redes Neuronales Convolucionales (CNN)",
        "description": "Arquitecturas CNN para predicción y clasificación de imágenes",
        "long_description": "Implementación de redes neuronales convolucionales profundas para visión por computadora. Incluye arquitecturas CNN avanzadas, técnicas de Transfer Learning y Fine-tuning, aumentación de datos y evaluación rigurosa de modelos visuales.",
        "category": "Deep Learning",
        "status": "completed",
        "featured": True,
        "highlights": ["Arquitecturas CNN", "Transfer Learning", "Aumentación de datos", "Evaluación de modelos visuales"],
        "technologies": ["Python", "TensorFlow", "Keras", "OpenCV"],
        "assets": []
    },
    {
        "slug": "prediccion-terremotos",
        "title": "Red Neuronal para Predicción de Terremotos",
        "description": "Modelado de eventos sísmicos con series temporales y redes neuronales",
        "long_description": "Proyecto especializado en predicción de terremotos usando redes neuronales. Incluye modelado de eventos sísmicos, procesamiento de series temporales geofísicas, predicción de magnitudes de terremotos y análisis de patrones sísmicos.",
        "category": "Deep Learning",
        "status": "completed",
        "featured": False,
        "highlights": ["Modelado sísmico", "Series temporales geofísicas", "Predicción de magnitudes", "Análisis de patrones"],
        "technologies": ["Python", "TensorFlow", "NumPy", "Pandas"],
        "assets": []
    },
    {
        "slug": "redes-generativas-adversariales",
        "title": "Redes Generativas Adversariales (GAN)",
        "description": "Generación de datos sintéticos usando arquitecturas GAN modernas",
        "long_description": "Implementación avanzada de Redes Generativas Adversariales para síntesis de datos. Incluye desarrollo de arquitecturas GAN modernas, generación de datos sintéticos de alta calidad y aplicaciones creativas de redes adversariales.",
        "category": "Deep Learning",
        "status": "completed",
        "featured": False,
        "highlights": ["Arquitecturas GAN", "Síntesis de datos", "Redes adversariales", "Aplicaciones creativas"],
        "technologies": ["Python", "TensorFlow", "Keras"],
        "assets": []
    },
    {
        "slug": "deep-dreams-arte-neural",
        "title": "Deep Dreams - Generación de Arte Neural",
        "description": "Generación de imágenes artísticas usando redes neuronales profundas",
        "long_description": "Proyecto creativo que utiliza Deep Dreams para generar imágenes artísticas. Incluye generación de imágenes con redes neuronales, visualización de características aprendidas y aplicaciones artísticas de deep learning.",
        "category": "Deep Learning",
        "status": "completed",
        "featured": False,
        "highlights": ["Deep Dreams", "Generación de imágenes", "Visualización de características", "Arte neural"],
        "technologies": ["Python", "TensorFlow", "PIL"],
        "assets": []
    },
    {
        "slug": "red-clasificacion-optimizada",
        "title": "Red de Clasificación Optimizada",
        "description": "Arquitecturas neuronales profundas optimizadas para tareas de clasificación",
        "long_description": "Desarrollo de arquitecturas neuronales profundas altamente optimizadas. Incluye optimización de capas y funciones de activación, regularización avanzada y dropout para evitar overfitting.",
        "category": "Deep Learning",
        "status": "completed",
        "featured": False,
        "highlights": ["Arquitecturas profundas", "Optimización de capas", "Regularización", "Prevención de overfitting"],
        "technologies": ["Python", "TensorFlow", "Keras"],
        "assets": []
    },
    {
        "slug": "clustering-agrupamientos",
        "title": "Clustering - Análisis de Agrupamientos",
        "description": "Implementación de algoritmos de clustering para segmentación de datos",
        "long_description": "Proyecto completo de clustering y segmentación de datos. Incluye implementación de K-Means y otros algoritmos de clustering, análisis de segmentación, determinación del número óptimo de clusters y validación rigurosa de resultados.",
        "category": "Machine Learning",
        "status": "completed",
        "featured": False,
        "highlights": ["K-Means", "Algoritmos de clustering", "Segmentación de datos", "Validación de clusters"],
        "technologies": ["Python", "Scikit-learn", "Pandas"],
        "assets": []
    },
    {
        "slug": "etl-procesamiento-datos",
        "title": "ETL - Procesamiento Integral de Datos",
        "description": "Extracción, transformación y carga completa de datos de múltiples fuentes",
        "long_description": "Proyecto integral de procesamiento ETL. Incluye extracción de múltiples fuentes de datos, transformación y limpieza rigurosa, carga en sistemas de análisis y desarrollo de pipelines de datos automatizados y robustos.",
        "category": "Data Engineering",
        "status": "completed",
        "featured": True,
        "highlights": ["Extracción de múltiples fuentes", "Transformación y limpieza", "Carga en sistemas", "Pipelines automatizados"],
        "technologies": ["Python", "Pandas", "SQL", "n8n"],
        "assets": []
    },
    {
        "slug": "analisis-datos-r",
        "title": "Análisis Computacional de Datos en R",
        "description": "Análisis estadístico avanzado y modelado computacional con R",
        "long_description": "Proyecto de análisis avanzado usando R. Incluye análisis estadístico avanzado, modelado computacional, visualización avanzada de datos y generación de reportes estadísticos complejos.",
        "category": "Data Analysis",
        "status": "completed",
        "featured": False,
        "highlights": ["Análisis estadístico", "Modelado computacional", "Visualización avanzada", "Reportes estadísticos"],
        "technologies": ["R", "ggplot2", "dplyr"],
        "assets": []
    },
    {
        "slug": "analisis-poblacional",
        "title": "Análisis Poblacional",
        "description": "Análisis de datos demográficos y distribuciones poblacionales",
        "long_description": "Proyecto de análisis demográfico completo. Incluye análisis de datos demográficos, visualizaciones de distribuciones poblacionales, análisis de tendencias poblacionales e interpretación de patrones demográficos.",
        "category": "Data Analysis",
        "status": "completed",
        "featured": False,
        "highlights": ["Datos demográficos", "Distribuciones poblacionales", "Tendencias poblacionales", "Patrones demográficos"],
        "technologies": ["Python", "Pandas", "Matplotlib"],
        "assets": []
    },
    {
        "slug": "pandas-profiling",
        "title": "Pandas Profiling - Perfilado Automático de Datos",
        "description": "Generación automática de reportes EDA y análisis de calidad de datos",
        "long_description": "Implementación de Pandas Profiling para análisis automático de datos. Incluye generación automática de reportes EDA completos, análisis de calidad de datos, detección de valores faltantes e identificación de outliers y anomalías.",
        "category": "Data Analysis",
        "status": "completed",
        "featured": False,
        "highlights": ["Reportes EDA automáticos", "Análisis de calidad", "Detección de faltantes", "Identificación de anomalías"],
        "technologies": ["Python", "Pandas Profiling", "Pandas"],
        "assets": []
    },
    {
        "slug": "bigquery-limpieza",
        "title": "Clean for Google BigQuery",
        "description": "Limpieza y preparación de datos para BigQuery",
        "long_description": "Proyecto de preparación de datos para BigQuery. Incluye limpieza rigurosa de datos, optimización de esquemas, particionamiento inteligente de datos y mejora de rendimiento de queries.",
        "category": "Data Engineering",
        "status": "completed",
        "featured": False,
        "highlights": ["Limpieza de datos", "Optimización de esquemas", "Particionamiento", "Mejora de rendimiento"],
        "technologies": ["Python", "BigQuery", "SQL"],
        "assets": []
    },
    {
        "slug": "google-analytics-analisis",
        "title": "Análisis de Datos de Google Analytics",
        "description": "Extracción y análisis de datos de Google Analytics",
        "long_description": "Proyecto de análisis de Google Analytics. Incluye extracción de datos de Google Analytics, análisis de tráfico web, segmentación de usuarios y análisis profundo de comportamiento del usuario.",
        "category": "Data Analysis",
        "status": "completed",
        "featured": False,
        "highlights": ["Extracción de GA", "Análisis de tráfico", "Segmentación de usuarios", "Comportamiento del usuario"],
        "technologies": ["Python", "Google Analytics API", "Pandas"],
        "assets": []
    },
    {
        "slug": "sano-y-fresco-dashboard",
        "title": "Proyecto Sano y Fresco - Dashboard Integral",
        "description": "Dashboard completo de ventas, productos y análisis comercial",
        "long_description": "Dashboard integral para empresa de alimentos frescos. Incluye dashboard de ventas y productos, análisis de clientes y comportamiento de compra, métricas de desempeño comercial, KPI's interactivos y análisis de tendencias de venta con segmentación de productos.",
        "category": "Business Intelligence",
        "status": "completed",
        "featured": True,
        "highlights": ["Dashboard de ventas", "Análisis de clientes", "Comportamiento de compra", "KPI's comerciales", "Segmentación de productos"],
        "technologies": ["Python", "Power BI", "SQL"],
        "assets": []
    },
    {
        "slug": "dashboard-ventas-interactivo",
        "title": "Dashboard Interactivo de Ventas",
        "description": "Visualización de datos comerciales con KPI's en tiempo real",
        "long_description": "Dashboard interactivo de análisis comercial. Incluye visualización de datos comerciales en tiempo real, KPI's interactivos y actualizados, análisis de tendencias por período y análisis de rentabilidad por producto.",
        "category": "Business Intelligence",
        "status": "completed",
        "featured": False,
        "highlights": ["Datos en tiempo real", "KPI's interactivos", "Tendencias por período", "Rentabilidad por producto"],
        "technologies": ["Python", "Tableau", "SQL"],
        "assets": []
    },
    {
        "slug": "nba-analisis-deportivo",
        "title": "NBA Analysis - Análisis de Datos Deportivos",
        "description": "Análisis estadístico de jugadores y rendimiento deportivo",
        "long_description": "Análisis estadístico completo de datos deportivos de NBA. Incluye análisis de estadísticas de jugadores, visualización de rendimiento deportivo, análisis comparativo de equipos y predicción de resultados.",
        "category": "Data Analysis",
        "status": "completed",
        "featured": False,
        "highlights": ["Estadísticas de jugadores", "Rendimiento deportivo", "Análisis comparativo", "Predicción de resultados"],
        "technologies": ["Python", "Pandas", "Matplotlib"],
        "assets": []
    },
    {
        "slug": "warriors-games-analisis",
        "title": "Warriors Games - Análisis de Videojuegos",
        "description": "Análisis de datos y estadísticas de videojuegos",
        "long_description": "Análisis de datos de videojuegos Warriors. Incluye análisis de datos de juegos, estadísticas de jugadores y análisis de mecánicas de juego.",
        "category": "Data Analysis",
        "status": "completed",
        "featured": False,
        "highlights": ["Datos de juegos", "Estadísticas de jugadores", "Mecánicas de juego", "Análisis de rendimiento"],
        "technologies": ["Python", "Pandas", "Matplotlib"],
        "assets": []
    },
    {
        "slug": "banks-project-analisis",
        "title": "Banks Project - Análisis Bancario",
        "description": "Análisis de datos financieros y riesgo crediticio",
        "long_description": "Proyecto de análisis bancario y financiero. Incluye análisis de datos financieros, modelos de riesgo crediticio y análisis de cartera de clientes.",
        "category": "Business Intelligence",
        "status": "completed",
        "featured": False,
        "highlights": ["Datos financieros", "Riesgo crediticio", "Cartera de clientes", "Análisis de riesgos"],
        "technologies": ["Python", "Pandas", "Scikit-learn"],
        "assets": []
    },
    {
        "slug": "conversion-temperatura",
        "title": "Conversión de Temperatura - Celsius a Fahrenheit",
        "description": "Herramienta de procesamiento y conversión de unidades de temperatura",
        "long_description": "Utilidad de procesamiento de temperaturas. Incluye procesamiento de conversiones precisas, automatización de transformaciones y pipelines de conversión de unidades.",
        "category": "Utilities",
        "status": "completed",
        "featured": False,
        "highlights": ["Conversión precisa", "Automatización", "Pipelines de conversión", "Manejo de unidades"],
        "technologies": ["Python"],
        "assets": []
    },
    {
        "slug": "programacion-orientada-objetos",
        "title": "Análisis Orientado a Objetos en Python",
        "description": "Conceptos fundamentales y aplicaciones de POO",
        "long_description": "Proyecto educativo de programación orientada a objetos. Incluye conceptos fundamentales de POO, diseño de aplicaciones escalables y patrones de diseño profesionales.",
        "category": "Programming",
        "status": "completed",
        "featured": False,
        "highlights": ["Conceptos de POO", "Diseño de aplicaciones", "Patrones de diseño", "Aplicaciones escalables"],
        "technologies": ["Python"],
        "assets": []
    },
]

TECHNOLOGIES_DATA = [
    {"name": "Python", "slug": "python", "category": "Language"},
    {"name": "Scikit-learn", "slug": "scikit-learn", "category": "ML Framework"},
    {"name": "Pandas", "slug": "pandas", "category": "Data Processing"},
    {"name": "NumPy", "slug": "numpy", "category": "Data Processing"},
    {"name": "Matplotlib", "slug": "matplotlib", "category": "Visualization"},
    {"name": "Graphviz", "slug": "graphviz", "category": "Visualization"},
    {"name": "Statsmodels", "slug": "statsmodels", "category": "Statistics"},
    {"name": "ARIMA", "slug": "arima", "category": "Statistics"},
    {"name": "TensorFlow", "slug": "tensorflow", "category": "ML Framework"},
    {"name": "Keras", "slug": "keras", "category": "ML Framework"},
    {"name": "OpenCV", "slug": "opencv", "category": "Computer Vision"},
    {"name": "PIL", "slug": "pil", "category": "Image Processing"},
    {"name": "SQL", "slug": "sql", "category": "Database"},
    {"name": "n8n", "slug": "n8n", "category": "Automation"},
    {"name": "R", "slug": "r", "category": "Language"},
    {"name": "ggplot2", "slug": "ggplot2", "category": "Visualization"},
    {"name": "dplyr", "slug": "dplyr", "category": "Data Processing"},
    {"name": "Pandas Profiling", "slug": "pandas-profiling", "category": "Data Processing"},
    {"name": "BigQuery", "slug": "bigquery", "category": "Database"},
    {"name": "Google Analytics API", "slug": "google-analytics-api", "category": "API"},
    {"name": "Power BI", "slug": "power-bi", "category": "BI"},
    {"name": "Tableau", "slug": "tableau", "category": "BI"},
]

EXPERIENCE_DATA = [
    {
        "company": "Grupo Gestión",
        "role": "Analista de Datos",
        "start_date": "2024-02-01",
        "end_date": None,
        "description": "Lideré la implementación de soluciones de inteligencia de negocios y análisis de datos para el sector público.",
        "achievements": [
            "Diseñé e implementé dashboards interactivos en Power BI automatizando reportes gerenciales",
            "Desarrollé pipelines ETL para integración de datos entre sistemas legados y nuevas plataformas",
            "Optimicé procesos mediante automatización con Python reduciendo tiempos de procesamiento manual",
        ],
        "location": "Buenos Aires, Argentina",
        "type": "professional",
    },
    {
        "company": "NCR",
        "role": "Técnico en Sistemas",
        "start_date": "2023-06-01",
        "end_date": "2024-02-01",
        "description": "Mantenimiento y soporte de sistemas POS y redes bancarias.",
        "achievements": [
            "Coordiné equipo técnico multisite para mantenimiento de equipos bancarios",
            "Implementé mejoras en procesos de soporte reduciendo tiempos de resolución",
        ],
        "location": "Buenos Aires, Argentina",
        "type": "professional",
    },
    {
        "company": "Municipalidad de Avellaneda",
        "role": "Analista de Sistemas",
        "start_date": "2021-01-01",
        "end_date": "2023-05-01",
        "description": "Gestión y análisis de sistemas informáticos municipales.",
        "achievements": [
            "Desarrollé un sistema de gestión de incidencias mejorando el seguimiento de solicitudes",
            "Implementé mejoras en la seguridad de la red municipal",
        ],
        "location": "Avellaneda, Argentina",
        "type": "professional",
    },
]

EDUCATION_DATA = [
    {
        "institution": "Universidad Nacional de Tres de Febrero",
        "degree": "Tecnicatura en Programación Informática",
        "start_date": "2023-01-01",
        "end_date": None,
        "period": "2023 - Presente",
    },
    {
        "institution": "Instituto Superior Mariano Moreno",
        "degree": "Técnico Superior en Análisis de Sistemas",
        "start_date": "2019-01-01",
        "end_date": "2022-12-31",
        "period": "2019 - 2022",
    },
]

CERTIFICATION_DATA = [
    {
        "title": "Google Data Analytics Professional Certificate",
        "issuer": "Google",
        "issue_date": "2024-06-01",
        "period": "Jun 2024",
        "certificate_url": "https://coursera.org/verify/professional-cert/GOOGLEDATA",
    },
    {
        "title": "TensorFlow Developer Certificate",
        "issuer": "TensorFlow",
        "issue_date": "2024-03-01",
        "period": "Mar 2024",
        "certificate_url": "https://tensorflow.org/verify",
    },
    {
        "title": "AWS Cloud Practitioner",
        "issuer": "Amazon Web Services",
        "issue_date": "2024-01-01",
        "period": "Ene 2024",
        "certificate_url": "https://aws.amazon.com/verify",
    },
]


class Command(BaseCommand):
    help = 'Seed the database with initial portfolio data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding technologies...')
        tech_objects = {}
        for data in TECHNOLOGIES_DATA:
            tech, created = Technology.objects.get_or_create(
                slug=data['slug'],
                defaults=data,
            )
            tech_objects[tech.name] = tech
            if created:
                self.stdout.write(f'  Created technology: {tech.name}')

        self.stdout.write('Seeding projects...')
        for data in PROJECTS_DATA:
            tech_names = data.pop('technologies', [])
            project, created = Project.objects.get_or_create(
                slug=data['slug'],
                defaults=data,
            )
            if created:
                for name in tech_names:
                    if name in tech_objects:
                        project.technologies.add(tech_objects[name])
                self.stdout.write(f'  Created project: {project.title}')

        self.stdout.write('Seeding experience...')
        for data in EXPERIENCE_DATA:
            _, created = Experience.objects.get_or_create(
                company=data['company'],
                role=data['role'],
                start_date=data['start_date'],
                defaults=data,
            )
            if created:
                self.stdout.write(f'  Created experience: {data["role"]} at {data["company"]}')

        self.stdout.write('Seeding education...')
        for data in EDUCATION_DATA:
            _, created = Education.objects.get_or_create(
                institution=data['institution'],
                degree=data['degree'],
                defaults=data,
            )
            if created:
                self.stdout.write(f'  Created education: {data["degree"]}')

        self.stdout.write('Seeding certifications...')
        for data in CERTIFICATION_DATA:
            _, created = Certification.objects.get_or_create(
                title=data['title'],
                defaults=data,
            )
            if created:
                self.stdout.write(f'  Created certification: {data["title"]}')

        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))
