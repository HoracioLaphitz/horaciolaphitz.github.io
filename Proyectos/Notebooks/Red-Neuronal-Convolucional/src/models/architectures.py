"""
Arquitecturas de redes neuronales convolucionales
Define los modelos para MNIST y Cats vs Dogs
"""

import tensorflow as tf
from src.config import MNISTConfig, CatsVsDogsConfig


def build_mnist_model(config: MNISTConfig) -> tf.keras.Model:
    """
    Construye el modelo CNN para MNIST
    
    Arquitectura:
    - Conv2D (32 filtros, 3x3)
    - MaxPooling (2x2)
    - Conv2D (64 filtros, 3x3)
    - MaxPooling (2x2)
    - Flatten
    - Dense (100 unidades, ReLU)
    - Dense (10 unidades, Softmax)
    
    Accuracy esperada: ~99%
    
    Args:
        config: Configuración MNIST
        
    Returns:
        Modelo compilado
    """
    model = tf.keras.Sequential([
        tf.keras.layers.Conv2D(
            32, (3, 3),
            activation="relu",
            input_shape=config.image_shape
        ),
        tf.keras.layers.MaxPooling2D((2, 2)),
        
        tf.keras.layers.Conv2D(
            64, (3, 3),
            activation="relu"
        ),
        tf.keras.layers.MaxPooling2D((2, 2)),
        
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(100, activation="relu"),
        tf.keras.layers.Dense(config.num_classes, activation="softmax")
    ])
    
    model.compile(
        optimizer=config.optimizer,
        loss=config.loss_function,
        metrics=config.metrics
    )
    
    return model


def build_cats_dogs_model(config: CatsVsDogsConfig) -> tf.keras.Model:
    """
    Construye el modelo CNN para clasificación Cats vs Dogs
    
    Arquitectura:
    - Conv2D (32 filtros, 3x3) + ReLU + MaxPooling
    - Conv2D (64 filtros, 3x3) + ReLU + MaxPooling
    - Conv2D (128 filtros, 3x3) + ReLU + MaxPooling
    - Flatten
    - Dense (100 unidades, ReLU) + Dropout
    - Dense (1 unidad, Sigmoid)
    
    Accuracy esperada: ~99%
    
    Args:
        config: Configuración Cats vs Dogs
        
    Returns:
        Modelo compilado
    """
    regularizer = tf.keras.regularizers.l2(config.l2_regularization)
    
    model = tf.keras.Sequential([
        tf.keras.layers.Conv2D(
            32, (3, 3),
            activation="relu",
            input_shape=config.image_shape,
            kernel_regularizer=regularizer
        ),
        tf.keras.layers.MaxPooling2D((2, 2)),
        
        tf.keras.layers.Conv2D(
            64, (3, 3),
            activation="relu",
            kernel_regularizer=regularizer
        ),
        tf.keras.layers.MaxPooling2D((2, 2)),
        
        tf.keras.layers.Conv2D(
            128, (3, 3),
            activation="relu",
            kernel_regularizer=regularizer
        ),
        tf.keras.layers.MaxPooling2D((2, 2)),
        
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(
            100,
            activation="relu",
            kernel_regularizer=regularizer
        ),
        tf.keras.layers.Dropout(config.dropout_rate),
        tf.keras.layers.Dense(1, activation="sigmoid")
    ])
    
    model.compile(
        optimizer=config.optimizer,
        loss=config.loss_function,
        metrics=config.metrics
    )
    
    return model
