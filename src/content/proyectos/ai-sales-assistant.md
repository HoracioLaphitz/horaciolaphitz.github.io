---
title: "Análisis de comercio electrónico — ETL, aplicación y predicción de abandono"
description: "Aplicación de análisis de comercio electrónico con un proceso ETL hacia un esquema estrella, seis secciones en Streamlit y un modelo XGBoost para estudiar el abandono de vendedores."
pubDate: 2026-06-30
category: "Data Science"
tags: ["Python", "Streamlit", "XGBoost", "SQL", "ETL", "Churn Prediction", "Testing"]
github: "https://github.com/HoracioLaphitz/Data-Analysis-Ecommerce"
dashboard: "https://data-analysis-ecommerce-horaciolaphitz.streamlit.app/"
featured: true
showcase:
  context: "Datos públicos de comercio electrónico distribuidos en tablas relacionales que requerían preparación para responder preguntas de negocio."
  contribution: "Elegí un esquema estrella, separé el ETL del análisis e incorporé controles de calidad antes de sumar la predicción de abandono."
  result: "Aplicación desplegada con seis secciones, un modelo con AUC-ROC de 0,99 y pruebas automatizadas para cada capa."
  limit: "Proyecto de portfolio con datos públicos; el resultado del modelo no acredita impacto en una operación real."
  evidenceAction: "Ver la aplicación y el código en GitHub"
draft: false
---

## El problema

El conjunto de datos Brazilian E-Commerce de Olist contiene más de 100.000 órdenes repartidas en tablas relacionales sin procesar. Dos preguntas de negocio guían el proyecto: ¿qué ocurre con las ventas, la logística y los clientes? ¿Qué vendedores podrían abandonar la plataforma?

## La solución

**Aplicación en línea:** [data-analysis-ecommerce-horaciolaphitz.streamlit.app](https://data-analysis-ecommerce-horaciolaphitz.streamlit.app/)

### 1. ETL a un data mart en estrella

Proceso en Python y SQL (`src/etl.py` y la capa `sql/`, con scripts de limpieza, data mart, vistas y controles de calidad) que transforma los CSV sin procesar en una base **SQLite con esquema estrella**. La aplicación consulta el data mart, no los CSV.

### 2. Aplicación de análisis en Streamlit — seis secciones

- **Analysis** — indicadores generales: ingresos, órdenes, valor promedio del pedido, distancia y demoras, con tendencias mensuales.
- **Logística** — distribución de las demoras, tasa de entregas tardías por estado y relación entre distancia y demora.
- **Reviews** — puntuaciones de las reseñas y su relación con la demora de entrega.
- **Churn Sellers** — métricas del modelo, importancia de variables y clasificación de vendedores en riesgo, con recomendaciones.
- **Ventas** — ticket promedio mensual y peso del flete por categoría.
- **Segmentación** — RFM, cohortes de retención mensual e indicadores de ingresos en riesgo.

### 3. Modelo de abandono de vendedores

Flujo completo de aprendizaje automático (`src/churn/`): etiquetado, ingeniería de variables, entrenamiento, predicción, recomendaciones y seguimiento de deriva. Sobre **2.433 vendedores**, con una tasa de abandono del 48 %:

| Modelo | AUC-ROC | Precision | Recall | F1 |
|---|---|---|---|---|
| Regresión logística (referencia) | 0,90 | 0,88 | 0,74 | 0,80 |
| **XGBoost** | **0,99** | **0,95** | **0,94** | **0,95** |

El modelo de referencia permite medir si la complejidad adicional de XGBoost aporta una mejora.

## Calidad

Dieciséis archivos de prueba con **pytest** cubren cada capa: ETL, análisis, gráficos, segmentación y el flujo de abandono —etiquetado, variables, entrenamiento y deriva—, con datos de prueba que reproducen el esquema de Olist.

## Resultado

Una plataforma de análisis desplegada: transforma archivos CSV en información útil, identifica vendedores que podrían abandonar la plataforma y cuenta con pruebas para modificar cada capa sin afectar las demás.
