#!/usr/bin/env python3
"""
Script to ingest projects from Astro content collection into Supabase.
Reads markdown files from frontend/src/content/proyectos/ and inserts them into the database.
"""

import os
import re
import sys
from pathlib import Path
from typing import Dict, List, Optional, Any
import asyncio

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: SUPABASE_URL and SUPABASE_SERVICE_KEY/SUPABASE_ANON_KEY must be set")
    sys.exit(1)

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Path to content collection
CONTENT_DIR = Path(__file__).parent.parent.parent / "frontend" / "src" / "content" / "proyectos"


def parse_frontmatter(content: str) -> tuple[Dict[str, Any], str]:
    """Parse YAML frontmatter from markdown content."""
    if not content.startswith("---"):
        return {}, content
    
    parts = content.split("---", 2)
    if len(parts) < 3:
        return {}, content
    
    frontmatter_text = parts[1].strip()
    body = parts[2].strip()
    
    # Simple YAML parser (handles basic cases)
    frontmatter = {}
    current_key = None
    
    for line in frontmatter_text.split("\n"):
        line = line.strip()
        if not line:
            continue
        
        # Handle key-value pairs
        if ":" in line and not line.startswith("-"):
            key, value = line.split(":", 1)
            key = key.strip()
            value = value.strip()
            
            # Remove quotes
            if value.startswith('"') and value.endswith('"'):
                value = value[1:-1]
            elif value.startswith("'") and value.endswith("'"):
                value = value[1:-1]
            
            # Handle arrays
            if value.startswith("[") and value.endswith("]"):
                # Parse array
                array_content = value[1:-1]
                if array_content:
                    items = [item.strip().strip('"').strip("'") for item in array_content.split(",")]
                    frontmatter[key] = items
                else:
                    frontmatter[key] = []
            # Handle booleans
            elif value.lower() in ("true", "false"):
                frontmatter[key] = value.lower() == "true"
            # Handle numbers
            elif value.isdigit():
                frontmatter[key] = int(value)
            else:
                frontmatter[key] = value
            
            current_key = key
    
    return frontmatter, body


def extract_highlights_from_body(body: str) -> List[str]:
    """Extract highlights from markdown body."""
    highlights = []
    
    # Look for bullet points under "Características" or "Highlights" sections
    in_highlights_section = False
    
    for line in body.split("\n"):
        line = line.strip()
        
        # Check if we're entering a highlights section
        if re.match(r"^#{1,3}\s+(Características|Highlights|Features)", line, re.IGNORECASE):
            in_highlights_section = True
            continue
        
        # Check if we're leaving the section
        if in_highlights_section and line.startswith("#"):
            in_highlights_section = False
        
        # Extract bullet points
        if in_highlights_section and line.startswith("-"):
            highlight = line[1:].strip()
            if highlight:
                highlights.append(highlight)
    
    return highlights


def slugify(text: str) -> str:
    """Convert text to slug."""
    text = text.lower()
    text = re.sub(r'[áàäâ]', 'a', text)
    text = re.sub(r'[éèëê]', 'e', text)
    text = re.sub(r'[íìïî]', 'i', text)
    text = re.sub(r'[óòöô]', 'o', text)
    text = re.sub(r'[úùüû]', 'u', text)
    text = re.sub(r'[ñ]', 'n', text)
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = re.sub(r'^-+|-+$', '', text)
    return text


async def get_or_create_technology(name: str) -> Optional[str]:
    """Get or create a technology and return its ID."""
    slug = slugify(name)
    
    # Check if exists
    result = supabase.table("technologies").select("id").eq("slug", slug).execute()
    
    if result.data:
        return result.data[0]["id"]
    
    # Create new
    try:
        result = supabase.table("technologies").insert({
            "name": name,
            "slug": slug,
        }).execute()
        
        if result.data:
            return result.data[0]["id"]
    except Exception as e:
        print(f"   ⚠️  Warning: Could not create technology '{name}': {e}")
    
    return None


async def ingest_project(file_path: Path) -> bool:
    """Ingest a single project from markdown file."""
    try:
        content = file_path.read_text(encoding="utf-8")
        frontmatter, body = parse_frontmatter(content)
        
        if not frontmatter:
            print(f"   ⚠️  Skipping {file_path.name}: No frontmatter found")
            return False
        
        # Extract data
        title = frontmatter.get("title", "")
        slug = slugify(title)
        description = frontmatter.get("description", "")
        category = frontmatter.get("category", "Otros")
        status = frontmatter.get("status", "completed")
        featured = frontmatter.get("featured", False)
        technologies = frontmatter.get("technologies", [])
        github_url = frontmatter.get("githubUrl")
        demo_url = frontmatter.get("demoUrl")
        
        # Extract highlights from body
        highlights = extract_highlights_from_body(body)
        
        # Extract PDF info from body
        pdf_url = None
        pdf_size = None
        pdf_match = re.search(r'\[Descargar PDF\]\(([^)]+)\)(?:\s*\(([^)]+)\))?', body)
        if pdf_match:
            pdf_url = pdf_match.group(1)
            pdf_size = pdf_match.group(2) if pdf_match.group(2) else None
        
        # Check if project already exists
        existing = supabase.table("projects").select("id").eq("slug", slug).execute()
        
        project_data = {
            "slug": slug,
            "title": title,
            "description": description,
            "long_description": body[:500] if len(body) > 500 else body,
            "category": category,
            "status": status,
            "featured": featured,
            "highlights": highlights,
            "github_url": github_url,
            "demo_url": demo_url,
            "pdf_url": pdf_url,
            "pdf_size": pdf_size,
        }
        
        if existing.data:
            # Update existing project
            project_id = existing.data[0]["id"]
            supabase.table("projects").update(project_data).eq("id", project_id).execute()
            print(f"   ✅ Updated: {title}")
        else:
            # Insert new project
            result = supabase.table("projects").insert(project_data).execute()
            project_id = result.data[0]["id"]
            print(f"   ✅ Inserted: {title}")
        
        # Handle technologies
        if technologies:
            # Delete existing relationships
            supabase.table("project_technologies").delete().eq("project_id", project_id).execute()
            
            # Create new relationships
            for tech_name in technologies:
                tech_id = await get_or_create_technology(tech_name)
                if tech_id:
                    try:
                        supabase.table("project_technologies").insert({
                            "project_id": project_id,
                            "technology_id": tech_id,
                        }).execute()
                    except Exception as e:
                        print(f"      ⚠️  Warning: Could not link technology '{tech_name}': {e}")
        
        return True
        
    except Exception as e:
        print(f"   ❌ Error processing {file_path.name}: {e}")
        return False


async def main():
    """Main execution."""
    print("🚀 Ingesting projects from content collection to Supabase...\n")
    
    if not CONTENT_DIR.exists():
        print(f"❌ Error: Content directory not found: {CONTENT_DIR}")
        sys.exit(1)
    
    # Get all markdown files
    md_files = sorted(CONTENT_DIR.glob("*.md"))
    
    if not md_files:
        print(f"⚠️  No markdown files found in {CONTENT_DIR}")
        sys.exit(0)
    
    print(f"📁 Found {len(md_files)} project files\n")
    
    success_count = 0
    error_count = 0
    
    for md_file in md_files:
        print(f"⚙️  Processing: {md_file.name}")
        success = await ingest_project(md_file)
        
        if success:
            success_count += 1
        else:
            error_count += 1
    
    print(f"\n✨ Ingestion completed:")
    print(f"   - Successfully processed: {success_count}")
    print(f"   - Errors: {error_count}")


if __name__ == "__main__":
    asyncio.run(main())
