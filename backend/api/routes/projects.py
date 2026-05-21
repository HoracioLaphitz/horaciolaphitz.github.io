from typing import Optional
from fastapi import APIRouter, Query
from api.core.exceptions import NotFoundError
from api.core.cache import cache
from api.schemas.project import ProjectSchema, ProjectDetailSchema
from api.services.project_service import ProjectService

router = APIRouter()

@router.get("", response_model=list[ProjectSchema])
def get_projects(
    category: Optional[str] = Query(None, description="Filter by category"),
    featured: Optional[bool] = Query(None, description="Filter by featured status"),
    status: Optional[str] = Query(None, description="Filter by status")
):
    return ProjectService.get_all_projects(category=category, featured=featured, status=status)

@router.get("/featured", response_model=list[ProjectSchema])
def get_featured_projects():
    return ProjectService.get_featured_projects()

@router.get("/{slug}", response_model=ProjectDetailSchema)
def get_project_by_slug(slug: str):
    project = ProjectService.get_project_by_slug(slug)
    if not project:
        raise NotFoundError("Project", slug)
    return project
