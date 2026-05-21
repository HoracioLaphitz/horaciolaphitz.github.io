from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from api.core.config import settings
from api.core.logging import setup_logging, get_logger
from api.core.exceptions import PortfolioException
from api.routes import api_router
from api.schemas.common import HealthResponse, ErrorResponse

setup_logging()
logger = get_logger(__name__)

app = FastAPI(
    title="Portfolio API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.exception_handler(PortfolioException)
async def portfolio_exception_handler(request: Request, exc: PortfolioException):
    """Handle custom portfolio exceptions."""
    logger.warning(f"Portfolio exception: {exc.message}", extra={"status": exc.status_code})
    error_response = ErrorResponse(
        error=exc.message,
        detail=exc.detail,
        status=exc.status_code,
    )
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response.model_dump(),
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions."""
    logger.error(f"Unexpected error: {str(exc)}", exc_info=True)
    error_response = ErrorResponse(
        error="Internal server error",
        detail={"message": str(exc)} if settings.is_development else {},
        status=500,
    )
    return JSONResponse(
        status_code=500,
        content=error_response.model_dump(),
    )


@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return HealthResponse(status="healthy", version="1.0.0")


@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Portfolio API v1.0.0"}
