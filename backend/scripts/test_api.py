"""
Quick API smoke test using Django's test client.

Usage:
    python -m scripts.test_api
"""
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_backend.settings')
os.environ['API_SECRET_KEY'] = 'test-key'
os.environ['DJANGO_DEBUG'] = 'True'
os.environ['ALLOWED_HOSTS'] = '*'

import django  # noqa: E402 — must be after env vars

django.setup()

from django.test import Client  # noqa: E402 — import after setup()


def test_endpoints(client):
    endpoints = [
        ('GET', '/api/health', 200),
        ('GET', '/api/v1/profile', 200),
        ('GET', '/api/v1/projects', 200),
        ('GET', '/api/v1/projects/featured', 200),
        ('GET', '/api/v1/technologies', 200),
        ('GET', '/api/v1/experience', 200),
        ('GET', '/api/v1/education', 200),
        ('GET', '/api/v1/certifications', 200),
        ('GET', '/api/v1/notebooks', 200),
    ]

    print(f"🔍 Testing {len(endpoints)} endpoints...\n")
    ok = 0

    for method, url, expected in endpoints:
        response = getattr(client, method.lower())(url)
        status = '✅' if response.status_code == expected else '❌'
        print(f"  {status} {method:4s} {url:40s} → {response.status_code}")
        if response.status_code == expected:
            ok += 1

    print(f"\n{'='*50}")
    print(f"  {ok}/{len(endpoints)} endpoints passed")
    if ok == len(endpoints):
        print("  ✅ All tests passed!")
    else:
        print(f"  ❌ {len(endpoints) - ok} failures")
        sys.exit(1)


def main():
    client = Client()
    test_endpoints(client)


if __name__ == '__main__':
    main()
