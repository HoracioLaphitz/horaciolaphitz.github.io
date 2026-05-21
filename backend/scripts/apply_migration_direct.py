"""
Script to apply SQL migration directly using psycopg2
Run: python -m scripts.apply_migration_direct
"""
import sys
from pathlib import Path
import os
from dotenv import load_dotenv

sys.path.insert(0, str(Path(__file__).parent.parent))

# Load environment variables
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)


def read_migration_file():
    """Read the migration SQL file"""
    migration_path = Path(__file__).parent.parent.parent / "supabase" / "migrations" / "001_initial_schema.sql"
    
    if not migration_path.exists():
        print(f"❌ Migration file not found: {migration_path}")
        return None
    
    with open(migration_path, 'r', encoding='utf-8') as f:
        return f.read()


def apply_migration_with_psycopg2():
    """Apply migration using psycopg2"""
    try:
        import psycopg2
    except ImportError:
        print("❌ psycopg2 not installed")
        print("Install with: pip install psycopg2-binary")
        return False
    
    # Get connection string from environment
    postgres_url = os.getenv("POSTGRES_URL")
    
    if not postgres_url:
        print("❌ POSTGRES_URL not found in environment")
        print("Please set POSTGRES_URL in .env file")
        return False
    
    print("📋 Reading migration file...")
    sql = read_migration_file()
    
    if not sql:
        return False
    
    print("🚀 Connecting to database...")
    
    try:
        conn = psycopg2.connect(postgres_url)
        cursor = conn.cursor()
        
        print("📝 Executing migration...")
        cursor.execute(sql)
        conn.commit()
        
        print("✅ Migration applied successfully!")
        
        cursor.close()
        conn.close()
        
        return True
        
    except Exception as e:
        print(f"❌ Error applying migration: {e}")
        return False


def main():
    """Main function"""
    print("🔧 Supabase Migration Tool (Direct)\n")
    
    if not apply_migration_with_psycopg2():
        print("\n⚠️  Migration failed")
        print("\n📝 Manual steps:")
        print("   1. Go to: https://app.supabase.com/project/swmsdgvftvfglcgwezxz/editor")
        print("   2. Copy content from: supabase/migrations/001_initial_schema.sql")
        print("   3. Click 'Run' to execute")
        sys.exit(1)
    
    print("\n✅ Database ready for seeding!")
    print("Run: python -m scripts.seed_data")


if __name__ == "__main__":
    main()
