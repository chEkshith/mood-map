import certifi
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.config import settings
from app.logger import get_logger

logger = get_logger("db")

_client: AsyncIOMotorClient | None = None
_db: AsyncIOMotorDatabase | None = None


def _uses_tls(uri: str) -> bool:
    lower = uri.lower()
    return lower.startswith("mongodb+srv://") or "tls=true" in lower or "ssl=true" in lower


def get_database() -> AsyncIOMotorDatabase:
    if _db is None:
        raise RuntimeError("Database not connected. Call connect_db() first.")
    return _db


async def get_db() -> AsyncIOMotorDatabase:
    return get_database()


async def connect_db() -> None:
    global _client, _db
    client_kwargs: dict = {
        "serverSelectionTimeoutMS": 5000,
        "connectTimeoutMS": 10000,
        "socketTimeoutMS": 20000,
    }
    if _uses_tls(settings.mongodb_uri):
        client_kwargs["tlsCAFile"] = certifi.where()

    _client = AsyncIOMotorClient(settings.mongodb_uri, **client_kwargs)
    _db = _client[settings.mongodb_db_name]

    try:
        await _client.admin.command("ping")
        logger.info("Connected to MongoDB")
    except Exception as exc:  # noqa: BLE001
        logger.error(
            "Could not reach MongoDB. If you are using MongoDB Atlas, add your "
            f"current public IP to Network Access (IP Access List). Details: {exc}"
        )
        return

    try:
        await _db.users.create_index("email", unique=True)
        await _db.mood_entries.create_index([("user_id", 1), ("created_at", -1)])
        await _db.mood_entries.create_index([("location", "2dsphere")])
        await _db.refresh_tokens.create_index("expires_at", expireAfterSeconds=0)
        logger.info("MongoDB indexes ensured")
    except Exception as exc:  # noqa: BLE001
        logger.error(f"Failed to create indexes: {exc}")


async def close_db() -> None:
    global _client
    if _client is not None:
        _client.close()
        logger.info("Closed MongoDB connection")
