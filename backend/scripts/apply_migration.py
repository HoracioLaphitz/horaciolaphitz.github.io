"""
Apply Django migrations.

Usage:
    python -m scripts.apply_migration               # apply all pending
    python -m scripts.apply_migration --fake <app>  # fake-apply
    python -m scripts.apply_migration <app>         # specific app only
"""
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_backend.settings')

import django
from django.core.management import call_command

django.setup()


def main():
    args = sys.argv[1:] if len(sys.argv) > 1 else []

    print("🔧 Applying Django migrations...\n")
    call_command('migrate', *args)
    print("\n✅ Migrations applied successfully!")


if __name__ == '__main__':
    main()
