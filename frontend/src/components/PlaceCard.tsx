import { MapPin, Navigation, Star } from "lucide-react";
import { useMoodStore } from "../store/moodStore";
import type { PlaceSuggestion } from "../types";

interface Props {
  place: PlaceSuggestion;
}

function formatDistance(meters: number | null): string {
  if (meters === null) return "";
  if (meters < 1000) return `${meters}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

const STRATEGY_BADGE: Record<string, { label: string; color: string }> = {
  reset: { label: "Reset", color: "bg-blue-500/15 text-blue-300 border-blue-500/20" },
  shift: { label: "Shift", color: "bg-amber-500/15 text-amber-300 border-amber-500/20" },
  match: { label: "Match", color: "bg-green-500/15 text-green-300 border-green-500/20" },
};

export function PlaceCard({ place }: Props) {
  const selectPlace = useMoodStore((s) => s.selectPlace);
  const selectedPlace = useMoodStore((s) => s.selectedPlace);
  const isSelected = selectedPlace?.place_id === place.place_id;

  const firstType = place.place_types[0]?.replace(/_/g, " ") ?? "Place";
  const strategy = STRATEGY_BADGE[
    (useMoodStore.getState().currentMood?.strategy ?? "match") as string
  ] ?? STRATEGY_BADGE.match;

  return (
    <button
      onClick={() => selectPlace(place)}
      className={`w-full text-left card-hover p-4 cursor-pointer group ${
        isSelected ? "border-violet-300/50 bg-violet-400/10 ring-1 ring-violet-300/30" : ""
      }`}
    >
      {/* Photo or placeholder */}
      <div className="h-28 rounded-xl overflow-hidden mb-3 bg-white/5 relative ring-1 ring-white/10">
        {place.photo_url ? (
          <img
            src={place.photo_url}
            alt={place.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/[0.02]">
            <MapPin className="h-8 w-8 text-white/25" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        {isSelected && (
          <div className="absolute top-2 right-2">
            <span className="h-5 w-5 rounded-full bg-gradient-to-br from-violet-400 to-sky-400 flex items-center justify-center shadow-lg ring-1 ring-white/40">
              <span className="h-2 w-2 rounded-full bg-white" />
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-white leading-tight line-clamp-1 tracking-tight">{place.name}</h3>
        <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold border backdrop-blur-md ${strategy.color}`}>
          {strategy.label}
        </span>
      </div>

      <p className="text-[11px] text-white/40 capitalize mb-2">{firstType}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {place.rating !== null && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
              <span className="text-xs font-medium text-white/70">{place.rating.toFixed(1)}</span>
            </div>
          )}
          {place.distance_meters !== null && (
            <div className="flex items-center gap-1 text-white/40">
              <Navigation className="h-3 w-3" />
              <span className="text-xs">{formatDistance(place.distance_meters)}</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
