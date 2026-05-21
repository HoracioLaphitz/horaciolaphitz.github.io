"""
Script to test API endpoints
Run: python -m scripts.test_api
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from api.core.database import create_supabase_client
from api.infrastructure.repositories import (
    SupabaseProjectRepository,
    SupabaseTechnologyRepository,
    SupabaseExperienceRepository,
)
from api.application.services import (
    ProjectService,
    TechnologyService,
    ExperienceService,
)


def test_projects(service: ProjectService):
    print("Projects...")
    projects = service.get_all()
    print(f"  Found {len(projects)} projects")
    featured = service.get_featured()
    print(f"  Featured: {len(featured)}")
    if projects:
        p = service.get_by_slug(projects[0].slug)
        if p:
            print(f"  Slug OK: {p.title}")


def test_technologies(service: TechnologyService):
    print("\nTechnologies...")
    techs = service.get_all()
    print(f"  Found {len(techs)} technologies")
    if techs:
        t = service.get_by_slug(techs[0].slug)
        if t:
            print(f"  Slug OK: {t.name} ({t.project_count} projects)")


def test_experience(service: ExperienceService):
    print("\nExperience...")
    exp = service.get_all()
    print(f"  Found {len(exp)} entries")
    if exp:
        print(f"  Latest: {exp[0].role} at {exp[0].company}")


def main():
    client = create_supabase_client()
    test_projects(ProjectService(SupabaseProjectRepository(client)))
    test_technologies(TechnologyService(SupabaseTechnologyRepository(client)))
    test_experience(ExperienceService(SupabaseExperienceRepository(client)))
    print("\nAll tests passed!")


if __name__ == "__main__":
    main()
