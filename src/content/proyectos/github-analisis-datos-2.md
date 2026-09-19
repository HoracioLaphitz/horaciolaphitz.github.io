---
title: "Automatización del análisis de datos"
description: "Script en Python que automatiza un análisis general al indicar el archivo de datos que se desea procesar."
pubDate: "2024-02-13T18:46:16.000Z"
author: "Horacio Laphitz"
category: "Análisis de datos"
tags: ["analisis-de-datos","python"]
github: "https://github.com/HoracioLaphitz/Analisis-Datos-2"
maturity: "Portfolio project"
---

<!-- generated-by: github-auto-sync-platform; slug: github-analisis-datos-2 -->

## Situación

Este repositorio plantea una plantilla reutilizable para explorar archivos CSV sin repetir manualmente el mismo conjunto de operaciones en cada análisis. El objetivo es recibir un archivo parametrizable, revisar su estructura y producir una primera lectura visual y estadística con Python.

## El desafío

Un flujo genérico debe trabajar con tablas cuya forma y columnas cambian, pero este proyecto conserva nombres de columnas de ejemplo como marcadores. Tampoco incluye un conjunto de datos, pruebas automatizadas ni métricas de ejecución que permitan comprobar el comportamiento ante esquemas, tipos o volúmenes diferentes.

## La solución

El notebook combina Jupyter, pandas y NumPy para cargar y depurar los datos, incluyendo eliminación de duplicados y tratamiento de valores nulos. Seaborn y Matplotlib cubren la exploración gráfica, mientras `pandas_profiling` genera un informe automático para ampliar el diagnóstico inicial.

## Impacto

La propuesta concentra en un flujo parametrizable tareas frecuentes de un EDA y deja una base adaptable para nuevos CSV. Su valor demostrado es metodológico: reduce repetición en la preparación y visualización inicial. No se atribuyen ahorros de tiempo, cobertura universal ni resultados sobre datos reales porque el repositorio no aporta mediciones ni un caso reproducible completo.
