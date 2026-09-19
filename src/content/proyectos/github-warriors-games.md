---
title: "Golden State Warriors — Partidos de local y visitante"
description: "Comparación de los partidos que Golden State Warriors disputa como local y como visitante."
pubDate: "2024-02-20T22:12:36.000Z"
author: "Horacio Laphitz"
category: "Análisis de datos"
tags: ["analisis-de-datos","python","warriors"]
github: "https://github.com/HoracioLaphitz/Warriors-Games"
maturity: "Portfolio project"
---

<!-- generated-by: github-auto-sync-platform; slug: github-warriors-games -->

## Situación

El notebook compara partidos de Golden State Warriors contra Toronto Raptors según se hayan disputado como local o visitante. Se concentra en puntos anotados y plus-minus para describir diferencias históricas en ese enfrentamiento específico.

## El desafío

Los registros de la NBA deben filtrarse con precisión: `GSW vs. TOR` identifica localía y `GSW @ TOR` identifica visita. Promedios y rangos resumen la muestra, pero no controlan temporada, planteles, lesiones u otros factores. Por eso, las diferencias observadas no demuestran un efecto causal de jugar en casa ni representan todos los partidos de Golden State.

## La solución

La implementación usa `nba_api` para obtener los game logs, pandas para filtrar y agregar resultados, y Matplotlib para visualizarlos. Separa ambos contextos y calcula estadísticas comparables de puntos y margen, conservando el foco exclusivo en el rival Toronto.

## Impacto

La muestra registra 106,81 puntos de promedio como local y 102,96 como visitante. El plus-minus medio es 3,73 en casa y -0,61 fuera; los puntos abarcan 80–138 y 69–128, respectivamente. Estas cifras describen los juegos recuperados y permiten revisar una hipótesis inicial. No prueban ventaja causal ni rendimiento general de la franquicia; ampliar rivales y controlar períodos sería necesario para esa conclusión.
