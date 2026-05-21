from typing import Any, Optional


class PortfolioException(Exception):
    """Base exception for portfolio API."""

    def __init__(
        self,
        message: str,
        status_code: int = 500,
        detail: Optional[dict[str, Any]] = None,
    ):
        self.message = message
        self.status_code = status_code
        self.detail = detail or {}
        super().__init__(self.message)


class ValidationError(PortfolioException):
    """Raised when request validation fails."""

    def __init__(self, message: str, detail: Optional[dict[str, Any]] = None):
        super().__init__(message, status_code=422, detail=detail)


class NotFoundError(PortfolioException):
    """Raised when a resource is not found."""

    def __init__(self, resource: str, identifier: str):
        message = f"{resource} with identifier '{identifier}' not found"
        detail = {"resource": resource, "identifier": identifier}
        super().__init__(message, status_code=404, detail=detail)


class UnauthorizedError(PortfolioException):
    """Raised when authentication fails."""

    def __init__(self, message: str = "Unauthorized"):
        super().__init__(message, status_code=401)


class ForbiddenError(PortfolioException):
    """Raised when authorization fails."""

    def __init__(self, message: str = "Forbidden"):
        super().__init__(message, status_code=403)


class ConflictError(PortfolioException):
    """Raised when a conflict occurs (e.g., duplicate entry)."""

    def __init__(self, message: str, detail: Optional[dict[str, Any]] = None):
        super().__init__(message, status_code=409, detail=detail)
