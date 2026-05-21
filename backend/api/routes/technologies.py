from fastapi import APIRouter
from api.core.exceptions import NotFoundError
from api.schemas.technology import TechnologySchema
from api.services.technology_service import TechnologyService

router = APIRouter()

@router.get("", response_model=list[TechnologySchema])
def get_technologies():
    return TechnologyService.get_all_technologies()

@router.get("/{slug}", response_model=TechnologySchema)
def get_technology_by_slug(slug: str):
    technology = TechnologyService.get_technology_by_slug(slug)
    if not technology:
        raise NotFoundError("Technology", slug)
    return technology
