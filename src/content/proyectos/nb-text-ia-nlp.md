---
title: "Text-IA — Procesamiento de Texto con IA"
description: "El texto es dato no estructurado hasta que lo transformás: tokenización, vectorización y modelado NLP para que un modelo entienda lenguaje natural."
pubDate: 2024-04-10
category: "Notebooks Analytics"
tags: ["Python", "NLP", "Text Processing", "Machine Learning"]
github: "https://github.com/HoracioLaphitz/horaciolaphitz.github.io/blob/main/public/Proyectos/Notebooks/Text-IA/Text-IA.ipynb"
draft: false
resources:
  notebooks:
    - name: "Text-IA — NLP"
      path: "/Proyectos/Notebooks/Text-IA/Text-IA.ipynb"
---

## El problema

Un modelo no entiende texto: entiende tensores. Todo pipeline de NLP arranca por el mismo puente — convertir lenguaje natural en representaciones numéricas que conserven el significado.

## Cómo lo resolví

- Preprocesamiento de texto con **tensorflow_text**: tokenización nativa dentro del grafo de TensorFlow, sin pasos externos en Python puro.
- Modelo de lenguaje preentrenado desde **TensorFlow Hub** para generar representaciones (embeddings) del texto de entrada.
- Aplicación del pipeline sobre texto real para obtener vectores utilizables por capas de clasificación posteriores.

## Stack

Python · TensorFlow · tensorflow_text · TensorFlow Hub

## Qué aprendí

Que en NLP moderno el preprocesamiento y el modelo viven juntos: usar la tokenización del propio modelo preentrenado evita el desajuste clásico entre cómo se entrenó y cómo se usa.
