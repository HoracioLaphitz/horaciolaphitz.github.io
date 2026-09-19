---
title: "Proceso ETL"
description: "Ejercicio de ingeniería de datos centrado en extraer, transformar y cargar información."
pubDate: "2024-03-19T22:51:29.000Z"
author: "Horacio Laphitz"
category: "Análisis de datos"
tags: ["etl","python"]
github: "https://github.com/HoracioLaphitz/ETL"
maturity: "Portfolio project"
---

<!-- generated-by: github-auto-sync-platform; slug: github-etl -->

## Situación

El proyecto construye un proceso ETL sobre una tabla histórica de producto interno bruto nominal por país, tomada de una captura archivada de Wikipedia. La meta es transformar la información web en archivos y tablas aptos para consultas reproducibles.

## El desafío

La fuente HTML debe localizarse, limpiarse y convertirse desde millones a miles de millones sin perder la relación entre país y valor. El flujo también necesita persistir la salida y registrar etapas. Al depender de un snapshot, los datos no representan cifras actuales; además, no existen pruebas automatizadas, validación de esquema ni políticas de reintento ante fallos de red.

## La solución

La extracción utiliza `requests` y Beautiful Soup. pandas y NumPy normalizan la tabla y realizan la conversión de unidades. El resultado se exporta a CSV y se carga en SQLite, donde una consulta selecciona países con PIB mayor o igual a 100. El proceso escribe logs para dejar trazabilidad básica.

## Impacto

La ejecución conservada produce un CSV y una base SQLite con 191 países, demostrando el trayecto completo desde una página archivada hasta una consulta estructurada. Esto ofrece un caso concreto para practicar integración de formatos y transformación numérica. No debe interpretarse como un servicio de indicadores vigentes ni como una canalización tolerante a fallos; esas capacidades necesitarían fuentes actualizadas y controles adicionales.
