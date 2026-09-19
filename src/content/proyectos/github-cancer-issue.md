---
title: "Supervivencia de pacientes con cáncer"
description: "Análisis en desarrollo sobre factores asociados con la supervivencia de pacientes con cáncer."
pubDate: "2025-01-17T21:29:09.000Z"
author: "Horacio Laphitz"
category: "Análisis de datos"
tags: []
github: "https://github.com/HoracioLaphitz/cancer_issue"
maturity: "Portfolio project"
---

<!-- generated-by: github-auto-sync-platform; slug: github-cancer-issue -->

## Situación

El proyecto explora perfiles clínicos de pacientes con distintos tipos de cáncer para identificar agrupaciones internas en una tabla de 17.686 registros y 16 variables. El enfoque es descriptivo: busca caracterizar segmentos, no predecir supervivencia individual ni establecer relaciones causales.

## El desafío

Los datos combinan variables numéricas y categóricas, valores ausentes, observaciones atípicas y diagnósticos multitumor. Preparar esa mezcla para clustering requiere controlar escalas y codificación, y luego comparar particiones con criterios cuantitativos. El repositorio no publica métricas finales consolidadas y mantiene fijo el número de grupos de K-Means; además, el README presenta una descripción del dataset que no coincide por completo con el archivo analizado.

## La solución

La solución modulariza preprocesamiento, imputación, `RobustScaler`, one-hot encoding y tratamiento de outliers. Reduce dimensionalidad mediante PCA conservando el 95 % de la varianza y contrasta K-Means, clustering jerárquico y mezclas gaussianas con silhouette, Calinski-Harabasz y Davies-Bouldin. Incluye perfiles de grupos, interfaz Streamlit y pruebas automatizadas.

## Impacto

El resultado es una base reproducible para inspeccionar heterogeneidad clínica y comparar métodos de agrupamiento sobre el mismo procesamiento. Entrega perfiles exploratorios y controles técnicos, pero no demuestra mejoras asistenciales, pronóstico de supervivencia ni validación clínica externa. La separación entre análisis, interfaz y pruebas facilita revisar el método y extenderlo con criterios de selección mejor justificados.
