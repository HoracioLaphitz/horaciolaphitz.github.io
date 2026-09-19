---
title: "Predicción de precios de acciones"
description: "Modelo de aprendizaje automático para estimar precios de acciones de la Bolsa de Nueva York."
pubDate: "2024-02-13T14:37:49.000Z"
author: "Horacio Laphitz"
category: "Análisis de datos"
tags: []
github: "https://github.com/HoracioLaphitz/PredicePrecioAcciones"
maturity: "Portfolio project"
---

<!-- generated-by: github-auto-sync-platform; slug: github-prediceprecioacciones -->

## Situación

El notebook modela la serie horaria del precio de cierre de Amazon para comparar valores reales y estimados. El ejercicio se enfoca en preparación temporal y redes recurrentes, no en producir una recomendación financiera ni un sistema de negociación.

## El desafío

Una serie financiera debe conservar el orden cronológico durante separación, escalado y construcción de ventanas. El repositorio usa secuencias de diez pasos y una división 90/10, pero no presenta pruebas en otros períodos o activos. El notebook original corresponde a 2023 y convive con un script posterior de actualización continua, por lo que ambos recorridos no deben confundirse.

## La solución

La implementación obtiene datos con `yfinance`, prepara la serie mediante pandas y `MinMaxScaler`, y entrena una LSTM de 256 unidades seguida de capas densas. Usa Adam, error cuadrático medio y 300 épocas. El archivo de salida conserva 158 pares de valores reales y predichos para inspección.

## Impacto

A partir de ese CSV se deriva un error absoluto medio cercano a USD 2,08 para la partición registrada. La cifra caracteriza esa corrida y ese período; no demuestra rentabilidad, estabilidad futura ni capacidad de pronóstico general. El proyecto aporta un ejemplo trazable de ventanas temporales, escalado y comparación de series, con límites claros antes de cualquier interpretación financiera.
