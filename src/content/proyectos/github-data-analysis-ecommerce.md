---
title: "Análisis de comercio electrónico"
description: "Consulta en lenguaje natural sobre más de 100.000 órdenes de Olist mediante LangChain, Groq y Streamlit."
pubDate: "2026-06-30T20:19:19.000Z"
author: "Horacio Laphitz"
category: "Análisis de datos"
tags: []
github: "https://github.com/HoracioLaphitz/Data-Analysis-Ecommerce"
maturity: "Portfolio project"
---

<!-- generated-by: github-auto-sync-platform; slug: github-data-analysis-ecommerce -->

## Situación

La rama `analytics-v2` analiza el conjunto Olist desde seis áreas de negocio y estudia la inactividad de vendedores. El trabajo reúne pedidos, clientes, productos y sellers en una aplicación Streamlit orientada a exploración operativa y seguimiento de churn.

## El desafío

Las tablas transaccionales necesitan controles de calidad y un modelo común antes de calcular cohortes, RFM o señales de abandono. Para churn, el reto adicional es construir ventanas temporales y vigilar cambios de distribución. Las métricas publicadas se obtuvieron sobre el mismo conjunto de entrenamiento, sin holdout independiente, por lo que no demuestran generalización.

## La solución

El pipeline ETL carga un esquema estrella en SQLite y registra 96.478 pedidos entregados. La aplicación usa Plotly para las vistas analíticas e incorpora cohortes, segmentación RFM, reglas y un horizonte de 90 días. Compara regresión logística y XGBoost, e incluye PSI para monitoreo. Analiza 2.433 sellers; no contiene actualmente el chat con LangChain o Groq mencionado en materiales anteriores.

## Impacto

El modelo registra AUC 0,9898, recall 0,9410 y F1 0,9471 sobre entrenamiento. Estas cifras sirven como referencia interna, no como validación independiente. El proyecto integra calidad, almacenamiento y análisis en una ruta reproducible y deja explícitos los pasos necesarios antes de convertir el score en una decisión operativa o atribuir reducción real de churn.
