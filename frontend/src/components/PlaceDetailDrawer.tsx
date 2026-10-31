import { ExternalLink, MapPin, Navigation, Star, X } from "lucide-react";
import { useEffect } from "react";
import { useMoodStore } from "../store/moodStore";

function formatDistance(meters: number | null): string {
  if (meters === null) return "Distance unknown";
  if (meters < 1000) return `${meters} m away`;
  return `${(meters / 1000).toFixed(1)} km away`;
}

export function PlaceDetailDrawer() {
  const selectedPlace = useMoodStore((s) => s.selectedPlace);
  const selectPlace = useMoodStore((s) => s.selectPlace);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") selectPlace(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectPlace]);

  if (!selectedPlace) return null;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${selectedPlace.latitude},${selectedPlace.longitude}`;
  const firstType = selectedPlace.place_types[0]?.replace(/_/g, " ") ?? "Place";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
        onClick={() => selectPlace(null)}
      />

      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:right-auto md:left-auto md:top-0 md:bottom-0 md:right-0 md:w-96 animate-slide-up md:animate-none">
        <div className="glass rounded-t-2xl md:rounded-none md:rounded-l-2xl md:h-full h-auto max-h-[85vh] overflow-y-auto border-t border-l border-white/10 shadow-2xl">

          {/* Photo */}
          <div className="h-48 bg-white/5 relative shrink-0">
            {selectedPlace.photo_url ? (
              <img
                src={selectedPlace.photo_url}
                alt={selectedPlace.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <MapPin className="h-10 w-10 text-slate-600" />
              </div>
            )}
            <button
              onClick={() => selectPlace(null)}
              aria-label="Close drawer"
              className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center
                         text-white hover:bg-black/70 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white mb-0.5">{selectedPlace.name}</h2>
              <p className="text-xs text-slate-500 capitalize">{firstType}</p>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4">
              {selectedPlace.rating !== null && (
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold text-slate-200">
                    {selectedPlace.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-slate-500">rating</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Navigation className="h-4 w-4 text-indigo-400" />
                <span className="text-sm text-slate-300">{formatDistance(selectedPlace.distance_meters)}</span>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-400 leading-relaxed">{selectedPlace.address}</p>
            </div>

            {/* Why suggested */}
            {selectedPlace.why_suggested && (
              <div className="card p-3 bg-indigo-500/8 border-indigo-500/15">
                <p className="text-xs font-medium text-indigo-300 mb-1">Why this place?</p>
                <p className="text-xs text-slate-400 leading-relaxed">{selectedPlace.why_suggested}</p>
              </div>
            )}

            {/* Place types */}
            {selectedPlace.place_types.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">Categories</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPlace.place_types.slice(0, 5).map((type) => (
                    <span
                      key={type}
                      className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400 capitalize"
                    >
                      {type.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Open in Maps */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full !py-3"
            >
              <ExternalLink className="h-4 w-4" />
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
