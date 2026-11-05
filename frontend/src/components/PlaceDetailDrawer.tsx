import { ExternalLink, MapPin, Navigation, Star, X } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import { useMoodStore } from "../store/moodStore";
import { PlacePhoto } from "./PlacePhoto";

function formatDistance(meters: number | null): string {
  if (meters === null) return "Distance unknown";
  if (meters < 1000) return `${meters} m away`;
  return `${(meters / 1000).toFixed(1)} km away`;
}

export function PlaceDetailDrawer() {
  const selectedPlace = useMoodStore((s) => s.selectedPlace);
  const selectPlace = useMoodStore((s) => s.selectPlace);
  const [headerBottom, setHeaderBottom] = useState(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") selectPlace(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectPlace]);

  useEffect(() => {
    const header = document.getElementById("app-header");
    if (!header) return;

    const update = () => {
      setHeaderBottom(Math.ceil(header.getBoundingClientRect().bottom));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(header);
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  if (!selectedPlace) return null;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${selectedPlace.latitude},${selectedPlace.longitude}`;
  const firstType = selectedPlace.place_types[0]?.replace(/_/g, " ") ?? "Place";

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={() => selectPlace(null)}
      />

      <div
        className="fixed bottom-0 left-0 right-0 z-50 md:bottom-0 md:left-auto md:right-0 md:top-[var(--drawer-top)] md:w-[420px] animate-slide-up md:animate-none"
        style={{ "--drawer-top": `${headerBottom}px` } as CSSProperties}
      >
        <div className="h-auto max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-white/10 bg-[#070810]/95 shadow-2xl backdrop-blur-2xl md:h-full md:max-h-none md:rounded-none md:rounded-l-2xl md:border-l md:border-t-0">
          <div className="relative h-56 shrink-0 overflow-hidden bg-white/[0.03]">
            <PlacePhoto
              photoUrl={selectedPlace.photo_url}
              name={selectedPlace.name}
              types={selectedPlace.place_types}
              variant="detail"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070810] via-black/10 to-black/20" />
            <button
              onClick={() => selectPlace(null)}
              aria-label="Close drawer"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-black/40 text-white transition-colors hover:bg-black/60"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-5 p-6">
            <div>
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/35">
                Place details
              </span>
              <h2 className="mt-2 font-display text-xl font-semibold tracking-tight text-white">
                {selectedPlace.name}
              </h2>
              <p className="mt-0.5 text-xs capitalize text-white/50">{firstType}</p>
            </div>

            <div className="flex items-center gap-5 border-y border-white/10 py-4">
              {selectedPlace.rating !== null && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/35">
                    Rating
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                    <span className="text-sm font-medium text-white/85">
                      {selectedPlace.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              )}
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/35">
                  Distance
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <Navigation className="h-3.5 w-3.5 text-violet-300" />
                  <span className="text-sm text-white/70">
                    {formatDistance(selectedPlace.distance_meters)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/35" />
              <p className="text-sm leading-relaxed text-white/65">
                {selectedPlace.address || "Address unavailable"}
              </p>
            </div>

            {selectedPlace.why_suggested && (
              <div className="rounded-xl border border-violet-400/15 bg-violet-400/[0.06] p-4">
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-violet-200/80">
                  Why this place?
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-white/65">
                  {selectedPlace.why_suggested}
                </p>
              </div>
            )}

            {selectedPlace.place_types.length > 0 && (
              <div>
                <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
                  Categories
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPlace.place_types.slice(0, 5).map((type) => (
                    <span
                      key={type}
                      className="rounded-md border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] capitalize text-white/65"
                    >
                      {type.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>
            )}

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
