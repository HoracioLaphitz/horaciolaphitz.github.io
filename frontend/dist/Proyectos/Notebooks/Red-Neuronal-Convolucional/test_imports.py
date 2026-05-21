import sys
from pathlib import Path

sys.path.insert(0, str(Path.cwd()))

try:
    from src.config import mnist_config, cats_dogs_config
    print("✓ Imports de config exitosos")
    print(f"  - mnist_config.epochs: {mnist_config.epochs}")
    print(f"  - cats_dogs_config.epochs: {cats_dogs_config.epochs}")
except Exception as e:
    print(f"✗ Error en imports: {e}")
    import traceback
    traceback.print_exc()
