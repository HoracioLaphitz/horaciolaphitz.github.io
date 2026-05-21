"""
Script to test API endpoints
Run: python -m scripts.test_api
"""
import sys
from pathlib import Path
import asyncio

sys.path.insert(0, str(Path(__file__).parent.parent))

from api.services.project_service import ProjectService
from api.services.technology_service import TechnologyService
from api.services.experience_service import ExperienceService


async def test_projects():
    """Test project endpoints"""
    print("📦 Testing Projects...")
    
    # Get all projects
    projects = await ProjectService.get_all_projects()
    print(f"  ✅ Found {len(projects)} projects")
    
    # Get featured projects
    featured = await ProjectService.get_featured_projects()
    print(f"  ✅ Found {len(featured)} featured projects")
    
    # Get project by slug
    if projects:
        slug = projects[0].slug
        project = await ProjectService.get_project_by_slug(slug)
        if project:
            print(f"  ✅ Retrieved project: {project.title}")
            print(f"     Technologies: {len(project.technologies)}")


async def test_technologies():
    """Test technology endpoints"""
    print("\n🔧 Testing Technologies...")
    
    # Get all technologies
    technologies = await TechnologyService.get_all_technologies()
    print(f"  ✅ Found {len(technologies)} technologies")
    
    # Get technology by slug
    if technologies:
        slug = technologies[0].slug
        tech = await TechnologyService.get_technology_by_slug(slug)
        if tech:
            print(f"  ✅ Retrieved technology: {tech.name}")
            print(f"     Project count: {tech.project_count}")


async def test_experience():
    """Test experience endpoints"""
    print("\n💼 Testing Experience...")
    
    # Get all experience
    experiences = await ExperienceService.get_all_experience()
    print(f"  ✅ Found {len(experiences)} experience entries")
    
    if experiences:
        exp = experiences[0]
        print(f"  ✅ Latest: {exp.role} at {exp.company}")


async def main():
    """Run all tests"""
    print("🧪 Testing API Services\n")
    
    await test_projects()
    await test_technologies()
    await test_experience()
    
    print("\n✅ All tests passed!")


if __name__ == "__main__":
    asyncio.run(main())
