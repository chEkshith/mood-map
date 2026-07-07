from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.config import settings
from app.logger import get_logger

logger = get_logger("db")

_client: AsyncIOMotorClient | None = None
_db: AsyncIOMotorDatabase | None = None


def get_database() -> AsyncIOMotorDatabase:
    if _db is None:
        raise RuntimeError("Database not connected. Call connect_db() first.")
    return _db


async def get_db() -> AsyncIOMotorDatabase:
    return get_database()


async def connect_db() -> None:
    global _client, _db
    _client = AsyncIOMotorClient(settings.mongodb_uri)
    _db = _client[settings.mongodb_db_name]

    try:
        await _db.users.create_index("email", unique=True)
        await _db.mood_entries.create_index([("user_id", 1), ("created_at", -1)])
        await _db.mood_entries.create_index([("location", "2dsphere")])
        await _db.refresh_tokens.create_index("expires_at", expireAfterSeconds=0)
        logger.info("MongoDB indexes ensured")
    except Exception as exc:  # noqa: BLE001
        logger.error(f"Failed to create indexes: {exc}")

    logger.info("Connected to MongoDB")


async def close_db() -> None:
    global _client
    if _client is not None:
        _client.close()
        logger.info("Closed MongoDB connection")
