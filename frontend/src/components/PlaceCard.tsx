import { Star } from "lucide-react";
import { useMoodStore } from "../store/moodStore";
import type { PlaceSuggestion } from "../types";

const STRATEGY_STYLES: Record<string, string> = {
  reset: "bg-blue-100 text-blue-700",
  shift: "bg-amber-100 text-amber-700",
  match: "bg-green-100 text-green-700",
};

interface Props {
  place: PlaceSuggestion;
}

export function PlaceCard({ place }: Props) {
  const selectedPlace = useMoodStore((s) => s.selectedPlace);
  const selectPlace = useMoodStore((s) => s.selectPlace);
  const currentMood = useMoodStore((s) => s.currentMood);

  const isSelected = selectedPlace?.place_id === place.place_id;
  const strategy = currentMood?.strategy ?? "match";
  const strategyClass = STRATEGY_STYLES[strategy] ?? "bg-gray-100 text-gray-700";
  const distanceLabel =
    place.distance_meters != null
      ? place.distance_meters >= 1000
        ? `${(place.distance_meters / 1000).toFixed(1)}km`
        : `${place.distance_meters}m`
      : null;

  return (
    <button
      type="button"
      onClick={() => selectPlace(place)}
      className={`w-full text-left bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 border-l-4 ${
        isSelected ? "border-indigo-500 bg-indigo-50" : "border-transparent"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${strategyClass}`}
        >
          {strategy}
        </span>
        {distanceLabel && (
          <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
            {distanceLabel}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 mt-2">
        {place.photo_url && (
          <img
            src={place.photo_url}
            alt={place.name}
            className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
          />
        )}
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{place.name}</h3>
          {place.rating != null && (
            <div className="flex items-center gap-0.5 mt-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.round(place.rating!) ? "fill-amber-400 text-amber-400" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">{place.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>

      <p className="italic text-sm text-gray-500 mt-2">{place.why_suggested}</p>

      <div className="flex flex-wrap gap-1 mt-2">
        {place.place_types.slice(0, 3).map((type) => (
          <span
            key={type}
            className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500 capitalize"
          >
            {type.replace(/_/g, " ")}
          </span>
        ))}
      </div>
    </button>
  );
}
