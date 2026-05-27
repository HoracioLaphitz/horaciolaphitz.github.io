"""
[LEGACY] This script was part of the old FastAPI + Supabase architecture.

The current stack (Django DRF) syncs project data through the codegen pipeline:
  1. frontend/scripts/sync-all-projects.mjs   — generates content markdown
  2. frontend/scripts/generate-site-data.mjs   — generates JSON manifests
  3. pnpm --filter backend seed                — loads manifests into Django ORM

For local development the Django seed command is used:
    pnpm --filter backend seed

For production the data comes from the Vercel build step (codegen runs during pnpm build).
"""
import sys

print("❌ This script is no longer used.")
print()
print("The project now uses Django DRF with a codegen pipeline.")
print("To seed the database:")
print()
print("  pnpm --filter backend seed")
print()
print("See AGENTS.md for the full workflow.")
sys.exit(1)
