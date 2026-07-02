---
title: "Data Analysis Ecommerce — Pipeline de Datos + Agente LLM"
description: "Pipeline de datos sobre 100k+ órdenes de e-commerce (Olist Brazil) con capa de análisis, tests automatizados y una interfaz conversacional para consultar los datos."
pubDate: 2026-06-30
category: "Data Science"
tags: ["Python", "Pandas", "Data Engineering", "Testing", "LangChain", "LLM"]
github: "https://github.com/HoracioLaphitz/Data-Analysis-Ecommerce"
featured: true
draft: false
---

## Situación

El dataset Brazilian E-Commerce de Olist (100k+ órdenes, 5 tablas relacionadas) necesita un pipeline confiable antes de que cualquier análisis o modelo tenga sentido: merge de tablas, filtrado de estados válidos y tipado correcto de fechas y montos.

## Arquitectura

Separación por responsabilidad, cada módulo con una interfaz clara:

- **`loader.py`** — carga los 5 CSVs, mergea por `order_id`/`product_id`/`customer_id`, filtra únicamente órdenes `delivered`, devuelve un DataFrame con schema fijo.
- **`analysis.py`** — calcula KPIs (revenue total, AOV, top categorías, revenue por estado) sobre el DataFrame ya limpio.
- **`charts.py`** — funciones puras que devuelven figuras Plotly, sin lógica de negocio.
- **`agent.py`** — capa de consulta en lenguaje natural sobre el DataFrame vía LangChain, aislada del resto del pipeline.

Cada módulo tiene su propio archivo de test (`test_loader.py`, `test_analysis.py`, `test_charts.py`, `test_agent.py`), con mocks del LLM para no depender de la API externa en CI.

## Decisiones técnicas

- El valor del proyecto está en el pipeline de datos y en que cada capa se puede probar de forma aislada; el agente LLM es solo la capa de consulta.
- `agent.py` no conoce el origen de los datos (`loader.py`); solo recibe un DataFrame con un schema acordado — esto permite cambiar la fuente de datos sin tocar la capa de consulta.

## Resultado

Pipeline reproducible con cobertura de tests en las 4 capas y separación de responsabilidades que permite extender (nuevas fuentes de datos, nuevos proveedores de LLM) sin reescribir el resto del sistema.
