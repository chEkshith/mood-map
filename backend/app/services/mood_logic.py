from app.schemas.mood import MoodEnum

MOOD_TO_PLACE_STRATEGY: dict[MoodEnum, dict] = {
    MoodEnum.stressed: {
        "strategy": "reset",
        "place_types": ["park", "spa", "library", "yoga_studio"],
        "why": "calm, low-stimulation spaces for decompression",
    },
    MoodEnum.anxious: {
        "strategy": "shift",
        "place_types": ["cafe", "bookstore", "aquarium", "botanical_garden"],
        "why": "gentle warmth without overwhelming stimulation",
    },
    MoodEnum.bored: {
        "strategy": "match",
        "place_types": ["museum", "movie_theater", "arcade", "art_gallery"],
        "why": "novelty and engagement to break the flatness",
    },
    MoodEnum.exhausted: {
        "strategy": "reset",
        "place_types": ["park", "spa", "cafe", "library"],
        "why": "restorative, low-energy environments",
    },
    MoodEnum.happy: {
        "strategy": "match",
        "place_types": ["restaurant", "cafe", "park", "art_gallery"],
        "why": "vibrant social spaces to sustain your mood",
    },
    MoodEnum.melancholic: {
        "strategy": "shift",
        "place_types": ["cafe", "bookstore", "park", "museum"],
        "why": "beautiful gentle spaces that honour and lift",
    },
}


def resolve_place_types(mood: MoodEnum) -> tuple[list[str], str, str]:
    entry = MOOD_TO_PLACE_STRATEGY[mood]
    return entry["place_types"], entry["strategy"], entry["why"]
