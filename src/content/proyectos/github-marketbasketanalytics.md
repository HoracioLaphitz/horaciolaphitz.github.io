---
title: "Análisis de canasta de mercado"
description: "Minería de datos para descubrir patrones entre productos que suelen comprarse juntos."
pubDate: "2025-07-29T12:01:49.000Z"
author: "Horacio Laphitz"
category: "Análisis de datos"
tags: []
github: "https://github.com/HoracioLaphitz/MarketBasketAnalytics"
maturity: "Portfolio project"
---

<!-- generated-by: github-auto-sync-platform; slug: github-marketbasketanalytics -->

## Situación

El proyecto analiza transacciones para detectar productos comprados juntos y apoyar hipótesis de venta cruzada, promociones, disposición de tienda e inventario. Convierte registros almacenados en SQLite en canastas y luego en reglas de asociación interpretables.

## El desafío

La construcción de reglas exige preservar la unidad de transacción, generar combinaciones y diferenciar frecuencia de una asociación realmente informativa. Soporte, confianza y lift ofrecen perspectivas distintas y deben leerse en conjunto. La base de datos no está incluida, por lo que la ejecución completa no es reproducible desde el repositorio y tampoco existe evidencia de adopción comercial o impacto en ventas.

## La solución

El notebook usa Python, pandas y `sqlite3` para consultar operaciones y armar canastas. Calcula combinaciones y sus métricas, exporta `reglas.csv` y emplea Seaborn y Matplotlib para examinar resultados. Capturas de SQL, Excel y Power BI documentan otras vistas del mismo análisis.

## Impacto

La salida conservada contiene 399 reglas y registra un lift máximo de 3,6. Esa cifra describe asociación dentro del conjunto procesado, no causalidad ni incremento de ingresos. El trabajo entrega un flujo técnico desde transacciones hasta reglas priorizables y permite revisar criterios de filtrado. Validar utilidad operativa requeriría recuperar la base, reproducir el cálculo y probar las recomendaciones mediante experimentos comerciales controlados.
