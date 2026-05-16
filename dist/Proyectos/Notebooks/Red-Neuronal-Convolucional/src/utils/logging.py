"""
Sistema de logging centralizado
"""

import logging
import logging.handlers
from pathlib import Path
from src.config import Config


def setup_logging(config: Config, name: str = "cnn_project"):
    """
    Configura el sistema de logging
    
    Args:
        config: Configuración del proyecto
        name: Nombre del logger
        
    Returns:
        Logger configurado
    """
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, config.log_level))
    
    # Crear formateador
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # Handler para consola
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    # Handler para archivo (si está habilitado)
    if config.save_logs:
        log_file = config.logs_dir / f"{name}.log"
        log_file.parent.mkdir(parents=True, exist_ok=True)
        
        file_handler = logging.handlers.RotatingFileHandler(
            log_file,
            maxBytes=10485760,  # 10MB
            backupCount=5
        )
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    
    return logger
