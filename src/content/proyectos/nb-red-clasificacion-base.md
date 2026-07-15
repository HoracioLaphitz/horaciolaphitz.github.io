---
title: "Red de Clasificación — Modelo Base"
description: "Versión base de una red de clasificación, punto de partida para iterar sobre arquitectura e hiperparámetros."
pubDate: 2024-03-07
category: "Notebooks Analytics"
tags: ["Python", "TensorFlow", "Neural Network", "Classification"]
github: "https://github.com/HoracioLaphitz/horaciolaphitz.github.io/blob/main/public/Proyectos/Notebooks/RedNeuronalClasificacion/RedDeClasificacion.ipynb"
draft: true
resources:
  notebooks:
    - name: "Red de Clasificación — Base"
      path: "/Proyectos/Notebooks/RedNeuronalClasificacion/RedDeClasificacion.ipynb"
---

## El problema

Antes de optimizar cualquier modelo hace falta una línea base medible. Este notebook establece esa referencia para un clasificador de imágenes: si después una mejora no supera este número, no es mejora.

## Resolución

- Dataset de imágenes cargado con **tensorflow_datasets**, con normalización de píxeles a [0, 1].
- Primera arquitectura: red densa (`Flatten` + capas `Dense`) como referencia.
- Segunda arquitectura en el mismo notebook: variante convolucional (`Conv2D` + `MaxPooling2D`) para comparar contra la densa.
- Entrenamientos de 10 y 50 épocas midiendo accuracy sobre el set de prueba, con visualización de predicciones usando Matplotlib y OpenCV.

## Stack

Python · TensorFlow · Keras · tensorflow_datasets · OpenCV

## Conocimiento Demostrado

El valor de un baseline honesto: la red densa ya clasifica razonablemente bien, y ese número es lo que justifica (o no) la complejidad extra de las capas convolucionales en las iteraciones siguientes.
