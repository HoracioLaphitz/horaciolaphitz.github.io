---
title: "Red de Clasificación — Iteración 2"
description: "Segunda iteración de la red de clasificación, ajustando capas y regularización para mejorar la generalización."
pubDate: 2024-03-08
category: "Notebooks Analytics"
tags: ["Python", "TensorFlow", "Neural Network", "Classification"]
github: "https://github.com/HoracioLaphitz/horaciolaphitz.github.io/blob/main/public/Proyectos/Notebooks/RedDeClasificacion2/RedDeClasificacion2.ipynb"
draft: true
resources:
  notebooks:
    - name: "Red de Clasificación — Iteración 2"
      path: "/Proyectos/Notebooks/RedDeClasificacion2/RedDeClasificacion2.ipynb"
---

## El problema

El modelo base clasifica, pero deja rendimiento sobre la mesa. Segunda iteración de la serie: ajustar arquitectura y entrenamiento para mejorar la generalización sin memorizar el set de entrenamiento.

## Cómo lo resolví

- Mismo dataset vía **tensorflow_datasets**, mismo protocolo de evaluación — lo único que cambia es el modelo, para que la comparación contra el baseline sea limpia.
- Ajustes de arquitectura sobre la variante convolucional (`Conv2D` + `MaxPooling2D` + `Dense`): profundidad y tamaño de capas.
- Entrenamientos de 10 y 50 épocas comparando accuracy de entrenamiento contra accuracy de validación para detectar sobreajuste.

## Stack

Python · TensorFlow · Keras · tensorflow_datasets · OpenCV

## Qué aprendí

Iterar con disciplina: cambiar una cosa por vez y medir contra la misma referencia. Sin eso, no se sabe qué cambio produjo qué efecto.
