import { ArrowUpRight, MapPin, Navigation, Star } from "lucide-react";
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
  reset: { label: "Reset", color: "border-blue-400/20 bg-blue-400/15 text-blue-200" },
  shift: { label: "Shift", color: "border-amber-400/20 bg-amber-400/15 text-amber-200" },
  match: { label: "Match", color: "border-emerald-400/20 bg-emerald-400/15 text-emerald-200" },
};

export function PlaceCard({ place }: Props) {
  const selectPlace = useMoodStore((s) => s.selectPlace);
  const selectedPlace = useMoodStore((s) => s.selectedPlace);
  const moodStrategy = useMoodStore((s) => s.currentMood?.strategy ?? "match");
  const isSelected = selectedPlace?.place_id === place.place_id;

  const firstType = place.place_types[0]?.replace(/_/g, " ") ?? "Place";
  const strategy = STRATEGY_BADGE[moodStrategy] ?? STRATEGY_BADGE.match;

  return (
    <button
      onClick={() => selectPlace(place)}
      className={`group flex w-full flex-col overflow-hidden rounded-xl border text-left transition-colors ${
        isSelected
          ? "border-violet-400/50 bg-violet-400/[0.06]"
          : "border-white/10 bg-[#0a0b16]/55 hover:border-white/20 hover:bg-white/[0.04]"
      }`}
    >
      <div className="relative h-32 overflow-hidden bg-white/[0.03]">
        {place.photo_url ? (
          <img
            src={place.photo_url}
            alt={place.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <MapPin className="h-7 w-7 text-white/20" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
        <span
          className={`absolute left-3 top-3 rounded-md border px-2 py-0.5 text-[10px] font-medium backdrop-blur-md ${strategy.color}`}
        >
          {strategy.label}
        </span>
        {isSelected && (
          <span className="absolute right-3 top-3 rounded-md border border-violet-300/30 bg-violet-400/20 px-2 py-0.5 text-[10px] font-medium text-violet-100 backdrop-blur-md">
            Selected
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-medium text-white">{place.name}</h3>
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-white/25 transition-colors group-hover:text-white/60" />
        </div>
        <p className="mt-0.5 text-[11px] capitalize text-white/40">{firstType}</p>

        <div className="mt-3 flex items-center gap-3 border-t border-white/10 pt-2.5">
          {place.rating !== null && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
              <span className="text-xs font-medium text-white/65">
                {place.rating.toFixed(1)}
              </span>
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
