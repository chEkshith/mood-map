import asyncio

import cloudinary
import cloudinary.uploader
import httpx

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
    try:
        if photo_name.startswith("http://") or photo_name.startswith("https://"):
            image_bytes = await _download(photo_name)
        else:
            photo_url = (
                f"https://places.googleapis.com/v1/{photo_name}/media"
                f"?maxWidthPx=800&key={settings.google_places_api_key}"
            )
            image_bytes = await _download(photo_url)

        def _upload() -> str:
            result = cloudinary.uploader.upload(
                image_bytes,
                folder="moodmap/places/",
                public_id=f"place_{place_id}",
                overwrite=True,
            )
            return result["secure_url"]

        return await asyncio.to_thread(_upload)
    except Exception as exc:  # noqa: BLE001
        logger.error(f"Place photo caching failed for {place_id}: {exc}")
        return None


async def _download(url: str) -> bytes:
    async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.content
