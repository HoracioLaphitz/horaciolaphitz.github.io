"""Módulo de cargadores de datos"""

from .loaders import (
    MNISTDataLoader,
    CatsVsDogsDataLoader,
    DataNormalizer
)

__all__ = ["MNISTDataLoader", "CatsVsDogsDataLoader", "DataNormalizer"]
