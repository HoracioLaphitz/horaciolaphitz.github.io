---
title: "Visualizando lo incierto"
description: "Plataforma experimental sobre semiótica y cognición de la probabilidad mediante fórmulas y diagramas."
pubDate: "2026-07-06T13:56:03.000Z"
author: "Horacio Laphitz"
category: "Análisis de datos"
tags: []
github: "https://github.com/HoracioLaphitz/visualizando-lo-incierto"
maturity: "Portfolio project"
---

<!-- generated-by: github-auto-sync-platform; slug: github-visualizando-lo-incierto -->

## Situación

El proyecto diseña un experimento para comparar comprensión de probabilidades expresadas mediante fórmulas y mediante diagramas. Presenta diez preguntas, registra precisión y latencia, y separa una demostración abierta del recorrido experimental para no mezclar práctica con observaciones analizables.

## El desafío

Una comparación pareada debe contrabalancear el orden, anonimizar participantes y aplicar exactamente los mismos cálculos a cada condición. La interpretación automática no puede reemplazar la estadística determinista. Aunque el pipeline se probó con 600 filas sintéticas que representan 30 participantes, esos registros no son resultados humanos ni evidencian una ventaja real de una visualización.

## La solución

La aplicación usa Streamlit, Matplotlib, pandas, NumPy y SciPy, con Supabase para persistencia. Incluye 20 imágenes PNG, exportación de datos y una prueba t pareada. Agentes de Anthropic redactan interpretaciones por separado, mientras los cálculos permanecen en funciones deterministas y auditables.

## Impacto

La validación sintética comprueba que captura, contrabalanceo, exportación y análisis recorren el pipeline completo sin presentar las simulaciones como evidencia empírica. El resultado es una plataforma preparada para recolectar datos reales con una metodología explícita. Cualquier conclusión sobre desempeño humano debe esperar una muestra auténtica, consentimiento adecuado y revisión de supuestos estadísticos.
