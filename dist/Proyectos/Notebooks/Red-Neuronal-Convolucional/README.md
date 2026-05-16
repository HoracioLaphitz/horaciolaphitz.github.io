# Red Neuronal Convolucional - Proyecto Profesional

**Proyecto de Ingeniería de Datos** - Redes Neuronales Convolucionales para clasificación de imágenes MNIST y Cats vs Dogs.

## 📋 Descripción

Este es un proyecto profesional y escalable que implementa dos modelos CNN:

1. **MNIST**: Clasificación de dígitos escritos a mano (0-9)
   - Precisión esperada: **~99%**
   - Dataset: 60,000 imágenes de entrenamiento, 10,000 de prueba
   - Tamaño: 28×28 píxeles (escala de grises)

2. **Cats vs Dogs**: Clasificación binaria de gatos y perros
   - Precisión esperada: **~99%**
   - Dataset: Imágenes del dataset de TensorFlow
   - Tamaño: 100×100 píxeles (escala de grises)

## 🏗️ Estructura del Proyecto

```
Red-Neuronal-Convolucional/
├── src/                          # Código fuente modular
│   ├── __init__.py
│   ├── config/                   # Configuración centralizada
│   │   ├── __init__.py
│   │   └── settings.py           # Parámetros y configuraciones
│   ├── data/                     # Data pipeline
│   │   ├── __init__.py
│   │   └── loaders.py            # Cargadores de datos
│   ├── models/                   # Modelos y entrenamiento
│   │   ├── __init__.py
│   │   ├── architectures.py      # Arquitecturas CNN
│   │   └── training.py           # Trainer y callbacks
│   ├── utils/                    # Utilidades
│   │   ├── __init__.py
│   │   ├── logging.py            # Sistema de logging
│   │   ├── visualization.py      # Gráficos y visualización
│   │   └── metrics.py            # Cálculo de métricas
│   └── pipelines/                # Pipelines de ETL/preprocesamiento
├── scripts/                      # Scripts ejecutables
│   ├── train_mnist.py            # Entrenamiento MNIST
│   ├── train_cats_dogs.py        # Entrenamiento Cats vs Dogs
│   └── predict.py                # Predicción e inferencia
├── experiments/                  # Notebooks de experimentación
├── models/                       # Modelos entrenados (.h5)
├── logs/                         # Logs y métricas de entrenamiento
├── data/                         # Datos (procesados)
├── tests/                        # Tests unitarios
├── requirements.txt              # Dependencias
├── .gitignore                    # Exclusiones de git
└── README.md                     # Este archivo
```

## 🚀 Inicio Rápido

### Requisitos Previos
- Python 3.8+
- pip o conda

### Instalación

1. **Clonar o descargar el proyecto**
```bash
cd Red-Neuronal-Convolucional
```

2. **Crear entorno virtual** (recomendado)
```bash
# Con venv
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# O con conda
conda create -n cnn python=3.10
conda activate cnn
```

3. **Instalar dependencias**
```bash
pip install -r requirements.txt
```

## 📚 Uso

### Entrenar MNIST

```bash
python -m scripts.train_mnist
```

**Salida esperada:**
- Modelo guardado en: `models/mnist_model.h5`
- Historial en: `logs/mnist_history.json`
- Gráficos en: `logs/mnist_training_history.png`

### Entrenar Cats vs Dogs

```bash
python -m scripts.train_cats_dogs
```

**Salida esperada:**
- Modelo guardado en: `models/cats_dogs_model.h5`
- Historial en: `logs/cats_dogs_history.json`
- Gráficos en: `logs/cats_dogs_training_history.png`

### Realizar Predicciones

**MNIST:**
```bash
python -m scripts.predict --model mnist --image ruta/a/imagen.png
```

**Cats vs Dogs:**
```bash
python -m scripts.predict --model cats_dogs --image ruta/a/imagen.png
```

## 🏛️ Arquitecturas de Modelos

### MNIST Model
```
Input (28×28×1)
    ↓
Conv2D (32 filtros, 3×3) + ReLU
    ↓
MaxPooling2D (2×2)
    ↓
Conv2D (64 filtros, 3×3) + ReLU
    ↓
MaxPooling2D (2×2)
    ↓
Flatten
    ↓
Dense (100, ReLU)
    ↓
Dense (10, Softmax)
    ↓
Output (10 clases)
```

### Cats vs Dogs Model
```
Input (100×100×1)
    ↓
Conv2D (32 filtros, 3×3) + ReLU + MaxPooling
    ↓
Conv2D (64 filtros, 3×3) + ReLU + MaxPooling
    ↓
Conv2D (128 filtros, 3×3) + ReLU + MaxPooling
    ↓
Flatten
    ↓
Dense (100, ReLU) + Dropout(0.4)
    ↓
Dense (1, Sigmoid)
    ↓
Output (Binaria)
```

## ⚙️ Configuración

Todos los parámetros se pueden ajustar en `src/config/settings.py`:

```python
# Ejemplo: Modificar epochs para MNIST
from src.config import mnist_config
mnist_config.epochs = 20

# Parámetros personalizables:
# - epochs: Número de épocas de entrenamiento
# - batch_size: Tamaño del lote
# - learning_rate: Tasa de aprendizaje
# - dropout_rate: Tasa de dropout
# - l2_regularization: Regularización L2
```

## 📊 Módulos Principales

### `src.config`
Gestión centralizada de configuración del proyecto.

**Clases:**
- `Config`: Base para todas las configuraciones
- `MNISTConfig`: Parámetros específicos de MNIST
- `CatsVsDogsConfig`: Parámetros específicos de Cats vs Dogs

### `src.data`
Data pipeline y cargadores de datos.

**Clases:**
- `DataNormalizer`: Normalización de imágenes
- `MNISTDataLoader`: Carga y preprocesamiento MNIST
- `CatsVsDogsDataLoader`: Carga y preprocesamiento Cats vs Dogs

### `src.models`
Arquitecturas de modelos y entrenamiento.

**Funciones:**
- `build_mnist_model()`: Construye modelo MNIST
- `build_cats_dogs_model()`: Construye modelo Cats vs Dogs

**Clases:**
- `ModelTrainer`: Gestor de entrenamiento con logging y callbacks

### `src.utils`
Utilidades generales del proyecto.

**Módulos:**
- `logging`: Sistema centralizado de logging
- `visualization`: Gráficos y visualización de resultados
- `metrics`: Cálculo de métricas de clasificación

## 📈 Monitoreo del Entrenamiento

El proyecto registra automáticamente:

1. **Logs en consola y archivo** (`logs/*.log`)
   - Mensajes de progreso
   - Métricas de entrenamiento
   - Errores y advertencias

2. **Historial de entrenamiento** (`logs/*_history.json`)
   - Accuracy y Loss por época
   - Validación

3. **TensorBoard** (`logs/tensorboard/`)
   - Visualización en tiempo real
   ```bash
   tensorboard --logdir logs/tensorboard/
   ```

4. **Gráficos** (`logs/*.png`)
   - Curvas de entrenamiento
   - Matrices de confusión

## 🔍 Best Practices Implementadas

✅ **Modularidad**: Código dividido en módulos independientes
✅ **Configuración Centralizada**: Parámetros en un solo lugar
✅ **Logging**: Sistema profesional de logging
✅ **Type Hints**: Anotaciones de tipos en funciones
✅ **Documentación**: Docstrings en todas las funciones
✅ **Escalabilidad**: Estructura preparada para ampliación
✅ **Reproducibilidad**: Seeds y configuración determinística
✅ **Regularización**: Dropout y L2 para evitar overfitting
✅ **Validación**: Separación de datos de entrenamiento/validación
✅ **Early Stopping**: Detención temprana para Cats vs Dogs

## 🧪 Testing

```bash
# Ejecutar tests
pytest tests/

# Con coverage
pytest --cov=src tests/
```

## 📝 Notebooks de Experimentación

Disponibles en `experiments/`:
- `01_exploratory_analysis.ipynb`: Análisis exploratorio
- `02_model_comparison.ipynb`: Comparación de arquitecturas
- `03_results_analysis.ipynb`: Análisis de resultados

## 🐛 Troubleshooting

### Error: "Modelo no encontrado"
```bash
# Ejecutar entrenamiento primero
python -m scripts.train_mnist
python -m scripts.train_cats_dogs
```

### Error: "ModuleNotFoundError"
```bash
# Asegurarse de ejecutar desde la raíz del proyecto
cd Red-Neuronal-Convolucional
python -m scripts.train_mnist
```

### Error: "Out of Memory"
```python
# Reducir el batch size en settings.py
mnist_config.batch_size = 16
```

## 📚 Referencias

- [TensorFlow Documentation](https://www.tensorflow.org/api_docs)
- [MNIST Dataset](http://yann.lecun.com/exdb/mnist/)
- [Convolutional Neural Networks](https://cs231n.github.io/convolutional-networks/)

## 👨‍💻 Autor

**Horacio** - Ingeniero de Datos

## 📄 Licencia

Este proyecto está disponible bajo licencia MIT.

---

**Última actualización**: Febrero 2026  
**Versión**: 1.0.0
