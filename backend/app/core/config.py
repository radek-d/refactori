from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
import os


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Groq
    groq_api_key: str
    groq_model: str = "llama-3.3-70b-versatile"

    # Supabase
    supabase_url: str
    supabase_service_role_key: str

    # Lemon Squeezy
    lemonsqueezy_api_key: Optional[str] = None
    lemonsqueezy_webhook_secret: Optional[str] = None

    # Security
    backend_api_secret: str = "change-me-in-production"

    @property
    def allowed_origins(self) -> list[str]:
        """Dynamically build allowed origins from env vars"""
        origins = [
            "http://localhost:3000",
            "http://localhost:8000",
        ]
        
        # Add frontend URL if specified (for production)
        frontend_url = os.getenv("FRONTEND_URL")
        if frontend_url:
            origins.append(frontend_url)
        
        # Add any additional origins from comma-separated env var
        extra_origins = os.getenv("ALLOWED_ORIGINS", "")
        if extra_origins:
            origins.extend([o.strip() for o in extra_origins.split(",")])
        
        return origins


@lru_cache
def get_settings() -> Settings:
    return Settings()
