from enum import Enum

from pydantic import BaseModel, Field


class MoodEnum(str, Enum):
    stressed = "stressed"
    anxious = "anxious"
    bored = "bored"
    exhausted = "exhausted"
    happy = "happy"
    melancholic = "melancholic"


class MoodRequest(BaseModel):
    raw_text: str = Field(min_length=2, max_length=500)
    latitude: float
    longitude: float
    radius_meters: int = Field(default=2000, le=10000)


class PlaceSuggestion(BaseModel):
    place_id: str
    name: str
    address: str
    latitude: float
    longitude: float
    place_types: list[str] = Field(default_factory=list)
    rating: float | None = None
    distance_meters: int | None = None
    why_suggested: str
    photo_url: str | None = None
    photo_reference: str | None = None


class MoodResult(BaseModel):
    classified_mood: MoodEnum
    confidence: float
    strategy: str


class APIResponse(BaseModel):
    mood: MoodResult
    places: list[PlaceSuggestion]
    total_results: int
    request_id: str


class HistoryEntry(BaseModel):
    id: str
    raw_text: str
    classified_mood: MoodEnum
    confidence: float
    strategy: str
    latitude: float
    longitude: float
    created_at: str
    places_count: int


class MoodFrequencyItem(BaseModel):
    mood: str
    count: int


class MoodTrendItem(BaseModel):
    date: str
    mood: str
    count: int


class TopPlaceTypeItem(BaseModel):
    type: str
    count: int


class StatsResponse(BaseModel):
    mood_frequency: list[MoodFrequencyItem]
    mood_trend: list[MoodTrendItem]
    top_place_types: list[TopPlaceTypeItem]
    total_entries: int
    mood_streak: int
    most_common_mood: str | None = None
