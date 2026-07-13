import { Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { moodApi } from "../api/client";
import { useMoodStore } from "../store/moodStore";
import type { MoodEnum } from "../types";

const STRATEGY_STYLES: Record<string, string> = {
  reset: "bg-blue-100 text-blue-700",
  shift: "bg-amber-100 text-amber-700",
  match: "bg-green-100 text-green-700",
};

const MOOD_EMOJI: Record<MoodEnum, string> = {
  stressed: "😖",
  anxious: "😰",
  bored: "😐",
  exhausted: "🥱",
  happy: "😄",
  melancholic: "😔",
};

const MOOD_OPTIONS: (MoodEnum | "all")[] = [
  "all",
  "stressed",
  "anxious",
  "bored",
  "exhausted",
  "happy",
  "melancholic",
];

export function HistoryPage() {
  const history = useMoodStore((s) => s.history);
  const fetchHistory = useMoodStore((s) => s.fetchHistory);
  const [filter, setFilter] = useState<MoodEnum | "all">("all");
  const [selectedEntry, setSelectedEntry] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetchHistory(filter === "all" ? { limit: 20, skip: 0 } : { limit: 20, skip: 0, mood_filter: filter });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleViewEntry = async (id: string) => {
    const entry = await moodApi.getEntry(id);
    setSelectedEntry(entry as unknown as Record<string, unknown>);
  };

  const handleDelete = async (id: string) => {
    await moodApi.deleteEntry(id);
    fetchHistory(filter === "all" ? { limit: 20, skip: 0 } : { limit: 20, skip: 0, mood_filter: filter });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">History</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as MoodEnum | "all")}
          className="rounded-lg border border-gray-300 text-sm p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {MOOD_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt === "all" ? "All moods" : opt}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {history.map((entry) => (
          <div
            key={entry.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition"
            onClick={() => handleViewEntry(entry.id)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2 min-w-0">
                <span className="text-2xl">{MOOD_EMOJI[entry.classified_mood]}</span>
                <div className="min-w-0">
                  <p className="text-sm text-gray-800 truncate">{entry.raw_text}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(entry.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                    STRATEGY_STYLES[entry.strategy] ?? "bg-gray-100 text-gray-700"
                  }`}
                >
                  {entry.strategy}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(entry.id);
                  }}
                  className="p-1.5 rounded-full hover:bg-red-50"
                  aria-label="Delete entry"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {history.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">No history entries yet.</p>
        )}
      </div>

      {selectedEntry && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedEntry(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Entry details</h2>
              <button onClick={() => setSelectedEntry(null)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap break-words">
              {JSON.stringify(selectedEntry, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
