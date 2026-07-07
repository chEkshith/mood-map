import asyncio

import cloudinary
import cloudinary.uploader

from app.config import settings
from app.logger import get_logger

logger = get_logger("cloudinary_service")

cloudinary.config(
    cloud_name=settings.cloudinary_cloud_name,
    api_key=settings.cloudinary_api_key,
    api_secret=settings.cloudinary_api_secret,
    secure=True,
)


async def upload_avatar(file_bytes: bytes, user_id: str) -> str:
    def _upload() -> str:
        result = cloudinary.uploader.upload(
            file_bytes,
            folder="moodmap/avatars/",
            public_id=f"avatar_{user_id}",
            overwrite=True,
            transformation=[
                {"gravity": "face", "height": 200, "width": 200, "crop": "thumb"},
            ],
        )
        return result["secure_url"]

    try:
        return await asyncio.to_thread(_upload)
    except Exception as exc:  # noqa: BLE001
        logger.error(f"Avatar upload failed: {exc}")
        raise


async def cache_place_photo(photo_name: str, place_id: str) -> str | None:
    def _upload() -> str:
        result = cloudinary.uploader.upload(
            photo_name,
            folder="moodmap/places/",
            public_id=f"place_{place_id}",
            overwrite=False,
        )
        return result["secure_url"]

    try:
        return await asyncio.to_thread(_upload)
    except Exception as exc:  # noqa: BLE001
        logger.error(f"Place photo caching failed for {place_id}: {exc}")
        return None
