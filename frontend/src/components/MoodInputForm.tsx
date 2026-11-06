import { AlertCircle, Loader2, MapPin, Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { useGeolocation } from "../hooks/useGeolocation";
import { useMoodStore } from "../store/moodStore";

const MAX_CHARS = 500;

const MOOD_SUGGESTIONS = [
  {
    label: "Drained after meetings",
    text: "I feel completely drained after back-to-back meetings",
  },
  {
    label: "Anxious about tomorrow",
    text: "So anxious about tomorrow's presentation",
  },
  {
    label: "Bored and restless",
    text: "Just bored and need something to do",
  },
  {
    label: "Feeling low",
    text: "Feeling melancholic and need some calm",
  },
];

const LOCATION_LABEL: Record<string, string> = {
  idle: "Locating you…",
  requesting: "Requesting location…",
  granted: "Location ready",
  denied: "Location blocked — enable it in browser settings",
};

export function MoodInputForm() {
  const [text, setText] = useState("");
  const { locationStatus } = useGeolocation();
  const radiusMeters = useMoodStore((s) => s.radiusMeters);
  const setRadius = useMoodStore((s) => s.setRadius);
  const submitMood = useMoodStore((s) => s.submitMood);
  const apiStatus = useMoodStore((s) => s.apiStatus);
  const errorMessage = useMoodStore((s) => s.errorMessage);

  const isLoading = apiStatus === "loading";
  const canSubmit = text.trim().length >= 2 && locationStatus === "granted" && !isLoading;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      if (locationStatus !== "granted") {
        toast.error("Please allow location access to find nearby places.");
      }
      return;
    }
    await submitMood(text.trim());
    const state = useMoodStore.getState();
    if (
      (state.apiStatus === "error" || state.apiStatus === "blocked") &&
      state.errorMessage
    ) {
      toast.error(state.errorMessage);
    }
  };

  const locationDot =
    locationStatus === "granted"
      ? "bg-emerald-400"
      : locationStatus === "denied"
      ? "bg-rose-400"
      : "bg-amber-400 animate-pulse";

  return (
    <div className="app-panel p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-white">
            How are you feeling?
          </h2>
          <p className="mt-0.5 text-xs text-white/40">A sentence is enough.</p>
        </div>
        <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-white/35">
          Check-in
        </span>
      </div>

      <div className="mt-5">
        <p className="text-[10px] uppercase tracking-[0.16em] text-white/35">Quick start</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {MOOD_SUGGESTIONS.slice(0, 3).map(({ label, text: suggestion }) => (
            <button
              key={label}
              type="button"
              onClick={() => setText(suggestion)}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[11px] text-white/55 transition-colors hover:border-white/20 hover:text-white"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="mood-text"
              className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40"
            >
              Your words
            </label>
            <span
              className={`text-[11px] tabular-nums ${
                text.length > MAX_CHARS * 0.85 ? "text-amber-300" : "text-white/30"
              }`}
            >
              {text.length}/{MAX_CHARS}
            </span>
          </div>
          <textarea
            id="mood-text"
            rows={5}
            maxLength={MAX_CHARS}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="E.g. I feel exhausted and overwhelmed after a long week…"
            className="app-input resize-none"
          />
          <p className="mt-1.5 text-[11px] text-white/30">
            Be as descriptive as you like.
          </p>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="radius"
              className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40"
            >
              Search radius
            </label>
            <span className="text-xs font-medium text-violet-200">
              {(radiusMeters / 1000).toFixed(1)} km
            </span>
          </div>
          <input
            id="radius"
            type="range"
            min={500}
            max={10000}
            step={500}
            value={radiusMeters}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full"
          />
          <div className="mt-1 flex justify-between text-[10px] text-white/25">
            <span>0.5 km</span>
            <span>10 km</span>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
          <span className={`h-1.5 w-1.5 rounded-full ${locationDot}`} />
          <MapPin className="h-3 w-3 shrink-0 text-white/35" />
          <span className="truncate text-[11px] text-white/50">
            {LOCATION_LABEL[locationStatus]}
          </span>
        </div>

        {errorMessage && (apiStatus === "error" || apiStatus === "blocked") && (
          <div
            className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-xs ${
              apiStatus === "blocked"
                ? "border-amber-400/20 bg-amber-400/10 text-amber-200"
                : "border-rose-400/20 bg-rose-400/10 text-rose-200"
            }`}
          >
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <button type="submit" disabled={!canSubmit} className="btn-primary w-full !py-3.5">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Finding places…
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Find places nearby
            </>
          )}
        </button>
      </form>
    </div>
  );
}
