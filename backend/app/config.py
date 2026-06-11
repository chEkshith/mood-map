from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables / .env file."""

    groq_api_key: str = ""
    google_places_api_key: str = ""
    database_url: str = "sqlite+aiosqlite:///./moodmap.db"
    ai_backend: str = "groq"

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
    }


@lru_cache
def get_settings() -> Settings:
    return Settings()
