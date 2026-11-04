import { Loader2, MapPin, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { useGeolocation } from "../hooks/useGeolocation";
import { useMoodStore } from "../store/moodStore";

const MAX_CHARS = 500;

const MOOD_SUGGESTIONS = [
  "I feel completely drained after back-to-back meetings",
  "So anxious about tomorrow's presentation",
  "Just bored and need something to do",
  "Happy and want to celebrate with friends",
  "Feeling melancholic and need some calm",
];

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
    if (apiStatus === "error" && errorMessage) {
      toast.error(errorMessage);
    }
  };

  const locationColor =
    locationStatus === "granted"
      ? "text-emerald-400"
      : locationStatus === "denied"
      ? "text-red-400"
      : "text-white/40";

  const locationLabel: Record<string, string> = {
    idle: "Detecting location…",
    requesting: "Requesting location…",
    granted: "Location ready",
    denied: "Location blocked — enable it in browser settings",
  };

  return (
    <div className="card p-5 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-white mb-0.5 tracking-tight">
          How are you feeling?
        </h2>
        <p className="text-xs text-white/45">Describe your mood in your own words</p>
      </div>

      {/* Suggestion chips */}
      <div className="flex flex-wrap gap-1.5">
        {MOOD_SUGGESTIONS.slice(0, 3).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setText(s)}
            className="glass-subtle text-[11px] px-3 py-1.5 rounded-full text-slate-300/80
                       hover:bg-violet-400/15 hover:border-violet-300/30 hover:text-violet-100 transition-all duration-300"
          >
            {s.split(" ").slice(0, 5).join(" ")}…
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            id="mood-text"
            rows={4}
            maxLength={MAX_CHARS}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="E.g. I feel exhausted and overwhelmed after a long week…"
            className="input-field resize-none"
          />
          <div className="flex justify-between items-center mt-1.5">
            <span className="text-[11px] text-white/35">Be as descriptive as you like</span>
            <span className={`text-[11px] font-medium ${text.length > MAX_CHARS * 0.85 ? "text-amber-300" : "text-white/35"}`}>
              {text.length}/{MAX_CHARS}
            </span>
          </div>
        </div>

        {/* Radius slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="radius" className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/45">
              Search radius
            </label>
            <span className="text-xs font-semibold text-violet-200">
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
          <div className="flex justify-between text-[11px] text-white/30 mt-1">
            <span>0.5 km</span>
            <span>10 km</span>
          </div>
        </div>

        {/* Location status */}
        <div className="flex items-center gap-2 glass-subtle rounded-xl px-3 py-2">
          <MapPin className={`h-3.5 w-3.5 flex-shrink-0 ${locationColor}`} />
          <span className={`text-[11px] ${locationColor}`}>{locationLabel[locationStatus]}</span>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="btn-primary w-full !py-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing mood & finding places…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Find places for my mood
            </>
          )}
        </button>
      </form>
    </div>
  );
}
