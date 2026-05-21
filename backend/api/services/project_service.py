from typing import Optional
from api.core.database import supabase
from api.core.cache import cache
from api.schemas.project import ProjectSchema, ProjectDetailSchema
from api.data.projects_data import (
    get_projects_by_category,
    get_featured_projects as get_featured_from_data,
    get_project_by_slug as get_project_slug_from_data,
)


class ProjectService:
    @staticmethod
    @cache(ttl_seconds=300)
    def get_all_projects(
        category: Optional[str] = None,
        featured: Optional[bool] = None,
        status: Optional[str] = None
    ) -> list[ProjectSchema]:
        """Get all projects with optional filters"""
        try:
            # Try to get from Supabase first
            query = supabase.table("projects").select("*")
            
            if category:
                query = query.eq("category", category)
            if featured is not None:
                query = query.eq("featured", featured)
            if status:
                query = query.eq("status", status)
            
            query = query.order("created_at", desc=True)
            response = query.execute()
            
            return [ProjectSchema(**project) for project in response.data]
        except Exception:
            # Fallback to data file
            projects = get_projects_by_category(category)
            
            if featured is not None:
                projects = [p for p in projects if p.get("featured", False) == featured]
            if status:
                projects = [p for p in projects if p.get("status") == status]
            
            return [ProjectSchema(**project) for project in projects]

    @staticmethod
    @cache(ttl_seconds=300)
    def get_project_by_slug(slug: str) -> Optional[ProjectDetailSchema]:
        """Get project detail by slug with technologies"""
        try:
            # Try to get from Supabase first
            response = supabase.table("projects").select(
                "*,project_technologies(technology:technologies(*))"
            ).eq("slug", slug).execute()
            
            if response.data:
                project_data = response.data[0]
                technologies = [
                    rel["technology"] 
                    for rel in project_data.get("project_technologies", [])
                    if rel.get("technology")
                ]
                
                project_data["technologies"] = technologies
                project_data.pop("project_technologies", None)
                
                return ProjectDetailSchema(**project_data)
        except Exception:
            pass
        
        # Fallback to data file
        project_data = get_project_slug_from_data(slug)
        if project_data:
            return ProjectDetailSchema(**project_data)
        
        return None

    @staticmethod
    @cache(ttl_seconds=300)
    def get_featured_projects() -> list[ProjectSchema]:
        """Get featured projects only"""
        try:
            # Try to get from Supabase first
            response = supabase.table("projects").select("*").eq("featured", True).order("created_at", desc=True).execute()
            return [ProjectSchema(**project) for project in response.data]
        except Exception:
            # Fallback to data file
            projects = get_featured_from_data()
            return [ProjectSchema(**project) for project in projects]
