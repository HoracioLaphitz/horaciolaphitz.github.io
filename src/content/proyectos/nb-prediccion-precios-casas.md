---
title: "Predicción de Precios de Casas"
description: "Modelo de regresión que pone precio a una vivienda a partir de sus características — superficie, ubicación, antigüedad — y se evalúa sobre datos que nunca vio."
pubDate: 2024-04-01
category: "Notebooks Analytics"
tags: ["Python", "Scikit-learn", "Regression", "Machine Learning", "Pandas"]
github: "https://github.com/HoracioLaphitz/horaciolaphitz.github.io/blob/main/public/Proyectos/Notebooks/Predice-Precios-Casas/Predice-Precios-Casas.ipynb"
draft: true
resources:
  notebooks:
    - name: "Predicción de Precios de Casas"
      path: "/Proyectos/Notebooks/Predice-Precios-Casas/Predice-Precios-Casas.ipynb"
---

## El problema

Estimar el precio de una vivienda a partir de sus características — superficie, ubicación, antigüedad. Un problema de regresión supervisada clásico donde el riesgo es evaluar sobre los mismos datos con los que se entrenó.

## Cómo lo resolví

- Análisis exploratorio con **Pandas** y **Seaborn**: correlaciones entre features y precio, distribución de la variable objetivo y detección de outliers.
- Modelo de regresión con **Scikit-learn**, entrenado sobre el split de entrenamiento.
- Evaluación con **MSE** sobre el set de prueba — datos que el modelo nunca vio — para medir el error real de generalización.

## Stack

Python · Scikit-learn · Pandas · Seaborn · NumPy

## Qué aprendí

El flujo completo de una regresión supervisada: del EDA que sugiere qué features importan, al número de error que dice cuánto confiar en el modelo.
