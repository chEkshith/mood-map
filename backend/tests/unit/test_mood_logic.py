import pytest

from app.schemas.mood import MoodEnum
from app.services.mood_logic import resolve_place_types


@pytest.mark.parametrize("mood", list(MoodEnum))
def test_resolve_place_types_returns_valid_data(mood: MoodEnum):
    place_types, strategy, why = resolve_place_types(mood)

    assert strategy in {"reset", "shift", "match"}
    assert isinstance(place_types, list)
    assert len(place_types) > 0
    assert all(isinstance(t, str) for t in place_types)
    assert isinstance(why, str)
    assert len(why) > 0


def test_all_moods_are_covered():
    for mood in MoodEnum:
        place_types, strategy, why = resolve_place_types(mood)
        assert place_types
        assert strategy
        assert why


def test_stressed_uses_reset_strategy():
    place_types, strategy, why = resolve_place_types(MoodEnum.stressed)
    assert strategy == "reset"
    assert "park" in place_types


def test_bored_uses_match_strategy():
    place_types, strategy, why = resolve_place_types(MoodEnum.bored)
    assert strategy == "match"
    assert "museum" in place_types
