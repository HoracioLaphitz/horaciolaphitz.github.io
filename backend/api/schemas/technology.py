from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class TechnologyBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    slug: str = Field(..., min_length=1, max_length=100)
    icon_url: Optional[str] = None
    category: Optional[str] = None


class TechnologySchema(TechnologyBase):
    id: UUID
    created_at: datetime
    project_count: int = Field(default=0)

    class Config:
        from_attributes = True


class TechnologyCreateSchema(TechnologyBase):
    pass
