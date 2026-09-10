---
title: "Capitalización de Bancos"
description: "Extracción web de los bancos más grandes del mundo y proceso ETL para su análisis con SQL y Python."
pubDate: 2024-03-22
category: "Notebooks Analytics"
tags: ["Python", "Web Scraping", "ETL", "SQLite", "Pandas", "BeautifulSoup"]
github: "https://github.com/HoracioLaphitz/Capitalizacion-del-Mercado-de-los-Bancos-mas-Grandes"
showcase:
  context: "La capitalización de mercado de los bancos más grandes vive en una tabla de Wikipedia: sin API, sin CSV descargable."
  contribution: "Separé extracción, transformación y carga; guardé la salida en SQLite y CSV y registré cada etapa para poder rastrear fallas."
  result: "Datos consultables con SQL y una ejecución auditable mediante el registro de eventos y la verificación final de la carga."
  limit: "Proyecto de formación basado en una tabla web; un cambio en la fuente puede requerir ajustar la extracción."
  evidenceAction: "Ver notebook y código en GitHub"
draft: false
featured: true
resources:
  notebooks:
    - name: "Capitalización de Bancos — ETL"
      path: "/Proyectos/Notebooks/Banks_Project.ipynb"
---

## El problema

La capitalización de mercado de los bancos más grandes del mundo se publica en una tabla de Wikipedia, sin API ni archivo CSV descargable. El proyecto de la carrera de **Data Engineering de IBM** consistió en construir el proceso completo para capturar esos datos y permitir su consulta.

## Resolución

Un proceso **ETL** completo:

- **Extracción** — scraping de la tabla con `requests` + **BeautifulSoup**, parseando el HTML a un DataFrame de Pandas.
- **Transformación** — limpieza de los montos y conversión de la capitalización a múltiples monedas usando tasas de cambio desde un CSV.
- **Carga** — persistencia doble: base **SQLite** consultable por SQL y archivo CSV.
- **Registro de eventos** — función propia que registra cada etapa del proceso con fecha y hora para auditar su ejecución.

## Tecnologías

Python · BeautifulSoup · Requests · Pandas · SQLite

## Conocimiento demostrado

La disciplina de los procesos de datos: separar las fases, registrar cada paso y verificar la carga con consultas SQL al final. La extracción web es solo una parte; la confiabilidad depende del flujo completo.
