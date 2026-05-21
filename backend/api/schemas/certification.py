from datetime import date, datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class CertificationBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    issuer: str = Field(..., min_length=1, max_length=200)
    issue_date: Optional[date] = None
    period: Optional[str] = None
    certificate_url: Optional[str] = None
    credly_badge_id: Optional[str] = None


class CertificationSchema(CertificationBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CertificationCreateSchema(CertificationBase):
    pass
