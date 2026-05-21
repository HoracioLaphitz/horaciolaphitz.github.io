"""
Script to seed initial data into Supabase
Run: python -m scripts.seed_data
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from api.core.database import supabase


def seed_technologies():
    """Seed technologies table"""
    technologies = [
        {"name": "Python", "slug": "python", "category": "language"},
        {"name": "TypeScript", "slug": "typescript", "category": "language"},
        {"name": "React", "slug": "react", "category": "framework"},
        {"name": "FastAPI", "slug": "fastapi", "category": "framework"},
        {"name": "Astro", "slug": "astro", "category": "framework"},
        {"name": "PostgreSQL", "slug": "postgresql", "category": "database"},
        {"name": "Supabase", "slug": "supabase", "category": "platform"},
        {"name": "TailwindCSS", "slug": "tailwindcss", "category": "styling"},
        {"name": "Pandas", "slug": "pandas", "category": "library"},
        {"name": "Scikit-learn", "slug": "scikit-learn", "category": "library"},
    ]
    
    print("🌱 Seeding technologies...")
    for tech in technologies:
        try:
            result = supabase.table("technologies").upsert(
                tech, on_conflict="slug"
            ).execute()
            print(f"  ✅ {tech['name']}")
        except Exception as e:
            print(f"  ❌ {tech['name']}: {e}")


def seed_projects():
    """Seed projects table"""
    projects = [
        {
            "slug": "portfolio-profesional-2026",
            "title": "Portfolio Profesional Full Stack",
            "description": "Portfolio moderno con arquitectura híbrida Astro + FastAPI, diseño dual-theme y backend serverless sobre Supabase.",
            "category": "Web Development",
            "status": "in-progress",
            "featured": True,
            "assets": []
        },
        {
            "slug": "ml-classification-model",
            "title": "Modelo de Clasificación ML",
            "description": "Sistema de clasificación con Scikit-learn y análisis exploratorio de datos.",
            "category": "Machine Learning",
            "status": "completed",
            "featured": True,
            "assets": []
        },
        {
            "slug": "data-visualization-dashboard",
            "title": "Dashboard de Visualización de Datos",
            "description": "Dashboard interactivo con Plotly y Streamlit para análisis de datos en tiempo real.",
            "category": "Data Visualization",
            "status": "completed",
            "featured": False,
            "assets": []
        }
    ]
    
    print("\n🌱 Seeding projects...")
    for project in projects:
        try:
            result = supabase.table("projects").upsert(
                project, on_conflict="slug"
            ).execute()
            print(f"  ✅ {project['title']}")
        except Exception as e:
            print(f"  ❌ {project['title']}: {e}")


def seed_experience():
    """Seed experience table"""
    experiences = [
        {
            "company": "Tech Company",
            "role": "Senior Full Stack Developer",
            "start_date": "2020-01-01",
            "end_date": None,
            "description": "Desarrollo de aplicaciones web modernas con React, TypeScript y Python.",
            "achievements": [
                "Implementación de arquitectura Clean Architecture",
                "Reducción de tiempo de carga en 40%",
                "Liderazgo de equipo de 5 desarrolladores"
            ]
        },
        {
            "company": "Data Analytics Firm",
            "role": "Data Scientist",
            "start_date": "2018-06-01",
            "end_date": "2019-12-31",
            "description": "Análisis de datos y desarrollo de modelos de Machine Learning.",
            "achievements": [
                "Desarrollo de modelos predictivos con 95% accuracy",
                "Automatización de pipelines ETL",
                "Visualización de datos con Tableau y Python"
            ]
        }
    ]
    
    print("\n🌱 Seeding experience...")
    for exp in experiences:
        try:
            result = supabase.table("experience").insert(exp).execute()
            print(f"  ✅ {exp['role']} at {exp['company']}")
        except Exception as e:
            print(f"  ❌ {exp['role']}: {e}")


def link_project_technologies():
    """Link projects with technologies"""
    print("\n🔗 Linking projects with technologies...")
    
    # Get all projects and technologies
    projects = supabase.table("projects").select("id, slug").execute()
    technologies = supabase.table("technologies").select("id, slug").execute()
    
    tech_map = {tech["slug"]: tech["id"] for tech in technologies.data}
    project_map = {proj["slug"]: proj["id"] for proj in projects.data}
    
    links = [
        {
            "project_slug": "portfolio-profesional-2026",
            "tech_slugs": ["typescript", "react", "astro", "fastapi", "python", "postgresql", "supabase", "tailwindcss"]
        },
        {
            "project_slug": "ml-classification-model",
            "tech_slugs": ["python", "scikit-learn", "pandas"]
        },
        {
            "project_slug": "data-visualization-dashboard",
            "tech_slugs": ["python", "pandas"]
        }
    ]
    
    for link in links:
        project_id = project_map.get(link["project_slug"])
        if not project_id:
            continue
            
        for tech_slug in link["tech_slugs"]:
            tech_id = tech_map.get(tech_slug)
            if not tech_id:
                continue
                
            try:
                supabase.table("project_technologies").upsert({
                    "project_id": project_id,
                    "technology_id": tech_id
                }, on_conflict="project_id,technology_id").execute()
                print(f"  ✅ {link['project_slug']} <-> {tech_slug}")
            except Exception as e:
                print(f"  ❌ {link['project_slug']} <-> {tech_slug}: {e}")


def main():
    """Run all seed functions"""
    print("🚀 Starting database seeding...\n")
    
    seed_technologies()
    seed_projects()
    seed_experience()
    link_project_technologies()
    
    print("\n✅ Database seeding completed!")


if __name__ == "__main__":
    main()
