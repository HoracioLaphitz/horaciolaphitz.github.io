---
title: "Predicción de Precios de Acciones — NYSE"
description: "Modelo de machine learning que anticipa el precio de acciones del NYSE a partir de su histórico de mercado, domando el ruido de una serie temporal notoriamente volátil."
pubDate: 2024-02-13
category: "Análisis de datos"
tags: ["Python", "Machine Learning", "Scikit-learn", "Pandas", "Time Series", "Finance"]
github: "https://github.com/HoracioLaphitz/PredicePrecioAcciones"
draft: false
resources:
  notebooks:
    - name: "Predicción de Precios de Acciones"
      path: "/Proyectos/Notebooks/PredicePrecioAcciones/PredicePrecioAcciones.ipynb"
---

## Situación

Los precios del mercado bursátil son ruidosos y difíciles de anticipar, pero contienen patrones históricos que un modelo puede aprender.

## El desafío

Construir un modelo capaz de predecir el precio de acciones del **NYSE** usando únicamente datos históricos, sin caer en sobreajuste sobre una serie tan volátil.

## La solución

Un modelo supervisado en Python: ingesta de datos de mercado, ingeniería de features temporales, entrenamiento y evaluación con métricas de error sobre datos que el modelo no vio.

## Impacto

Un prototipo funcional que demuestra el flujo completo de un problema de predicción financiera — desde los datos crudos hasta una estimación evaluable.
