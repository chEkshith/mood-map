from app.schemas.mood import PlaceSuggestion
from app.services.places import GooglePlacesService


def _place(place_id: str, place_types: list[str], distance_meters: int) -> PlaceSuggestion:
    return PlaceSuggestion(
        place_id=place_id,
        name=place_id,
        address="Test address",
        latitude=16.5,
        longitude=80.6,
        place_types=place_types,
        distance_meters=distance_meters,
        why_suggested="test",
    )


def test_diversify_returns_a_mix_of_requested_types():
    requested = ["cafe", "book_store", "park", "museum"]
    suggestions = [_place(f"cafe_{i}", ["cafe"], i * 10) for i in range(1, 11)]
    suggestions += [
        _place("book_1", ["book_store"], 800),
        _place("book_2", ["book_store"], 850),
        _place("park_1", ["park"], 900),
        _place("museum_1", ["museum"], 950),
    ]

    result = GooglePlacesService._diversify(suggestions, requested)

    assert len(result) == 6
    assert len({place.place_id for place in result}) == 6
    returned_types = {place_type for place in result for place_type in place.place_types}
    assert {"cafe", "book_store", "park", "museum"} <= returned_types
    distances = [place.distance_meters for place in result]
    assert distances == sorted(distances)


def test_diversify_keeps_small_result_sets_unchanged():
    requested = ["cafe", "book_store"]
    suggestions = [
        _place("cafe_1", ["cafe"], 10),
        _place("book_1", ["book_store"], 20),
    ]

    assert GooglePlacesService._diversify(suggestions, requested) == suggestions


def test_diversify_fills_remaining_slots_when_types_are_missing():
    requested = ["cafe", "book_store", "park"]
    suggestions = [_place(f"cafe_{i}", ["cafe"], i * 10) for i in range(1, 9)]

    result = GooglePlacesService._diversify(suggestions, requested)

    assert len(result) == 6
    assert len({place.place_id for place in result}) == 6
