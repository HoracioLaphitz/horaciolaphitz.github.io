---
title: "SanoYFresco — Market Basket Analysis en Retail"
description: "4.9M+ transacciones de un retailer orgánico y cero insights accionables. Apliqué Market Basket Analysis con Apriori para descubrir qué productos se compran juntos y convertirlo en decisiones de layout y cross-selling, con un potencial de +15-20% en ticket promedio."
pubDate: 2025-07-29
category: "Análisis de datos"
tags: ["Python", "SQL", "Market Basket Analysis", "Apriori", "Power BI", "Pandas", "mlxtend"]
github: "https://github.com/HoracioLaphitz/MarketBasketAnalytics"
featured: true
draft: false
resources:
  notebooks:
    - name: "Market Basket Analysis"
      path: "/Proyectos/Proyecto SanoYFresco/Notebooks/TPE_MarketBasketAnalysis_colab.ipynb"
---

## Situación

SanoYFresco es un retailer de productos orgánicos con un volumen enorme de operación: **4.975.718 transacciones** durante todo 2023, **206.209 clientes únicos** y **49.688 productos**. Toda esa data existía, pero no se estaba usando para decidir nada.

## El desafío

Dos problemas concretos de negocio:

1. La ubicación de productos complementarios en tienda era poco efectiva.
2. Había oportunidades de venta cruzada (*cross-selling*) que nadie había identificado.

La pregunta de fondo: **¿qué productos se compran juntos y cómo lo aprovechamos para subir el ticket promedio?**

## La solución

Un pipeline de análisis de canasta de mercado end-to-end:

- **Extracción y preparación** — carga de una base SQLite con 5M+ registros, limpieza y estructuración transaccional con Pandas.
- **Market Basket Analysis** — algoritmo **Apriori** (mlxtend) para minar reglas de asociación, midiendo soporte, confianza y *lift*. Filtré por confianza > 60% y lift > 1.5.
- **Análisis de patrones** — productos ancla, asociaciones fuertes entre categorías y segmentación temporal por hora del día.

## Impacto

- **50+ reglas de asociación** accionables (ej: bananas orgánicas → aguacates, lift 2.3x; panadería → lácteos orgánicos, lift 1.8x).
- Potencial de **+15-20% en ticket promedio** mediante *bundling* estratégico.
- Layout optimizado y dos dashboards en Power BI (ventas y marketing) para bajar los insights a decisiones diarias.
