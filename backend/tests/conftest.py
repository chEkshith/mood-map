import os
from datetime import datetime, timezone

os.environ.setdefault("GROQ_API_KEY", "test_groq_key")
os.environ.setdefault("GOOGLE_PLACES_API_KEY", "test_places_key")
os.environ.setdefault("MONGODB_URI", "mongodb://localhost:27017")
os.environ.setdefault("JWT_SECRET_KEY", "test_secret_key_for_pytest_only")
os.environ.setdefault("CLOUDINARY_CLOUD_NAME", "test_cloud")
os.environ.setdefault("CLOUDINARY_API_KEY", "test_key")
os.environ.setdefault("CLOUDINARY_API_SECRET", "test_secret")

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from app.main import app
from app.schemas.mood import MoodRequest


@pytest_asyncio.fixture
async def test_client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        yield client


@pytest.fixture
def mock_db():
    mongomock = pytest.importorskip("mongomock")
    client = mongomock.MongoClient()
    return client["moodmap_test"]


@pytest.fixture
def sample_mood_request() -> MoodRequest:
    return MoodRequest(
        raw_text="I feel completely drained after today",
        latitude=16.5062,
        longitude=80.6480,
        radius_meters=2000,
    )


@pytest.fixture
def sample_user() -> dict:
    return {
        "email": "test@example.com",
        "hashed_password": "$2b$12$examplehashedpasswordvalueabcdefghij",
        "display_name": "Test User",
        "avatar_url": None,
        "created_at": datetime.now(timezone.utc),
        "last_login": None,
        "mood_streak": 0,
        "total_entries": 0,
    }
