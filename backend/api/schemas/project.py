from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class TechnologyBase(BaseModel):
    name: str
    slug: Optional[str] = None
    icon_url: Optional[str] = None


class ProjectBase(BaseModel):
    slug: str = Field(..., min_length=1, max_length=200)
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    long_description: Optional[str] = None
    category: str = Field(..., min_length=1, max_length=100)
    status: str = Field(default="completed")
    featured: bool = Field(default=False)
    highlights: list[str] = Field(default_factory=list)
    technologies: list[str] = Field(default_factory=list)
    assets: list[dict] = Field(default_factory=list)
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    pdf_url: Optional[str] = None
    pdf_size: Optional[str] = None
    thumbnail_url: Optional[str] = None


class ProjectSchema(ProjectBase):
    id: Optional[UUID] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ProjectDetailSchema(ProjectSchema):
    pass


class ProjectCreateSchema(ProjectBase):
    pass
