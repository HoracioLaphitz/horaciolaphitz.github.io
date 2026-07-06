---
title: "Regresión Logística — Clasificación Binaria"
description: "Cuando la respuesta es sí o no, la regresión logística es la herramienta base: clasificación binaria con lectura fina de precision, recall y matriz de confusión."
pubDate: 2024-03-15
category: "Notebooks Analytics"
tags: ["Python", "Scikit-learn", "Logistic Regression", "Classification", "Machine Learning"]
github: "https://github.com/HoracioLaphitz/horaciolaphitz.github.io/blob/main/public/Proyectos/Notebooks/Regresion-Logistica/Regresion%20Logistica.ipynb"
draft: false
resources:
  notebooks:
    - name: "Regresión Logística"
      path: "/Proyectos/Notebooks/Regresion-Logistica/Regresion Logistica.ipynb"
---

## El problema

Clasificación binaria: dado un conjunto de features, decidir sí o no. El accuracy solo no alcanza para evaluar un clasificador — con clases desbalanceadas puede ser alto y el modelo, inútil.

## Cómo lo resolví

- Análisis exploratorio previo con **Pandas** y **Seaborn** para entender distribución de features y balance de clases.
- Modelo de **regresión logística** con Scikit-learn, entrenado sobre el split de entrenamiento y evaluado sobre datos que nunca vio.
- Evaluación completa: `classification_report` (precision, recall, F1 por clase) y **matriz de confusión** para ver exactamente qué tipo de error comete el modelo — falsos positivos vs falsos negativos.

## Stack

Python · Scikit-learn · Pandas · Seaborn

## Qué aprendí

A elegir la métrica según el costo del error: cuándo importa más el recall (no dejar pasar positivos) y cuándo la precision (no dar falsas alarmas). La matriz de confusión cuenta la historia que el accuracy esconde.
