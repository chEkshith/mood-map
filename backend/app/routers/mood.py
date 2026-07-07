import uuid
from datetime import datetime, timedelta, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Request, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.db import get_db
from app.logger import get_logger
from app.middleware.auth_middleware import get_current_user
from app.schemas.mood import (
    APIResponse,
    HistoryEntry,
    MoodEnum,
    MoodRequest,
    MoodResult,
    StatsResponse,
)
from app.services.classifier import MoodClassifier
from app.services.cloudinary_service import cache_place_photo
from app.services.history import HistoryService
from app.services.mood_logic import resolve_place_types
from app.services.places import GooglePlacesService

logger = get_logger("mood_router")
router = APIRouter(prefix="/mood", tags=["mood"])
limiter = Limiter(key_func=get_remote_address)

classifier = MoodClassifier()
places_svc = GooglePlacesService()
history_svc = HistoryService()


async def _update_streak(user: dict, db: AsyncIOMotorDatabase) -> None:
    now = datetime.now(timezone.utc)
    last_login_entry = await db.mood_entries.find_one(
        {"user_id": user["_id"]}, sort=[("created_at", -1)]
    )

    new_streak = user.get("mood_streak", 0)
    if last_login_entry is None:
        new_streak = 1
    else:
        last_created = last_login_entry["created_at"]
        if last_created.tzinfo is None:
            last_created = last_created.replace(tzinfo=timezone.utc)
        delta_days = (now.date() - last_created.date()).days
        if delta_days == 0:
            new_streak = user.get("mood_streak", 1)
        elif delta_days == 1:
            new_streak = user.get("mood_streak", 0) + 1
        else:
            new_streak = 1

    await db.users.update_one(
        {"_id": user["_id"]},
        {"$inc": {"total_entries": 1}, "$set": {"mood_streak": new_streak}},
    )


@router.post("/places", response_model=APIResponse)
@limiter.limit("15/minute")
async def submit_mood(
    request: Request,
    payload: MoodRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    mood, confidence = await classifier.classify(payload.raw_text)
    place_types, strategy, why = resolve_place_types(mood)

    places = await places_svc.search_nearby(
        payload.latitude, payload.longitude, place_types, payload.radius_meters, why
    )

    for place in places:
        if place.photo_reference and not place.place_id.startswith("fallback_"):
            try:
                cached_url = await cache_place_photo(place.photo_reference, place.place_id)
                if cached_url:
                    place.photo_url = cached_url
            except Exception as exc:  # noqa: BLE001
                logger.error(f"Photo caching failed for {place.place_id}: {exc}")
        place.photo_reference = None

    await history_svc.log(
        str(current_user["_id"]), payload, mood, confidence, strategy, places, db
    )

    await _update_streak(current_user, db)

    return APIResponse(
        mood=MoodResult(classified_mood=mood, confidence=confidence, strategy=strategy),
        places=places,
        total_results=len(places),
        request_id=str(uuid.uuid4()),
    )


@router.get("/history", response_model=list[HistoryEntry])
@limiter.limit("30/minute")
async def get_history(
    request: Request,
    limit: int = 20,
    skip: int = 0,
    mood_filter: MoodEnum | None = None,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    entries = await history_svc.get_history(
        str(current_user["_id"]), db, limit=limit, skip=skip, mood_filter=mood_filter
    )
    return entries


@router.get("/history/{entry_id}")
async def get_history_entry(
    entry_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    entry = await history_svc.get_entry(str(current_user["_id"]), entry_id, db)
    if entry is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    return entry


@router.get("/stats", response_model=StatsResponse)
async def get_stats(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    stats = await history_svc.get_stats(str(current_user["_id"]), db)
    return stats


@router.delete("/history/{entry_id}")
async def delete_history_entry(
    entry_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    deleted = await history_svc.delete_entry(str(current_user["_id"]), entry_id, db)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    return {"message": "deleted"}
