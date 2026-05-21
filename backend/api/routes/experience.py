from fastapi import APIRouter
from api.schemas.experience import ExperienceSchema
from api.services.experience_service import ExperienceService

router = APIRouter()

@router.get("", response_model=list[ExperienceSchema])
def get_experience():
    return ExperienceService.get_all_experience()
