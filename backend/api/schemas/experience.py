from datetime import date, datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class ExperienceBase(BaseModel):
    company: str = Field(..., min_length=1, max_length=200)
    role: str = Field(..., min_length=1, max_length=200)
    start_date: date
    end_date: Optional[date] = None
    description: Optional[str] = None
    achievements: list[str] = Field(default_factory=list)
    location: Optional[str] = None
    type: str = Field(default="professional")


class ExperienceSchema(ExperienceBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ExperienceCreateSchema(ExperienceBase):
    pass
