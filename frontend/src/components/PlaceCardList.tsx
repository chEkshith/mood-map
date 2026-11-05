import { MapPin } from "lucide-react";
import { useEffect, useRef } from "react";
import { useMoodStore } from "../store/moodStore";
import { PlaceCard } from "./PlaceCard";

export function PlaceCardList() {
  const places = useMoodStore((s) => s.places);
  const apiStatus = useMoodStore((s) => s.apiStatus);
  const listRef = useRef<HTMLDivElement>(null);
  const previousStatus = useRef(apiStatus);

  useEffect(() => {
    const justFinished = previousStatus.current === "loading" && apiStatus === "success";
    previousStatus.current = apiStatus;

    if (!justFinished || places.length === 0) return;

    const element = listRef.current;
    if (!element) return;

    const { top } = element.getBoundingClientRect();
    if (top > window.innerHeight * 0.72) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [apiStatus, places.length]);

  if (apiStatus === "loading") {
    return (
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Recommended places</h3>
          <span className="text-[11px] text-white/45">Searching…</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-white/15 bg-[#0d1024]/95 animate-pulse"
            >
              <div className="h-36 bg-white/[0.06]" />
              <div className="space-y-2 p-4">
                <div className="h-3 w-2/3 rounded bg-white/[0.08]" />
                <div className="h-2.5 w-1/3 rounded bg-white/[0.06]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (apiStatus === "error") {
    return (
      <div className="app-panel p-6 text-center">
        <p className="text-sm text-rose-300">
          Failed to load results. Please try again.
        </p>
      </div>
    );
  }

  if (places.length === 0 && apiStatus === "success") {
    return (
      <div className="app-panel p-8 text-center">
        <MapPin className="mx-auto mb-3 h-7 w-7 text-white/25" />
        <p className="text-sm text-white/55">No places found nearby for your mood.</p>
        <p className="mt-1 text-xs text-white/30">Try increasing the search radius.</p>
      </div>
    );
  }

  if (places.length === 0) return null;

  return (
    <div ref={listRef} className="scroll-mt-24">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Recommended places</h3>
          <p className="mt-0.5 text-[11px] text-white/45">
            Sorted by distance and mood fit
          </p>
        </div>
        <span className="rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium text-white/60">
          {places.length} found
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {places.map((place, index) => (
          <PlaceCard key={place.place_id} place={place} index={index} />
        ))}
      </div>
    </div>
  );
}
