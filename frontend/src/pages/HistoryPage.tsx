import { Clock, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { moodApi } from "../api/client";
import { useMoodStore } from "../store/moodStore";
import type { MoodEnum } from "../types";

const STRATEGY_BADGE: Record<string, string> = {
  reset: "bg-blue-500/15 text-blue-300 border-blue-500/20",
  shift: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  match: "bg-green-500/15 text-green-300 border-green-500/20",
};

const MOOD_EMOJI: Record<MoodEnum, string> = {
  stressed: "😖", anxious: "😰", bored: "😐",
  exhausted: "🥱", happy: "😄", melancholic: "😔",
};

const MOOD_COLOR: Record<MoodEnum, string> = {
  stressed:    "text-red-400",
  anxious:     "text-amber-400",
  bored:       "text-slate-400",
  exhausted:   "text-violet-400",
  happy:       "text-emerald-400",
  melancholic: "text-blue-400",
};

const MOOD_OPTIONS: (MoodEnum | "all")[] = [
  "all", "stressed", "anxious", "bored", "exhausted", "happy", "melancholic",
];

export function HistoryPage() {
  const history = useMoodStore((s) => s.history);
  const fetchHistory = useMoodStore((s) => s.fetchHistory);
  const [filter, setFilter] = useState<MoodEnum | "all">("all");
  const [selectedEntry, setSelectedEntry] = useState<Record<string, unknown> | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory(
      filter === "all"
        ? { limit: 20, skip: 0 }
        : { limit: 20, skip: 0, mood_filter: filter }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleViewEntry = async (id: string) => {
    try {
      const entry = await moodApi.getEntry(id);
      setSelectedEntry(entry as unknown as Record<string, unknown>);
    } catch {
      toast.error("Failed to load entry details.");
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await moodApi.deleteEntry(id);
      toast.success("Entry deleted.");
      fetchHistory(
        filter === "all" ? { limit: 20, skip: 0 } : { limit: 20, skip: 0, mood_filter: filter }
      );
    } catch {
      toast.error("Failed to delete entry.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">History</h1>
          <p className="text-sm text-slate-400 mt-0.5">{history.length} entries</p>
        </div>

        {/* Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as MoodEnum | "all")}
          aria-label="Filter by mood"
        >
          {MOOD_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt === "all" ? "All moods" : `${MOOD_EMOJI[opt as MoodEnum]} ${opt}`}
            </option>
          ))}
        </select>
      </div>

      {/* Entries */}
      <div className="space-y-3">
        {history.length === 0 && (
          <div className="card p-10 text-center">
            <Clock className="h-8 w-8 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No history entries yet.</p>
            <p className="text-xs text-slate-600 mt-1">Submit your first mood to see it here.</p>
          </div>
        )}

        {history.map((entry) => (
          <div
            key={entry.id}
            className="card-hover p-4 cursor-pointer group"
            onClick={() => handleViewEntry(entry.id)}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0 mt-0.5">{MOOD_EMOJI[entry.classified_mood]}</span>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200 line-clamp-2 leading-relaxed mb-1.5">
                  {entry.raw_text}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-medium capitalize ${MOOD_COLOR[entry.classified_mood]}`}>
                    {entry.classified_mood}
                  </span>
                  <span className="text-slate-700">·</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold border capitalize ${
                      STRATEGY_BADGE[entry.strategy] ?? "bg-slate-500/15 text-slate-300 border-slate-500/20"
                    }`}
                  >
                    {entry.strategy}
                  </span>
                  <span className="text-slate-700">·</span>
                  <span className="text-xs text-slate-500">
                    {entry.places_count} place{entry.places_count !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="text-xs text-slate-600">
                  {new Date(entry.created_at).toLocaleDateString(undefined, {
                    month: "short", day: "numeric",
                  })}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(entry.id);
                  }}
                  disabled={deletingId === entry.id}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10
                             transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Delete entry"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Entry Detail Modal */}
      {selectedEntry && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setSelectedEntry(null)}
        >
          <div
            className="glass rounded-2xl max-w-md w-full p-6 max-h-[80vh] overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">Entry details</h2>
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Key fields */}
            <div className="space-y-3 text-sm">
              {[
                ["Mood", String(selectedEntry.classified_mood ?? "—")],
                ["Strategy", String(selectedEntry.strategy ?? "—")],
                ["Confidence", selectedEntry.confidence ? `${Math.round(Number(selectedEntry.confidence) * 100)}%` : "—"],
                ["Date", selectedEntry.created_at ? new Date(String(selectedEntry.created_at)).toLocaleString() : "—"],
                ["Places suggested", String((selectedEntry.places_suggested as unknown[])?.length ?? 0)],
              ].map(([key, val]) => (
                <div key={key} className="flex justify-between gap-4">
                  <span className="text-slate-500 shrink-0">{key}</span>
                  <span className="text-slate-200 text-right capitalize">{val}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-xs text-slate-500 mb-2">Original text</p>
              <p className="text-sm text-slate-300 leading-relaxed">
                {String(selectedEntry.raw_text ?? "")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
