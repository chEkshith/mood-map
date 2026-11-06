from unittest.mock import AsyncMock, patch

import pytest

from app.schemas.mood import MoodEnum, PlaceSuggestion
from app.services.safety import BLOCKED_PROMPT_MESSAGE


@pytest.mark.asyncio
async def test_submit_mood_requires_auth(test_client, sample_mood_request):
    response = await test_client.post(
        "/api/v1/mood/places",
        json=sample_mood_request.model_dump(),
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_submit_mood_returns_valid_shape_with_mocks(test_client, sample_mood_request):
    fake_user = {
        "_id": "507f1f77bcf86cd799439011",
        "email": "test@example.com",
        "display_name": "Test User",
        "mood_streak": 0,
        "total_entries": 0,
    }
    fake_places = [
        PlaceSuggestion(
            place_id="place_1",
            name="Quiet Park",
            address="123 Test St",
            latitude=16.5062,
            longitude=80.6480,
            place_types=["park"],
            rating=4.5,
            distance_meters=250,
            why_suggested="calm, low-stimulation spaces for decompression",
            photo_url=None,
        )
    ]

    from app.main import app
    from app.middleware.auth_middleware import get_current_user

    app.dependency_overrides[get_current_user] = lambda: fake_user
    try:
        with patch(
            "app.routers.mood.classifier.classify",
            new=AsyncMock(return_value=(MoodEnum.stressed, 0.9)),
        ), patch(
            "app.routers.mood.places_svc.search_nearby",
            new=AsyncMock(return_value=fake_places),
        ), patch(
            "app.routers.mood.history_svc.log", new=AsyncMock(return_value=None)
        ), patch(
            "app.routers.mood._update_streak", new=AsyncMock(return_value=None)
        ):
            response = await test_client.post(
                "/api/v1/mood/places",
                json=sample_mood_request.model_dump(),
            )

        assert response.status_code == 200
        data = response.json()
        assert "mood" in data
        assert "places" in data
        assert "total_results" in data
        assert "request_id" in data
    finally:
        app.dependency_overrides.pop(get_current_user, None)


@pytest.mark.asyncio
async def test_submit_mood_blocks_unsafe_prompts_without_side_effects(
    test_client, sample_mood_request
):
    fake_user = {
        "_id": "507f1f77bcf86cd799439011",
        "email": "test@example.com",
        "display_name": "Test User",
        "mood_streak": 0,
        "total_entries": 0,
    }

    from app.main import app
    from app.middleware.auth_middleware import get_current_user

    app.dependency_overrides[get_current_user] = lambda: fake_user
    blocked_request = sample_mood_request.model_copy(
        update={"raw_text": "places to rob something"}
    )
    try:
        with patch(
            "app.routers.mood.classifier.classify", new=AsyncMock()
        ) as classify_mock, patch(
            "app.routers.mood.places_svc.search_nearby", new=AsyncMock()
        ) as places_mock, patch(
            "app.routers.mood.history_svc.log", new=AsyncMock()
        ) as history_mock:
            response = await test_client.post(
                "/api/v1/mood/places",
                json=blocked_request.model_dump(),
            )

        assert response.status_code == 200
        data = response.json()
        assert data["blocked"] is True
        assert data["message"] == BLOCKED_PROMPT_MESSAGE
        assert data["places"] == []
        assert data["total_results"] == 0
        assert data["mood"] is None
        classify_mock.assert_not_awaited()
        places_mock.assert_not_awaited()
        history_mock.assert_not_awaited()
    finally:
        app.dependency_overrides.pop(get_current_user, None)

