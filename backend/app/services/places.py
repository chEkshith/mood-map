import math

import httpx

from app.config import settings
from app.logger import get_logger
from app.schemas.mood import PlaceSuggestion

logger = get_logger("places")

PLACES_URL = "https://places.googleapis.com/v1/places:searchNearby"
FIELD_MASK = (
    "places.id,places.displayName,places.formattedAddress,"
    "places.location,places.types,places.rating,places.photos"
)


class GooglePlacesService:
    def __init__(self) -> None:
        self._api_key = settings.google_places_api_key

    async def search_nearby(
        self,
        lat: float,
        lng: float,
        place_types: list[str],
        radius: int,
        why: str,
    ) -> list[PlaceSuggestion]:
        try:
            body = {
                "includedTypes": [place_types[0]],
                "maxResultCount": 6,
                "locationRestriction": {
                    "circle": {
                        "center": {"latitude": lat, "longitude": lng},
                        "radius": radius,
                    }
                },
            }
            headers = {
                "X-Goog-Api-Key": self._api_key,
                "X-Goog-FieldMask": FIELD_MASK,
                "Content-Type": "application/json",
            }

            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(PLACES_URL, json=body, headers=headers)
                response.raise_for_status()
                data = response.json()

            suggestions: list[PlaceSuggestion] = []
            for place in data.get("places", []):
                place_lat = place.get("location", {}).get("latitude")
                place_lng = place.get("location", {}).get("longitude")
                distance = None
                if place_lat is not None and place_lng is not None:
                    distance = self._haversine(lat, lng, place_lat, place_lng)

                photo_name = None
                photos = place.get("photos") or []
                if photos:
                    photo_name = photos[0].get("name")

                suggestions.append(
                    PlaceSuggestion(
                        place_id=place.get("id", ""),
                        name=place.get("displayName", {}).get("text", "Unknown place"),
                        address=place.get("formattedAddress", ""),
                        latitude=place_lat or lat,
                        longitude=place_lng or lng,
                        place_types=place.get("types", []),
                        rating=place.get("rating"),
                        distance_meters=distance,
                        why_suggested=why,
                        photo_url=None,
                        photo_reference=photo_name,
                    )
                )

            suggestions.sort(
                key=lambda p: p.distance_meters if p.distance_meters is not None else 10**9
            )
            return suggestions

        except Exception as exc:  # noqa: BLE001
            logger.error(f"Google Places search failed, returning fallback: {exc}")
            return self._fallback_places(lat, lng, why)

    def _fallback_places(self, lat: float, lng: float, why: str) -> list[PlaceSuggestion]:
        offsets = [(0.003, 0.003), (-0.003, 0.002), (0.001, -0.003)]
        fallback: list[PlaceSuggestion] = []
        for i, (dlat, dlng) in enumerate(offsets):
            flat, flng = lat + dlat, lng + dlng
            fallback.append(
                PlaceSuggestion(
                    place_id=f"fallback_{i}",
                    name=f"Nearby Spot #{i + 1}",
                    address="Address unavailable — showing an approximate nearby location",
                    latitude=flat,
                    longitude=flng,
                    place_types=["point_of_interest"],
                    rating=None,
                    distance_meters=self._haversine(lat, lng, flat, flng),
                    why_suggested=why,
                    photo_url=None,
                )
            )
        return fallback

    @staticmethod
    def _haversine(lat1: float, lng1: float, lat2: float, lng2: float) -> int:
        r = 6371000  # Earth radius in meters
        phi1, phi2 = math.radians(lat1), math.radians(lat2)
        dphi = math.radians(lat2 - lat1)
        dlambda = math.radians(lng2 - lng1)
        a = (
            math.sin(dphi / 2) ** 2
            + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
        )
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return int(r * c)
