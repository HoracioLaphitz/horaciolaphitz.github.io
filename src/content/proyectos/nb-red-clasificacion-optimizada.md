---
title: "Red de Clasificación "
description: "Proyecto red de clasificación: tuning de hiperparámetros y mejora de precisión sobre un modelo base."
pubDate: 2024-03-12
category: "Notebooks Analytics"
tags: ["Python", "TensorFlow", "Neural Network", "Classification", "Hyperparameter Tuning"]
github: "https://github.com/HoracioLaphitz/horaciolaphitz.github.io/blob/main/public/Proyectos/Notebooks/Red_Clasificacion_Optimizado/Red_Clasificacion_Optimizado.ipynb"
draft: false
resources:
  notebooks:
    - name: "Red de Clasificación "
      path: "/Proyectos/Notebooks/Red_Clasificacion_Optimizado/Red_Clasificacion_Optimizado.ipynb"
---

## El problema

Cierre de la serie de iteraciones sobre el clasificador **MNIST**: además de mejorar métricas, el código del notebook necesitaba estructura. Un experimento que no se puede leer ni repetir vale poco.

## Resolución

- **Principios SOLID** en práctica: una clase para gestión de datos (Single Responsibility), otra para construcción del modelo (Open/Closed) y otra para el entrenamiento.
- Pipeline de datos con **tensorflow_datasets**: carga de MNIST, normalización y batching encapsulados en la clase de datos.
- Modelo denso (`Flatten` + `Dense`) construido por la clase de modelo, con evaluación de accuracy sobre el set de prueba.

## Stack

Python · TensorFlow · Keras · tensorflow_datasets · SOLID

## Conocimiento Demostrado

Principios de diseño de software aplicados análisis de datos con notebooks: separación datos, modelo y entrenamiento para hacerlo legible, repetible y modificable a futuro.
