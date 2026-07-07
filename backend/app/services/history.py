from datetime import datetime, timedelta, timezone

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.logger import get_logger
from app.schemas.mood import MoodEnum, MoodRequest, PlaceSuggestion

logger = get_logger("history")


def _serialize(doc: dict) -> dict:
    doc = dict(doc)
    doc["id"] = str(doc.pop("_id"))
    if "user_id" in doc:
        doc["user_id"] = str(doc["user_id"])
    if isinstance(doc.get("created_at"), datetime):
        doc["created_at"] = doc["created_at"].isoformat()
    return doc


class HistoryService:
    async def log(
        self,
        user_id: str,
        request: MoodRequest,
        mood: MoodEnum,
        confidence: float,
        strategy: str,
        places: list[PlaceSuggestion],
        db: AsyncIOMotorDatabase,
    ) -> None:
        doc = {
            "user_id": ObjectId(user_id),
            "raw_text": request.raw_text,
            "classified_mood": mood.value,
            "confidence": confidence,
            "strategy": strategy,
            "location": {
                "type": "Point",
                "coordinates": [request.longitude, request.latitude],
            },
            "places_suggested": [
                {
                    "place_id": p.place_id,
                    "name": p.name,
                    "rating": p.rating,
                    "place_types": p.place_types,
                    "distance_meters": p.distance_meters,
                }
                for p in places
            ],
            "created_at": datetime.now(timezone.utc),
        }
        await db.mood_entries.insert_one(doc)

    async def get_history(
        self,
        user_id: str,
        db: AsyncIOMotorDatabase,
        limit: int = 20,
        skip: int = 0,
        mood_filter: MoodEnum | None = None,
    ) -> list[dict]:
        query: dict = {"user_id": ObjectId(user_id)}
        if mood_filter is not None:
            query["classified_mood"] = mood_filter.value

        cursor = (
            db.mood_entries.find(query)
            .sort("created_at", -1)
            .skip(skip)
            .limit(limit)
        )
        entries = []
        async for doc in cursor:
            serialized = _serialize(doc)
            serialized["places_count"] = len(doc.get("places_suggested", []))
            serialized["latitude"] = doc.get("location", {}).get("coordinates", [0, 0])[1]
            serialized["longitude"] = doc.get("location", {}).get("coordinates", [0, 0])[0]
            entries.append(serialized)
        return entries

    async def get_entry(self, user_id: str, entry_id: str, db: AsyncIOMotorDatabase) -> dict | None:
        doc = await db.mood_entries.find_one(
            {"_id": ObjectId(entry_id), "user_id": ObjectId(user_id)}
        )
        if doc is None:
            return None
        return _serialize(doc)

    async def delete_entry(self, user_id: str, entry_id: str, db: AsyncIOMotorDatabase) -> bool:
        result = await db.mood_entries.delete_one(
            {"_id": ObjectId(entry_id), "user_id": ObjectId(user_id)}
        )
        return result.deleted_count > 0

    async def get_stats(self, user_id: str, db: AsyncIOMotorDatabase) -> dict:
        uid = ObjectId(user_id)

        mood_frequency_cursor = db.mood_entries.aggregate(
            [
                {"$match": {"user_id": uid}},
                {"$group": {"_id": "$classified_mood", "count": {"$sum": 1}}},
                {"$project": {"_id": 0, "mood": "$_id", "count": 1}},
            ]
        )
        mood_frequency = [doc async for doc in mood_frequency_cursor]

        thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
        mood_trend_cursor = db.mood_entries.aggregate(
            [
                {"$match": {"user_id": uid, "created_at": {"$gte": thirty_days_ago}}},
                {
                    "$group": {
                        "_id": {
                            "date": {
                                "$dateToString": {"format": "%Y-%m-%d", "date": "$created_at"}
                            },
                            "mood": "$classified_mood",
                        },
                        "count": {"$sum": 1},
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "date": "$_id.date",
                        "mood": "$_id.mood",
                        "count": 1,
                    }
                },
                {"$sort": {"date": 1}},
            ]
        )
        mood_trend = [doc async for doc in mood_trend_cursor]

        top_place_types_cursor = db.mood_entries.aggregate(
            [
                {"$match": {"user_id": uid}},
                {"$unwind": "$places_suggested"},
                {"$unwind": "$places_suggested.place_types"},
                {
                    "$group": {
                        "_id": "$places_suggested.place_types",
                        "count": {"$sum": 1},
                    }
                },
                {"$sort": {"count": -1}},
                {"$limit": 5},
                {"$project": {"_id": 0, "type": "$_id", "count": 1}},
            ]
        )
        top_place_types = [doc async for doc in top_place_types_cursor]

        user = await db.users.find_one({"_id": uid})
        total_entries = user.get("total_entries", 0) if user else 0
        mood_streak = user.get("mood_streak", 0) if user else 0

        most_common_mood = None
        if mood_frequency:
            most_common_mood = max(mood_frequency, key=lambda x: x["count"])["mood"]

        return {
            "mood_frequency": mood_frequency,
            "mood_trend": mood_trend,
            "top_place_types": top_place_types,
            "total_entries": total_entries,
            "mood_streak": mood_streak,
            "most_common_mood": most_common_mood,
        }
