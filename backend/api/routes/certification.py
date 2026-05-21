from fastapi import APIRouter
from api.schemas.certification import CertificationSchema
from api.services.certification_service import CertificationService

router = APIRouter()

@router.get("", response_model=list[CertificationSchema])
def get_certifications():
    return CertificationService.get_all_certifications()
