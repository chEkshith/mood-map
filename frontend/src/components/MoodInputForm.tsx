import { Loader2, MapPin } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useGeolocation } from "../hooks/useGeolocation";
import { useMoodStore } from "../store/moodStore";

const MAX_CHARS = 500;

const LOCATION_LABEL: Record<string, string> = {
  idle: "Waiting for location…",
  requesting: "Requesting your location…",
  granted: "Location ready",
  denied: "Location unavailable — enable it to see nearby places",
};

export function MoodInputForm() {
  const [text, setText] = useState("");
  const { locationStatus } = useGeolocation();
  const radiusMeters = useMoodStore((s) => s.radiusMeters);
  const setRadius = useMoodStore((s) => s.setRadius);
  const submitMood = useMoodStore((s) => s.submitMood);
  const apiStatus = useMoodStore((s) => s.apiStatus);

  const isLoading = apiStatus === "loading";
  const canSubmit = text.trim().length >= 2 && locationStatus === "granted" && !isLoading;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    await submitMood(text.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm p-6 space-y-4 border border-gray-100"
    >
      <div>
        <label htmlFor="mood-text" className="block text-sm font-medium text-gray-700 mb-1">
          How are you feeling?
        </label>
        <textarea
          id="mood-text"
          rows={4}
          maxLength={MAX_CHARS}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe how you're feeling..."
          className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
        <div className="text-right text-xs text-gray-400 mt-1">
          {text.length}/{MAX_CHARS}
        </div>
      </div>

      <div>
        <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-1">
          Search radius: {(radiusMeters / 1000).toFixed(1)}km
        </label>
        <input
          id="radius"
          type="range"
          min={500}
          max={5000}
          step={500}
          value={radiusMeters}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full accent-indigo-600"
        />
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <MapPin
          className={`h-4 w-4 ${
            locationStatus === "granted"
              ? "text-green-500"
              : locationStatus === "denied"
              ? "text-red-500"
              : "text-gray-400"
          }`}
        />
        <span>{LOCATION_LABEL[locationStatus]}</span>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium py-2.5 disabled:opacity-50 disabled:cursor-not-allowed hover:from-indigo-700 hover:to-indigo-800 transition"
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isLoading ? "Finding places..." : "Find places for my mood"}
      </button>
    </form>
  );
}
