"""
Seed the database using the Django management command.

Usage:
    python -m scripts.seed_data
"""
import os
import sys
from pathlib import Path

# Point Django at the right settings
sys.path.insert(0, str(Path(__file__).parent.parent))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_backend.settings')

import django

django.setup()

from django.core.management import call_command  # noqa: E402 — import after setup()


def main():
    print("🚀 Seeding database via Django management command...\n")
    call_command('seed_data')
    print("\n✅ Database seeded successfully!")


if __name__ == '__main__':
    main()
