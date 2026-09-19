---
title: "Análisis exploratorio — IBM HR Analytics"
description: "Análisis exploratorio del conjunto de datos IBM HR Analytics Employee Attrition."
pubDate: "2025-01-09T15:33:48.000Z"
author: "Horacio Laphitz"
category: "Análisis de datos"
tags: []
github: "https://github.com/HoracioLaphitz/EDA_IBM"
maturity: "Portfolio project"
---

<!-- generated-by: github-auto-sync-platform; slug: github-eda-ibm -->

## Situación

El notebook explora el conjunto IBM HR Analytics para describir composición de la plantilla y patrones asociados con attrition. Examina 1.470 registros y variables como edad, ingreso, antigüedad, satisfacción, equilibrio entre trabajo y vida, promociones y distancia al empleo.

## El desafío

Los datos de recursos humanos combinan escalas y categorías que pueden inducir conclusiones apresuradas. El análisis debe distinguir asociaciones descriptivas de explicaciones causales y revisar primero calidad y distribución. El notebook informa ausencia de valores nulos y una edad media cercana a 37 años, pero no incluye el dataset, pruebas estadísticas ni una evaluación externa que permita reproducir íntegramente los hallazgos.

## La solución

La implementación usa pandas para inspección, agregación y transformación, y Seaborn junto con Matplotlib para comparar distribuciones y relaciones entre variables. Las visualizaciones organizan preguntas sobre permanencia, remuneración, satisfacción y condiciones laborales sin introducir un modelo predictivo.

## Impacto

El resultado es una lectura exploratoria estructurada que convierte una tabla de personal en preguntas y gráficos revisables. Puede orientar hipótesis para un análisis posterior, pero no prueba causas de abandono ni demuestra mejoras de retención. Su alcance es deliberadamente descriptivo: documenta tendencias del conjunto analizado y deja pendiente incorporar la fuente, contrastes estadísticos y validación antes de recomendar políticas de recursos humanos.
