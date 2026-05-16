"""
Script de predicción e inferencia
Ejecutar: python -m scripts.predict --model mnist --image_path ruta/imagen.png
"""

import sys
from pathlib import Path
import argparse

# Agregar raíz del proyecto al path
sys.path.insert(0, str(Path(__file__).parent.parent))

import tensorflow as tf
import numpy as np
import cv2
from src.config import mnist_config, cats_dogs_config
from src.utils import setup_logging
import logging

# Configurar logging
logger = setup_logging(mnist_config)


class Predictor:
    """Realiza predicciones con modelos entrenados"""
    
    def __init__(self, model_type: str = "mnist"):
        """
        Inicializa el predictor
        
        Args:
            model_type: "mnist" o "cats_dogs"
        """
        self.model_type = model_type
        self.config = mnist_config if model_type == "mnist" else cats_dogs_config
        
        # Cargar modelo
        model_path = Path(self.config.model_path)
        if not model_path.exists():
            raise FileNotFoundError(f"Modelo no encontrado en {model_path}")
        
        self.model = tf.keras.models.load_model(str(model_path))
        logger.info(f"Modelo {model_type} cargado exitosamente")
        
        # Nombres de clases
        if model_type == "mnist":
            self.class_names = [str(i) for i in range(10)]
        else:
            self.class_names = ["Gato", "Perro"]
    
    def predict_mnist(self, image_path: str) -> dict:
        """
        Predice un dígito MNIST
        
        Args:
            image_path: Ruta a la imagen
            
        Returns:
            Diccionario con predicción
        """
        # Cargar imagen
        image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        if image is None:
            raise ValueError(f"No se pudo cargar la imagen: {image_path}")
        
        # Redimensionar a 28x28
        image = cv2.resize(image, (28, 28))
        
        # Normalizar
        image = image.astype(float) / 255.0
        
        # Agregar dimensiones de batch y canal
        image_input = image.reshape(1, 28, 28, 1)
        
        # Predecir
        predictions = self.model.predict(image_input, verbose=0)[0]
        
        predicted_class = np.argmax(predictions)
        confidence = float(np.max(predictions))
        
        return {
            "predicted_digit": self.class_names[predicted_class],
            "confidence": confidence,
            "probabilities": {
                self.class_names[i]: float(predictions[i])
                for i in range(len(self.class_names))
            }
        }
    
    def predict_cats_dogs(self, image_path: str) -> dict:
        """
        Predice Gato o Perro
        
        Args:
            image_path: Ruta a la imagen
            
        Returns:
            Diccionario con predicción
        """
        # Cargar imagen
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError(f"No se pudo cargar la imagen: {image_path}")
        
        # Procesar imagen
        image = cv2.resize(image, (100, 100))
        image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        image = image.astype(float) / 255.0
        
        # Agregar dimensiones
        image_input = image.reshape(1, 100, 100, 1)
        
        # Predecir
        prediction = self.model.predict(image_input, verbose=0)[0][0]
        
        # prediction cercano a 0 = Gato, cercano a 1 = Perro
        is_dog = prediction > 0.5
        predicted_class = "Perro" if is_dog else "Gato"
        confidence = prediction if is_dog else 1 - prediction
        
        return {
            "predicted_class": predicted_class,
            "confidence": float(confidence),
            "probabilities": {
                "Gato": float(1 - prediction),
                "Perro": float(prediction)
            }
        }
    
    def predict(self, image_path: str) -> dict:
        """Realiza predicción según el tipo de modelo"""
        if self.model_type == "mnist":
            return self.predict_mnist(image_path)
        else:
            return self.predict_cats_dogs(image_path)


def main():
    """Función principal"""
    
    parser = argparse.ArgumentParser(
        description="Realiza predicciones con modelos entrenados"
    )
    parser.add_argument(
        "--model",
        choices=["mnist", "cats_dogs"],
        default="mnist",
        help="Tipo de modelo a usar"
    )
    parser.add_argument(
        "--image",
        required=True,
        help="Ruta a la imagen para predecir"
    )
    
    args = parser.parse_args()
    
    try:
        # Crear predictor
        predictor = Predictor(args.model)
        
        # Realizar predicción
        logger.info(f"Prediciendo imagen: {args.image}")
        result = predictor.predict(args.image)
        
        # Mostrar resultados
        logger.info("\n" + "=" * 60)
        logger.info("RESULTADO DE LA PREDICCIÓN")
        logger.info("=" * 60)
        
        if args.model == "mnist":
            logger.info(f"Dígito predicho: {result['predicted_digit']}")
        else:
            logger.info(f"Clase predicha: {result['predicted_class']}")
        
        logger.info(f"Confianza: {result['confidence']:.2%}")
        logger.info("\nProbabilidades:")
        
        for class_name, prob in result['probabilities'].items():
            logger.info(f"  {class_name}: {prob:.4f}")
        
        logger.info("=" * 60)
        
    except Exception as e:
        logger.error(f"Error durante la predicción: {str(e)}")
        return 1
    
    return 0


if __name__ == "__main__":
    exit(main())
