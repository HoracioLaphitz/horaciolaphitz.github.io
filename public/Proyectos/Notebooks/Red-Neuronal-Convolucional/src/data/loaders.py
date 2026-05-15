"""
Cargadores de datos y preprocesamiento
Maneja la carga, normalización y preparación de datasets
"""

import tensorflow as tf
import tensorflow_datasets as tfds
import numpy as np
import cv2
from typing import Tuple, Dict, Any
import logging

logger = logging.getLogger(__name__)


class DataNormalizer:
    """Normaliza datos de imágenes"""
    
    @staticmethod
    def normalize_mnist(imagenes, etiquetas):
        """Normaliza imágenes MNIST de rango 0-255 a 0-1"""
        imagenes = tf.cast(imagenes, tf.float32)
        imagenes = imagenes / 255.0
        return imagenes, etiquetas
    
    @staticmethod
    def normalize_cats_dogs(X: np.ndarray) -> np.ndarray:
        """Normaliza imágenes Cats vs Dogs"""
        return X.astype(float) / 255.0


class MNISTDataLoader:
    """Cargador de datos MNIST"""
    
    def __init__(self, batch_size: int = 32, cache: bool = True):
        """
        Inicializa el cargador MNIST
        
        Args:
            batch_size: Tamaño del lote
            cache: Si se cachea los datos en memoria
        """
        self.batch_size = batch_size
        self.cache = cache
        self.normalizer = DataNormalizer()
        
    def load(self) -> Tuple[Any, Any, Any]:
        """
        Carga el dataset MNIST
        
        Returns:
            Tupla (train_dataset, test_dataset, metadata)
        """
        logger.info("Cargando dataset MNIST...")
        
        datos, metadatos = tfds.load(  # type: ignore
            "mnist", 
            as_supervised=True, 
            with_info=True
        )
        
        datos_entrenamiento = datos["train"]  # type: ignore
        datos_pruebas = datos["test"]  # type: ignore
        
        # Normalizar
        logger.info("Normalizando datos...")
        datos_entrenamiento = datos_entrenamiento.map(
            self.normalizer.normalize_mnist,
            num_parallel_calls=tf.data.AUTOTUNE
        )
        datos_pruebas = datos_pruebas.map(
            self.normalizer.normalize_mnist,
            num_parallel_calls=tf.data.AUTOTUNE
        )
        
        # Cache
        if self.cache:
            logger.info("Cacheando datos...")
            datos_entrenamiento = datos_entrenamiento.cache()
            datos_pruebas = datos_pruebas.cache()
        
        # Batch y shuffle
        logger.info(f"Preparando batches de tamaño {self.batch_size}...")
        datos_entrenamiento = (datos_entrenamiento
                               .shuffle(60000)
                               .batch(self.batch_size)
                               .prefetch(tf.data.AUTOTUNE))
        
        datos_pruebas = (datos_pruebas
                        .batch(self.batch_size)
                        .prefetch(tf.data.AUTOTUNE))
        
        logger.info("Dataset MNIST cargado exitosamente")
        
        return datos_entrenamiento, datos_pruebas, metadatos


class CatsVsDogsDataLoader:
    """Cargador de datos Cats vs Dogs con preprocesamiento"""
    
    def __init__(self, image_size: int = 100):
        """
        Inicializa el cargador Cats vs Dogs
        
        Args:
            image_size: Tamaño de la imagen para redimensionar
        """
        self.image_size = image_size
        self.normalizer = DataNormalizer()
        
    def load(self) -> Tuple[np.ndarray, np.ndarray, Any]:
        """
        Carga y preprocesa el dataset Cats vs Dogs
        
        Returns:
            Tupla (X, y, metadata)
        """
        logger.info("Cargando dataset Cats vs Dogs...")
        
        datos, metadatos = tfds.load(  # type: ignore
            "cats_vs_dogs",
            as_supervised=True,
            with_info=True
        )
        
        logger.info("Preprocesando imágenes...")
        X = []
        y = []
        
        for i, (imagen, etiqueta) in enumerate(datos["train"]):  # type: ignore
            if i % 500 == 0:
                logger.info(f"Procesadas {i} imágenes...")
            
            # Redimensionar
            imagen = cv2.resize(
                imagen.numpy(), 
                (self.image_size, self.image_size)
            )
            
            # Convertir a escala de grises
            imagen = cv2.cvtColor(imagen, cv2.COLOR_BGR2GRAY)
            
            # Agregar dimensión de canal
            imagen = imagen.reshape(self.image_size, self.image_size, 1)
            
            X.append(imagen)
            y.append(etiqueta)
        
        # Convertir a numpy arrays
        X = np.array(X)
        y = np.array(y)
        
        # Normalizar
        X = self.normalizer.normalize_cats_dogs(X)
        
        logger.info(f"Dataset preparado: X shape={X.shape}, y shape={y.shape}")
        
        return X, y, metadatos
