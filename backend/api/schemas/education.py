from datetime import date, datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class EducationBase(BaseModel):
    institution: str = Field(..., min_length=1, max_length=200)
    degree: str = Field(..., min_length=1, max_length=200)
    location: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    period: Optional[str] = None


class EducationSchema(EducationBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class EducationCreateSchema(EducationBase):
    pass
