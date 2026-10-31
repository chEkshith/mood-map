import { AlertCircle, MapPin } from "lucide-react";
import { useMoodStore } from "../store/moodStore";
import { PlaceCard } from "./PlaceCard";

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-transparent animate-pulse">
      <div className="h-4 w-16 bg-gray-200 rounded-full mb-3" />
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 bg-gray-200 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 bg-gray-200 rounded" />
          <div className="h-3 w-1/3 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="h-3 w-full bg-gray-200 rounded mt-3" />
    </div>
  );
}

export function PlaceCardList() {
  const apiStatus = useMoodStore((s) => s.apiStatus);
  const places = useMoodStore((s) => s.places);
  const errorMessage = useMoodStore((s) => s.errorMessage);
  const setRadius = useMoodStore((s) => s.setRadius);
  const radiusMeters = useMoodStore((s) => s.radiusMeters);

  if (apiStatus === "loading") {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (apiStatus === "error") {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 text-gray-500">
        <AlertCircle className="h-10 w-10 text-red-400 mb-3" />
        <p className="text-sm">{errorMessage ?? "Something went wrong. Please try again."}</p>
      </div>
    );
  }

  if (apiStatus === "idle") {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 text-gray-400">
        <MapPin className="h-10 w-10 mb-3" />
        <p className="text-sm">Enter how you're feeling to discover nearby places</p>
      </div>
    );
  }

  if (apiStatus === "success" && places.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 text-gray-500 gap-2">
        <MapPin className="h-10 w-10 text-gray-300" />
        <p className="text-sm">No places found nearby.</p>
        <button
          onClick={() => setRadius(Math.min(radiusMeters + 1000, 5000))}
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          Try increasing the search radius
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {places.map((place) => (
        <PlaceCard key={place.place_id} place={place} />
      ))}
    </div>
  );
}
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
