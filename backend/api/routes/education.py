from fastapi import APIRouter
from api.schemas.education import EducationSchema
from api.services.education_service import EducationService

router = APIRouter()

@router.get("", response_model=list[EducationSchema])
def get_education():
    return EducationService.get_all_education()
