---
title: "Red de Clasificación parte 2"
description: "Segunda iteración de la red de clasificación, ajustando capas y regularización para mejorar la generalización."
pubDate: 2024-03-08
category: "Notebooks Analytics"
tags: ["Python", "TensorFlow", "Neural Network", "Classification"]
github: "https://github.com/HoracioLaphitz/horaciolaphitz.github.io/blob/main/public/Proyectos/Notebooks/RedDeClasificacion2/RedDeClasificacion2.ipynb"
draft: false
resources:
  notebooks:
    - name: "Red de Clasificación parte 2"
      path: "/Proyectos/Notebooks/RedDeClasificacion2/RedDeClasificacion2.ipynb"
---

## El problema

El modelo base clasifica, pero deja rendimiento sobre la mesa. Esta segunda iteración de la serie ajusta la arquitectura y el entrenamiento para mejorar la generalización sin memorizar nuevamente el set de entrenamiento.

## Resolución

- Mismo dataset vía **tensorflow_datasets**, mismo protocolo de evaluación — lo único que cambia es el modelo, para que la comparación contra el baseline sea limpia.
- Ajustes de arquitectura sobre la variante convolucional (`Conv2D` + `MaxPooling2D` + `Dense`): profundidad y tamaño de capas.
- Entrenamientos de 10 y 50 épocas comparando accuracy de entrenamiento contra accuracy de validación para detectar sobreajuste.

## Stack

Python · TensorFlow · Keras · tensorflow_datasets · OpenCV

## Conocimiento Demostrado

**Persistencia en el resutado**: cambiar una cosa por vez y medir contra la misma referencia. Sin eso, no se sabe qué cambio produjo qué efecto.
