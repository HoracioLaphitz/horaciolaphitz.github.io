from typing import Any, Optional
from pydantic import BaseModel, Field


class ErrorResponse(BaseModel):
    """Standardized error response format."""

    error: str = Field(..., description="Error type or title")
    detail: dict[str, Any] = Field(
        default_factory=dict, description="Additional error details"
    )
    status: int = Field(..., description="HTTP status code")


class PaginatedResponse(BaseModel):
    """Standardized paginated response format."""

    items: list[Any] = Field(..., description="List of items")
    total: int = Field(..., description="Total number of items")
    skip: int = Field(default=0, description="Number of items skipped")
    take: int = Field(default=10, description="Number of items taken")

    @property
    def has_more(self) -> bool:
        """Check if there are more items to fetch."""
        return (self.skip + self.take) < self.total


class HealthResponse(BaseModel):
    """Health check response."""

    status: str
    version: str
