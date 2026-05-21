from fastapi import APIRouter
from .projects import router as projects_router
from .technologies import router as technologies_router
from .experience import router as experience_router
from .notebooks import router as notebooks_router
from .education import router as education_router
from .certification import router as certification_router
from .contact import router as contact_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(projects_router, prefix="/projects", tags=["projects"])
api_router.include_router(technologies_router, prefix="/technologies", tags=["technologies"])
api_router.include_router(experience_router, prefix="/experience", tags=["experience"])
api_router.include_router(notebooks_router, prefix="/notebooks", tags=["notebooks"])
api_router.include_router(education_router, prefix="/education", tags=["education"])
api_router.include_router(certification_router, prefix="/certifications", tags=["certifications"])
api_router.include_router(contact_router, prefix="/contact", tags=["contact"])

__all__ = ["api_router"]
