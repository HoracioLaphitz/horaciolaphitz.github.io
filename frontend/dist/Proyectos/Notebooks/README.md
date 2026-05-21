# Portafolio de Proyectos de Datos

Este repositorio agrupa varios notebooks dirigidos a ejercicios de análisis, modelado y visualización. Cada archivo contiene un problema concreto acompañado de explicaciones y código ejecutable. Destacamos especialmente el proyecto **Altura-Peso Regresión**, en el que aplicamos técnicas de regresión lineal y polinómica con buenas prácticas de ingeniería de datos.

## 📊 Descripción general

- **Altura-Peso-Regresion.ipynb**: se cargan datos de altura y peso, se exploran, se construyen modelos de regresión lineal y polinómica utilizando `scikit-learn`, se evalúan con métricas (R², MAE, MSE) y se encapsulan predicciones en funciones. Incluye división en conjuntos de entrenamiento/prueba, pipelines y validación cruzada.
- Otros notebooks (clustering, redes neuronales, análisis exploratorio, etc.) contienen ejemplos adicionales.

## 🎯 Objetivos del proyecto de regresión

1. Mostrar un flujo completo de modelado de regresión.
2. Aplicar separación train/test y validación cruzada.
3. Utilizar pipelines para escalado y transformación polinómica.
4. Producir visualizaciones comparativas y métricas de rendimiento.
5. Documentar el proceso para facilitar la revisión y el uso por terceros.

## 🛠️ Tecnologías

- Python 3.11+
- pandas 2.x
- matplotlib, seaborn
- scikit-learn 1.0+

## 📦 Instalación

```bash
pip install -r requirements.txt
```

> El archivo `requirements.txt` contiene las dependencias necesarias; puedes instalarlo en un entorno virtual.

## 🚀 Uso

1. Navega a la carpeta `Notebooks`.
2. Abre `Altura-Peso-Regresion.ipynb` con Jupyter o VSCode.
3. Asegúrate de tener el fichero `datos.csv` con las columnas `Altura (m)` y `Peso(kg)` en el mismo directorio.
4. Ejecuta las celdas secuencialmente para reproducir análisis y modelos.

## 📈 Resultados esperados

- Scatterplots de los datos originales.
- Métricas de desempeño para modelos lineal y polinómico.
- Función reutilizable para predicción de peso a partir de la altura.

## 👤 Autor

Horacio Laphitz - [GitHub](https://github.com/HoracioLaphitz)

## 📝 Licencia

MIT License
