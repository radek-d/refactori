from fastapi import Header, HTTPException, status
from app.core.config import get_settings


async def verify_api_secret(x_api_secret: str = Header(...)) -> None:
    """Validates shared secret between Next.js proxy and FastAPI."""
    settings = get_settings()
    if x_api_secret != settings.backend_api_secret:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid API secret.",
        )
