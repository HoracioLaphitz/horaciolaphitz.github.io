"""
Apply Supabase migrations directly via psycopg2.

Usage:
    python backend/scripts/apply_supabase_migrations.py

Requires:
    - POSTGRES_URL_NON_POOLING env var set (or pass --db-url)
    - psycopg2-binary installed (in requirements.txt)

This reads all .sql files from supabase/migrations/ in order
and executes them against the remote database.
"""

import os
import sys
from pathlib import Path

try:
    import psycopg2
except ImportError:
    print("❌ psycopg2 not found. Install it with: pip install psycopg2-binary")
    sys.exit(1)


MIGRATIONS_DIR = Path(__file__).resolve().parent.parent.parent / "supabase" / "migrations"

# 🔐 URL directa (sin pooler, puerto 5432 — necesario para DDL/migrations)
DEFAULT_DB_URL = (
    "postgres://postgres.swmsdgvftvfglcgwezxz:n85PvnxazSao3SXq"
    "@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
)


def get_migration_files() -> list[Path]:
    """Return migration .sql files sorted by name."""
    files = sorted(MIGRATIONS_DIR.glob("*.sql"))
    if not files:
        print(f"❌ No .sql files found in {MIGRATIONS_DIR}")
        sys.exit(1)
    return files


def execute_sql(conn, sql: str, label: str) -> None:
    """Execute a single SQL block, splitting statements by semicolons."""
    import re

    # Remove single-line comments and empty lines for cleaner output
    cleaned = re.sub(r"--.*$", "", sql, flags=re.MULTILINE)
    # Split by semicolons but keep dollar-quote blocks intact
    statements = []
    current = []
    in_dollar = False

    for line in cleaned.split("\n"):
        if "$function$" in line or "$$" in line:
            # Toggle dollar-quote state
            dollar_count = line.count("$$")
            if dollar_count % 2 == 1:
                in_dollar = not in_dollar
            current.append(line)
            if not in_dollar and dollar_count >= 1:
                statements.append("\n".join(current))
                current = []
            continue
        if in_dollar:
            current.append(line)
            continue

        stripped = line.strip()
        if not stripped or stripped.startswith("--"):
            continue
        current.append(line)
        if stripped.rstrip(";").endswith(";") and not stripped.startswith("CREATE OR REPLACE"):
            # Only split on standalone semicolons, not inside function bodies
            pass
        if stripped.endswith(";"):
            current[-1] = current[-1]  # keep as-is

    # Join everything and split by semicolons for execution
    full_sql = "\n".join(current)
    # Simple approach: execute the whole block at once
    # psycopg2 can handle multi-statement strings
    try:
        with conn.cursor() as cur:
            cur.execute(full_sql)
        conn.commit()
        print(f"  ✅ {label}")
    except Exception as e:
        conn.rollback()
        print(f"  ❌ {label}: {e}")
        raise


def execute_sql_block(conn, sql: str, label: str) -> None:
    """Execute a full SQL block, handling multi-statement strings."""
    try:
        with conn.cursor() as cur:
            cur.execute(sql)
        conn.commit()
        print(f"  ✅ {label}")
    except Exception as e:
        conn.rollback()
        error_msg = str(e).strip()
        # Some errors are expected (IF NOT EXISTS, idempotent operations)
        if "already exists" in error_msg and "IF NOT EXISTS" in sql:
            print(f"  ⚠️  {label} — already exists (skipped)")
        elif "duplicate key" in error_msg.lower():
            print(f"  ⚠️  {label} — duplicate data (skipped)")
        else:
            print(f"  ❌ {label}: {error_msg}")
            raise


def main():
    db_url = os.getenv("POSTGRES_URL_NON_POOLING") or DEFAULT_DB_URL

    print("🔌 Conectando a Supabase PostgreSQL...")
    print(f"   Host: {db_url.split('@')[1].split(':')[0]}")
    print()

    try:
        conn = psycopg2.connect(db_url)
        conn.autocommit = False
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        sys.exit(1)

    print("📦 Conexión exitosa\n")

    migration_files = get_migration_files()

    # Check which migrations have already been applied using a tracking table
    with conn.cursor() as cur:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS _migrations_log (
                filename TEXT PRIMARY KEY,
                applied_at TIMESTAMPTZ DEFAULT NOW()
            )
        """)
    conn.commit()

    with conn.cursor() as cur:
        cur.execute("SELECT filename FROM _migrations_log")
        applied = {row[0] for row in cur.fetchall()}

    pending = [f for f in migration_files if f.name not in applied]

    if not pending:
        print("✅ Todas las migraciones ya fueron aplicadas.")
        conn.close()
        return

    print(f"📋 {len(pending)} migraciones pendientes de {len(migration_files)} totales:\n")

    for mf in pending:
        print(f"▶️  {mf.name}")
        sql = mf.read_text(encoding="utf-8")
        try:
            execute_sql_block(conn, sql, mf.name)
            # Record the migration
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO _migrations_log (filename) VALUES (%s)",
                    (mf.name,),
                )
            conn.commit()
        except Exception:
            print(f"\n❌ Migración {mf.name} falló. Se detiene el proceso.")
            print("   Revisá el error arriba y corregilo antes de reintentar.")
            conn.close()
            sys.exit(1)

    print(f"\n🎉 {len(pending)} migraciones aplicadas correctamente.")

    # Verify tables exist
    print("\n🔍 Verificando tablas creadas...")
    with conn.cursor() as cur:
        cur.execute("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name
        """)
        tables = [row[0] for row in cur.fetchall()]

    expected = [
        "certifications",
        "contact_messages",
        "education",
        "experience",
        "project_technologies",
        "projects",
        "technologies",
    ]
    for t in expected:
        if t in tables:
            print(f"  ✅ {t}")
        else:
            print(f"  ❌ {t} — NO ENCONTRADA")

    conn.close()
    print("\n✨ Listo.")


if __name__ == "__main__":
    main()
