"""
Script to apply SQL migration directly to Supabase
Run: python -m scripts.apply_migration
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from api.core.database import supabase


def read_migration_file():
    """Read the migration SQL file"""
    migration_path = Path(__file__).parent.parent.parent / "supabase" / "migrations" / "001_initial_schema.sql"
    
    if not migration_path.exists():
        print(f"❌ Migration file not found: {migration_path}")
        return None
    
    with open(migration_path, 'r', encoding='utf-8') as f:
        return f.read()


def apply_migration():
    """Apply migration using Supabase SQL execution"""
    print("📋 Reading migration file...")
    sql = read_migration_file()
    
    if not sql:
        return False
    
    print("🚀 Applying migration to Supabase...")
    
    try:
        # Execute SQL using Supabase RPC or direct SQL
        # Note: Supabase Python client doesn't have direct SQL execution
        # We need to use the REST API or psycopg2
        print("⚠️  Direct SQL execution not available in Supabase Python client")
        print("📝 Please apply migration manually:")
        print("   1. Go to Supabase Dashboard > SQL Editor")
        print("   2. Copy content from: supabase/migrations/001_initial_schema.sql")
        print("   3. Execute the SQL")
        print("\n   OR use Supabase CLI:")
        print("   supabase db push")
        
        return False
        
    except Exception as e:
        print(f"❌ Error applying migration: {e}")
        return False


def main():
    """Main function"""
    print("🔧 Supabase Migration Tool\n")
    
    if not apply_migration():
        print("\n⚠️  Migration not applied automatically")
        print("Please apply manually via Supabase Dashboard")
        sys.exit(1)
    
    print("\n✅ Migration applied successfully!")


if __name__ == "__main__":
    main()
