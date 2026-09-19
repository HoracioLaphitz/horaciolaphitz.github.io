---
title: "Extracción, transformación y carga"
description: "Script en Python que automatiza la carga, transformación y extracción de archivos XML, CSV y JSON para su análisis o uso en modelos."
pubDate: "2024-03-18T21:33:08.000Z"
author: "Horacio Laphitz"
category: "Análisis de datos"
tags: ["etl","jupyter-notebook","python"]
github: "https://github.com/HoracioLaphitz/Extraer-Transformar-Cargar"
maturity: "Portfolio project"
---

<!-- generated-by: github-auto-sync-platform; slug: github-extraer-transformar-cargar -->

## Situación

Este ejercicio integra datos equivalentes distribuidos en archivos CSV, JSONL y XML. El objetivo es producir una tabla unificada con nombre, altura y peso, y dejar registro de cada etapa del proceso de extracción, transformación y carga.

## El desafío

Cada formato requiere una estrategia de lectura diferente antes de poder concatenar los registros. Las medidas también llegan en pulgadas y libras, por lo que deben convertirse de manera consistente a metros y kilogramos. El esquema está fijado en el código y las fuentes originales no están incluidas; tampoco hay pruebas o validaciones que cubran archivos dañados, campos ausentes o unidades inesperadas.

## La solución

La implementación usa `glob` para descubrir archivos, pandas para manejar CSV y JSONL, y `ElementTree` para recorrer XML. Las funciones de transformación convierten altura y peso al sistema métrico, y el conjunto consolidado se escribe en un CSV. Un log registra el avance de la ejecución almacenada.

## Impacto

El repositorio demuestra cómo normalizar tres representaciones distintas en una única salida tabular y conserva evidencia de una corrida completa. El diseño por etapas facilita seguir el linaje desde cada entrada hasta el archivo final. Su alcance es educativo: no acredita calidad para esquemas variables ni operación continua, aspectos que exigirían contratos de datos, pruebas y manejo explícito de errores.
