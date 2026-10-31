import { MapPin } from "lucide-react";
import { useMoodStore } from "../store/moodStore";
import { PlaceCard } from "./PlaceCard";

export function PlaceCardList() {
  const places = useMoodStore((s) => s.places);
  const apiStatus = useMoodStore((s) => s.apiStatus);

  if (apiStatus === "loading") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card p-4 space-y-3 animate-pulse">
            <div className="skeleton h-28 rounded-lg" />
            <div className="skeleton h-3 w-3/4 rounded" />
            <div className="skeleton h-2.5 w-1/2 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (apiStatus === "error") {
    return (
      <div className="card p-5 text-center">
        <p className="text-sm text-red-400">Failed to load results. Please try again.</p>
      </div>
    );
  }

  if (places.length === 0 && apiStatus === "success") {
    return (
      <div className="card p-8 text-center">
        <MapPin className="h-8 w-8 text-slate-600 mx-auto mb-3" />
        <p className="text-sm text-slate-400">No places found nearby for your mood.</p>
        <p className="text-xs text-slate-600 mt-1">Try increasing the search radius.</p>
      </div>
    );
  }

  if (places.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Nearby places
        </h3>
        <span className="text-xs text-slate-600">{places.length} found</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        {places.map((place) => (
          <PlaceCard key={place.place_id} place={place} />
        ))}
      </div>
    </div>
  );
}
