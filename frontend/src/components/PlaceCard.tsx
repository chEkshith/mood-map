import { ArrowUpRight, MapPin, Navigation, Star } from "lucide-react";
import { useMoodStore } from "../store/moodStore";
import type { PlaceSuggestion } from "../types";
import { PlacePhoto } from "./PlacePhoto";

interface Props {
  place: PlaceSuggestion;
  index: number;
}

function formatDistance(meters: number | null): string {
  if (meters === null) return "";
  if (meters < 1000) return `${meters}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

const STRATEGY_BADGE: Record<string, { label: string; color: string }> = {
  reset: { label: "Reset", color: "border-blue-400/30 bg-blue-400/20 text-blue-100" },
  shift: { label: "Shift", color: "border-amber-400/30 bg-amber-400/20 text-amber-100" },
  match: { label: "Match", color: "border-emerald-400/30 bg-emerald-400/20 text-emerald-100" },
};

export function PlaceCard({ place, index }: Props) {
  const selectPlace = useMoodStore((s) => s.selectPlace);
  const selectedPlace = useMoodStore((s) => s.selectedPlace);
  const moodStrategy = useMoodStore((s) => s.currentMood?.strategy ?? "match");
  const isSelected = selectedPlace?.place_id === place.place_id;

  const firstType = place.place_types[0]?.replace(/_/g, " ") ?? "Place";
  const strategy = STRATEGY_BADGE[moodStrategy] ?? STRATEGY_BADGE.match;

  return (
    <button
      onClick={() => selectPlace(place)}
      className={`group flex w-full flex-col overflow-hidden rounded-2xl border text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 ${
        isSelected
          ? "border-violet-400/70 bg-violet-500/[0.12] shadow-[0_0_0_1px_rgba(167,139,250,0.35),0_18px_44px_-24px_rgba(139,92,246,0.85)]"
          : "border-white/15 bg-[#0d1024]/95 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.95)] hover:border-violet-300/40 hover:bg-[#12152e]/95"
      }`}
    >
      <div className="relative h-36 overflow-hidden bg-white/[0.04]">
        <PlacePhoto
          photoUrl={place.photo_url}
          name={place.name}
          types={place.place_types}
          className="transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-black/10" />

        <span className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-black/55 text-xs font-bold text-white backdrop-blur-md">
          {index + 1}
        </span>

        <span
          className={`absolute bottom-3 left-3 rounded-md border px-2 py-0.5 text-[10px] font-semibold backdrop-blur-md ${strategy.color}`}
        >
          {strategy.label}
        </span>

        {isSelected && (
          <span className="absolute right-3 top-3 rounded-md border border-violet-300/40 bg-violet-400/30 px-2 py-0.5 text-[10px] font-semibold text-violet-50 backdrop-blur-md">
            Selected
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-[15px] font-semibold text-white">{place.name}</h3>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-white/35 transition-colors group-hover:text-violet-200" />
        </div>
        <p className="mt-1 text-xs capitalize text-white/55">{firstType}</p>
        <p className="mt-1 flex items-start gap-1.5 text-[11px] leading-relaxed text-white/45">
          <MapPin className="mt-px h-3 w-3 shrink-0" />
          <span className="line-clamp-1">{place.address || "Address unavailable"}</span>
        </p>

        <div className="mt-3 flex items-center gap-4 border-t border-white/10 pt-3">
          {place.rating !== null && (
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
              <span className="text-xs font-semibold text-white/80">
                {place.rating.toFixed(1)}
              </span>
            </div>
          )}
          {place.distance_meters !== null && (
            <div className="flex items-center gap-1 text-white/60">
              <Navigation className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">{formatDistance(place.distance_meters)}</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
