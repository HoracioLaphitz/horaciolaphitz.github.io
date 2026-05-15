"""Módulo de modelos neuronales"""

from .architectures import (
    build_mnist_model,
    build_cats_dogs_model
)
from .training import ModelTrainer

__all__ = ["build_mnist_model", "build_cats_dogs_model", "ModelTrainer"]
