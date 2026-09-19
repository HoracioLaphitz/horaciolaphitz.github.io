---
title: "Capitalización de los bancos más grandes"
description: "Extracción web y proceso ETL para obtener una tabla, transformar sus datos y dejarlos listos para el análisis."
pubDate: "2024-03-22T21:36:37.000Z"
author: "Horacio Laphitz"
category: "Análisis de datos"
tags: ["etl","python","sqlite","webscrapping"]
github: "https://github.com/HoracioLaphitz/Capitalizacion-del-Mercado-de-los-Bancos-mas-Grandes"
maturity: "Portfolio project"
---

<!-- generated-by: github-auto-sync-platform; slug: github-capitalizacion-del-mercado-de-los-bancos-mas-grandes -->

## Situación

Este trabajo construye una tabla histórica de los diez bancos con mayor capitalización bursátil y expresa sus valores en varias monedas. El caso integra extracción web, transformación tabular y persistencia para mostrar un flujo ETL pequeño con una fuente pública archivada.

## El desafío

La información de origen está expresada en dólares y debe convertirse de forma consistente a libras esterlinas, euros y rupias indias. Además de normalizar la tabla HTML, el proceso necesita conservar resultados consultables y registrar su ejecución. Como trabaja sobre un snapshot, no representa valores actuales; los archivos de tasas, base de datos y log usados durante la ejecución no están versionados.

## La solución

La implementación usa `requests` y Beautiful Soup para extraer la tabla, pandas y NumPy para transformarla, y tasas de cambio para calcular cuatro columnas monetarias. Exporta un CSV y carga la tabla `Largest_banks` en SQLite. El módulo `logging` registra las etapas principales del proceso.

## Impacto

El repositorio entrega una salida estructurada de diez entidades en cuatro monedas y demuestra el recorrido completo desde HTML hasta CSV y SQL. Permite practicar consultas y verificar transformaciones sobre un corte histórico concreto. No se presenta como servicio de actualización financiera ni como fuente de cotizaciones vigentes, y no publica mediciones de calidad o disponibilidad operacional.
