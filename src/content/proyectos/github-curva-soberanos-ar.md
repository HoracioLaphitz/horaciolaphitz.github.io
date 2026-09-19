---
title: "Curva de bonos soberanos argentinos"
description: "Proyecto en desarrollo para analizar la curva de bonos soberanos argentinos."
pubDate: "2026-07-19T02:27:51.000Z"
author: "Horacio Laphitz"
category: "Análisis de datos"
tags: []
github: "https://github.com/HoracioLaphitz/curva-soberanos-ar"
maturity: "In development"
status: "Nuevo - en proceso"
---

<!-- generated-by: github-auto-sync-platform; slug: github-curva-soberanos-ar -->

## Situación

El repositorio define el diseño de una herramienta para analizar curvas de bonos soberanos argentinos en dólares y ajustados por CER. La especificación contempla métricas de renta fija, comparación con referencias externas y controles de frescura para datos provenientes de fuentes oficiales.

## El desafío

La propuesta debe separar matemáticas financieras, adquisición de datos y presentación para evitar que cambios en una fuente alteren silenciosamente los cálculos. También prevé calcular rendimiento a vencimiento, duración, spread contra bonos del Tesoro estadounidense y breakeven frente al REM. En su estado público actual contiene diseño y especificaciones, pero no una implementación ejecutable ni resultados verificables.

## La solución

La arquitectura planeada usa Python 3.12 y Streamlit con un núcleo matemático aislado mediante principios hexagonales. Pydantic y dataclasses modelarían contratos y entidades; adaptadores específicos integrarían BCRA, Data 912 y Tesoro. El plan incluye pruebas golden para fórmulas, validación de entradas y metadatos sobre fecha y procedencia.

## Impacto

El aporte disponible es una definición técnica auditable de alcance, dependencias y límites antes de escribir el producto. Esa documentación reduce ambigüedad para una implementación posterior y fija requisitos de trazabilidad. No corresponde afirmar que las curvas, indicadores o integraciones ya funcionan: faltan código operativo, ejecuciones reproducibles y evidencia de aceptación con datos reales.
