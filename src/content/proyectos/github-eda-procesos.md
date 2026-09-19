---
title: "Automatización del análisis exploratorio"
description: "Script en Python que automatiza tareas del análisis exploratorio de datos."
pubDate: "2024-02-13T00:56:13.000Z"
author: "Horacio Laphitz"
category: "Análisis de datos"
tags: []
github: "https://github.com/HoracioLaphitz/EDA-Procesos"
maturity: "Portfolio project"
---

<!-- generated-by: github-auto-sync-platform; slug: github-eda-procesos -->

## Situación

Este proyecto busca automatizar el primer diagnóstico de un archivo CSV mediante la generación de un informe HTML. La necesidad es evitar repetir manualmente inspecciones básicas de estructura, distribuciones, valores ausentes y relaciones cada vez que comienza un análisis exploratorio.

## El desafío

Una función genérica debe recibir rutas y tablas diversas sin ocultar problemas de carga o tipos de datos. La versión disponible no incluye un dataset de ejemplo, validaciones de entrada, manejo explícito de errores ni pruebas automatizadas. Tampoco mide ahorro de tiempo, cobertura del perfilado o comportamiento con archivos grandes, de modo que esos beneficios no pueden cuantificarse.

## La solución

La implementación combina pandas con `pandas_profiling`. Una función carga el CSV, construye un `ProfileReport` y escribe `informe_eda.html`, concentrando el proceso en una única llamada. El resultado reúne las estadísticas y visualizaciones que ofrece la biblioteca sin agregar una capa propia de transformación innecesaria.

## Impacto

El repositorio entrega una automatización breve y reutilizable para producir un reporte inicial navegable. Reduce la cantidad de instrucciones necesarias en comparación con ejecutar cada inspección por separado, aunque no demuestra cuánto tiempo ahorra en casos reales. Su valor técnico está en encapsular una herramienta existente con una interfaz simple; para uso operativo todavía requiere validación, mensajes de error y ejemplos reproducibles.
