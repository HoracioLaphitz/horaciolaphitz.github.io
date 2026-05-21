from pydantic import BaseModel, EmailStr, Field


class ContactMessageSchema(BaseModel):
    """Schema for contact form submission."""

    name: str = Field(..., min_length=2, max_length=100, description="Sender's name")
    email: EmailStr = Field(..., description="Sender's email address")
    message: str = Field(
        ..., min_length=10, max_length=5000, description="Contact message"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Juan Pérez",
                "email": "juan@example.com",
                "message": "Me interesa colaborar en tu próximo proyecto...",
            }
        }


class ContactResponseSchema(BaseModel):
    """Response schema for contact message submission."""

    success: bool = Field(..., description="Whether the message was sent successfully")
    message: str = Field(..., description="Response message")

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "message": "Tu mensaje ha sido recibido. Te contactaremos pronto.",
            }
        }
