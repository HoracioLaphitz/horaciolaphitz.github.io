"""
Script para verificar compatibilidad de paquetes con Python 3.11
"""
import subprocess
import sys

packages_to_check = [
    'IPython',
    'Pillow',
    'altair',
    'dash',
    'google-cloud',
    'keras',
    'matplotlib',
    'nba_api',
    'numpy',
    'openai',
    'opencv-python',
    'pandas',
    'pandas_profiling',
    'plotly',
    'requests',
    'scikit-learn',
    'seaborn',
    'tensorflow',
    'tensorflow-datasets',
    'tensorflow-hub',
    'tensorflow-text',
    'yfinance'
]

print(f"Python Version: {sys.version}")
print("=" * 80)
print("\nVerificando paquetes instalados:\n")

installed = []
not_installed = []

for package in packages_to_check:
    result = subprocess.run(
        ['pip', 'show', package],
        capture_output=True,
        text=True
    )
    
    if result.returncode == 0:
        # Extraer versión
        for line in result.stdout.split('\n'):
            if line.startswith('Version:'):
                version = line.split(':')[1].strip()
                installed.append((package, version))
                print(f"✓ {package:30s} v{version}")
                break
    else:
        not_installed.append(package)
        print(f"✗ {package:30s} NO INSTALADO")

print("\n" + "=" * 80)
print(f"\nResumen:")
print(f"  Instalados: {len(installed)}/{len(packages_to_check)}")
print(f"  Faltantes: {len(not_installed)}/{len(packages_to_check)}")

if not_installed:
    print(f"\nPaquetes faltantes:")
    for pkg in not_installed:
        print(f"  - {pkg}")
