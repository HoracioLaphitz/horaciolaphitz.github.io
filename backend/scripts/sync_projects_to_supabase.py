#!/usr/bin/env python3
"""
Script para sincronizar proyectos desde el frontend a Supabase
"""

import json
import sys
from pathlib import Path
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from api.core.database import create_supabase_client

supabase = create_supabase_client()
from api.core.logging import setup_logging, get_logger

setup_logging()
logger = get_logger(__name__)


def slugify(text: str) -> str:
    """Convert text to slug format"""
    import re
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')


def parse_frontmatter(content: str) -> dict:
    """Parse markdown frontmatter"""
    if not content.startswith('---'):
        return {}
    
    parts = content.split('---', 2)
    if len(parts) < 3:
        return {}
    
    frontmatter = {}
    lines = parts[1].strip().split('\n')
    
    for line in lines:
        if ':' not in line:
            continue
        
        key, value = line.split(':', 1)
        key = key.strip()
        value = value.strip()
        
        # Parse arrays
        if value.startswith('[') and value.endswith(']'):
            value = value[1:-1]
            items = [item.strip().strip('"') for item in value.split(',') if item.strip()]
            frontmatter[key] = items
        # Parse booleans
        elif value.lower() in ('true', 'false'):
            frontmatter[key] = value.lower() == 'true'
        # Parse strings
        elif value.startswith('"') and value.endswith('"'):
            frontmatter[key] = value[1:-1]
        else:
            frontmatter[key] = value
    
    return frontmatter


def sync_projects():
    """Sync projects from frontend to Supabase"""
    logger.info("🚀 Iniciando sincronización de proyectos...")
    
    # Path to frontend projects
    frontend_path = Path(__file__).parent.parent.parent / 'frontend'
    projects_dir = frontend_path / 'src' / 'content' / 'proyectos'
    
    if not projects_dir.exists():
        logger.error(f"❌ Directorio de proyectos no encontrado: {projects_dir}")
        return
    
    # Read all markdown files
    project_files = list(projects_dir.glob('*.md'))
    logger.info(f"📁 Encontrados {len(project_files)} archivos de proyectos")
    
    synced_count = 0
    error_count = 0
    
    for project_file in project_files:
        try:
            content = project_file.read_text(encoding='utf-8')
            frontmatter = parse_frontmatter(content)
            
            if not frontmatter:
                logger.warning(f"⚠️  Sin frontmatter: {project_file.name}")
                continue
            
            # Extract slug from filename
            slug = project_file.stem.split('-', 1)[1] if '-' in project_file.stem else project_file.stem
            
            # Prepare project data
            project_data = {
                'slug': slug,
                'title': frontmatter.get('title', slug),
                'description': frontmatter.get('description', ''),
                'category': frontmatter.get('category', 'Otros'),
                'featured': frontmatter.get('featured', False),
                'status': frontmatter.get('status', 'completed'),
                'github_url': frontmatter.get('githubUrl'),
                'demo_url': frontmatter.get('demoUrl'),
                'updated_at': datetime.utcnow().isoformat(),
            }
            
            # Check if project exists
            existing = supabase.table('projects').select('id').eq('slug', slug).execute()
            
            if existing.data:
                # Update existing project
                project_id = existing.data[0]['id']
                supabase.table('projects').update(project_data).eq('id', project_id).execute()
                logger.info(f"   ✅ Actualizado: {slug}")
            else:
                # Insert new project
                project_data['created_at'] = datetime.utcnow().isoformat()
                supabase.table('projects').insert(project_data).execute()
                logger.info(f"   ✅ Creado: {slug}")
            
            synced_count += 1
            
        except Exception as e:
            logger.error(f"   ❌ Error en {project_file.name}: {str(e)}")
            error_count += 1
    
    logger.info(f"\n✨ Sincronización completada:")
    logger.info(f"   - Proyectos sincronizados: {synced_count}")
    logger.info(f"   - Errores: {error_count}")


if __name__ == '__main__':
    try:
        sync_projects()
    except Exception as e:
        logger.error(f"❌ Error fatal: {str(e)}")
        sys.exit(1)
