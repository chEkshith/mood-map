import {
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  Clock,
  Loader2,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { moodApi } from "../api/client";
import { AnimatedNumber } from "../components/AnimatedNumber";
import { MoodEmojiRain } from "../components/MoodEmojiRain";
import { useMoodStore } from "../store/moodStore";
import type { HistoryEntry, MoodEnum } from "../types";

const STRATEGY_META: Record<string, { label: string; emoji: string; className: string }> = {
  reset: {
    label: "Reset",
    emoji: "🌿",
    className: "border-sky-400/20 bg-sky-400/10 text-sky-200",
  },
  shift: {
    label: "Shift",
    emoji: "⚡",
    className: "border-amber-400/20 bg-amber-400/10 text-amber-200",
  },
  match: {
    label: "Match",
    emoji: "🎯",
    className: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  },
};

const MOOD_EMOJI: Record<MoodEnum, string> = {
  stressed: "😖",
  anxious: "😰",
  bored: "😐",
  exhausted: "🥱",
  happy: "😄",
  melancholic: "😔",
};

const MOOD_COLOR: Record<MoodEnum, string> = {
  stressed: "text-rose-300",
  anxious: "text-orange-300",
  bored: "text-slate-300",
  exhausted: "text-violet-300",
  happy: "text-emerald-300",
  melancholic: "text-sky-300",
};

const MOOD_DOT: Record<MoodEnum, string> = {
  stressed: "bg-rose-400",
  anxious: "bg-orange-400",
  bored: "bg-slate-400",
  exhausted: "bg-violet-400",
  happy: "bg-emerald-400",
  melancholic: "bg-sky-400",
};

const MOOD_OPTIONS: Array<{ value: MoodEnum | "all"; label: string; emoji: string }> = [
  { value: "all", label: "All moods", emoji: "✨" },
  { value: "stressed", label: "Stressed", emoji: "😖" },
  { value: "anxious", label: "Anxious", emoji: "😰" },
  { value: "bored", label: "Bored", emoji: "😐" },
  { value: "exhausted", label: "Exhausted", emoji: "🥱" },
  { value: "happy", label: "Happy", emoji: "😄" },
  { value: "melancholic", label: "Melancholic", emoji: "😔" },
];

function formatEntryDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const startOfEntry = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const daysAgo = Math.round(
    (startOfToday.getTime() - startOfEntry.getTime()) / 86_400_000
  );

  if (daysAgo === 0) return "Today";
  if (daysAgo === 1) return "Yesterday";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() === today.getFullYear() ? undefined : "numeric",
  });
}

function formatFullDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function HistoryPage() {
  const history = useMoodStore((s) => s.history);
  const fetchHistory = useMoodStore((s) => s.fetchHistory);
  const [filter, setFilter] = useState<MoodEnum | "all">("all");
  const [selectedEntry, setSelectedEntry] = useState<
    (HistoryEntry & { places_suggested?: unknown[] }) | null
  >(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory(
      filter === "all"
        ? { limit: 20, skip: 0 }
        : { limit: 20, skip: 0, mood_filter: filter }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    if (!selectedEntry) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedEntry(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedEntry]);

  const orderedHistory = useMemo(
    () =>
      [...history].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    [history]
  );

  const placesExplored = useMemo(
    () => history.reduce((sum, entry) => sum + entry.places_count, 0),
    [history]
  );

  const latestEntry = orderedHistory[0] ?? null;

  const summaryCards = [
    {
      label: "Places explored",
      value: <AnimatedNumber value={placesExplored} />,
      meta: "Nearby spots discovered",
      emoji: "📍",
      accent: "border-emerald-400/20 bg-emerald-400/10",
      glow: "bg-emerald-500/20",
      line: "from-emerald-400/50 via-emerald-400/10 to-transparent",
    },
    {
      label: "Latest entry",
      value: latestEntry ? formatEntryDate(latestEntry.created_at) : "—",
      meta: latestEntry
        ? `${MOOD_EMOJI[latestEntry.classified_mood]} ${latestEntry.classified_mood}`
        : "No entries yet",
      emoji: "🕘",
      accent: "border-sky-400/20 bg-sky-400/10",
      glow: "bg-sky-500/20",
      line: "from-sky-400/50 via-sky-400/10 to-transparent",
    },
  ];

  const handleViewEntry = async (id: string) => {
    try {
      const entry = await moodApi.getEntry(id);
      setSelectedEntry(entry);
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
        filter === "all"
          ? { limit: 20, skip: 0 }
          : { limit: 20, skip: 0, mood_filter: filter }
      );
    } catch {
      toast.error("Failed to delete entry.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
      <MoodEmojiRain />
      <section
        className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-[#16182d]/95 via-[#0a0c1b]/90 to-[#06070f]/88 p-5 backdrop-blur-xl anim-stagger md:p-6"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-violet-500/15 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-sky-500/10 blur-[100px]" />

        <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="glass-chip px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-violet-100/70">
                <Clock className="h-3 w-3" />
                Timeline
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-white/45">
                <CalendarDays className="h-3.5 w-3.5" />
                {history.length} {history.length === 1 ? "entry" : "entries"} in view
              </span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Mood <span className="text-gradient">history</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60">
              A calm record of how you've been feeling — and the places that helped.
            </p>
          </div>

          <Link
            to="/app"
            className="btn-primary group !px-4 !py-2.5 !text-xs self-start md:self-auto"
          >
            Log a mood
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </section>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
        {summaryCards.map(
          ({ label, value, meta, emoji, accent, glow, line }, index) => (
            <div
              key={label}
              className="card dashboard-card group relative overflow-hidden p-5 anim-stagger"
              style={{ animationDelay: `${0.2 + index * 0.07}s` }}
            >
              <div
                className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full blur-3xl transition-transform duration-500 group-hover:scale-125 ${glow}`}
              />
              <div className="relative flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
                    {label}
                  </p>
                  <p className="mt-2 truncate font-display text-2xl font-semibold tracking-tight text-white md:text-[28px]">
                    {value}
                  </p>
                </div>
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105 ${accent}`}
                >
                  {emoji}
                </span>
              </div>
              <p className="relative mt-4 truncate text-[11px] capitalize text-white/45">
                {meta}
              </p>
              <div
                className={`relative mt-4 h-px w-full bg-gradient-to-r ${line}`}
              />
            </div>
          )
        )}
      </div>

      <section
        className="card dashboard-card relative mt-4 overflow-hidden p-4 anim-stagger md:p-5"
        style={{ animationDelay: "0.42s" }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-violet-100">
              <SlidersHorizontal className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                Filter
              </p>
              <p className="mt-0.5 text-sm font-medium text-white/80">
                Browse your moments
              </p>
            </div>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 lg:justify-end lg:pb-0">
            {MOOD_OPTIONS.map(({ value, label, emoji }) => {
              const isActive = filter === value;
              return (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  aria-pressed={isActive}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all duration-300 active:scale-95 ${
                    isActive
                      ? "border-violet-300/30 bg-gradient-to-r from-violet-500/25 to-sky-500/15 text-white shadow-[0_8px_24px_-12px_rgba(139,92,246,0.8),inset_0_1px_0_rgba(255,255,255,0.16)]"
                      : "border-white/10 bg-white/[0.03] text-white/50 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <span className="text-sm leading-none">{emoji}</span>
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {orderedHistory.length === 0 ? (
        <div
          className="card dashboard-card mt-4 flex flex-col items-center justify-center px-6 py-16 text-center anim-stagger"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            {filter === "all" ? "🌱" : "🔍"}
          </div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-white">
            {filter === "all" ? "Your story starts here" : "No entries match this mood"}
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/45">
            {filter === "all"
              ? "Log your first mood to start building a timeline of feelings and places."
              : "Try another mood filter, or log a new check-in to add to your story."}
          </p>
          <Link
            to={filter === "all" ? "/app" : "/history"}
            onClick={() => {
              if (filter !== "all") setFilter("all");
            }}
            className="btn-secondary mt-5 !text-xs"
          >
            {filter === "all" ? "Log a mood" : "Clear filter"}
          </Link>
        </div>
      ) : (
        <div className="relative mt-4 space-y-3 sm:pl-8">
          <div className="absolute bottom-2 left-3 top-2 hidden w-px bg-gradient-to-b from-violet-400/50 via-white/10 to-transparent sm:block" />

          {orderedHistory.map((entry, index) => {
            const strategy =
              STRATEGY_META[entry.strategy] ?? {
                label: entry.strategy,
                emoji: "✨",
                className: "border-white/10 bg-white/[0.04] text-white/50",
              };
            const isDeleting = deletingId === entry.id;

            return (
              <div key={`${filter}-${entry.id}`} className="relative">
                <span
                  className={`absolute -left-[1.56rem] top-6 hidden h-2.5 w-2.5 rounded-full border-2 border-[#0b0c1d] shadow-[0_0_0_3px_rgba(255,255,255,0.05)] sm:block ${
                    MOOD_DOT[entry.classified_mood]
                  }`}
                />

                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${entry.classified_mood} entry`}
                  onClick={() => handleViewEntry(entry.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleViewEntry(entry.id);
                    }
                  }}
                  className="card dashboard-card group relative cursor-pointer overflow-hidden p-4 anim-stagger transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 md:p-5"
                  style={{ animationDelay: `${0.5 + Math.min(index, 9) * 0.055}s` }}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] text-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
                      {MOOD_EMOJI[entry.classified_mood]}
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0b0c1d] ${
                          MOOD_DOT[entry.classified_mood]
                        }`}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="min-w-0 text-sm leading-relaxed text-white/80 line-clamp-2 transition-colors group-hover:text-white">
                          {entry.raw_text}
                        </p>
                        <time
                          dateTime={entry.created_at}
                          className="shrink-0 text-[11px] text-white/45"
                        >
                          {formatEntryDate(entry.created_at)}
                        </time>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-3">
                        <div className="flex flex-wrap items-center gap-2 text-[10px]">
                          <span
                            className={`font-medium capitalize ${
                              MOOD_COLOR[entry.classified_mood]
                            }`}
                          >
                            {entry.classified_mood}
                          </span>
                          <span className="text-white/15">·</span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-medium ${strategy.className}`}
                          >
                            <span>{strategy.emoji}</span>
                            {strategy.label}
                          </span>
                          <span className="text-white/15">·</span>
                          <span className="text-white/45">
                            📍 {entry.places_count} place
                            {entry.places_count === 1 ? "" : "s"}
                          </span>
                          <span className="hidden text-white/15 sm:inline">·</span>
                          <span className="hidden text-white/45 sm:inline">
                            {Math.round(entry.confidence * 100)}% match
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDelete(entry.id);
                            }}
                            disabled={isDeleting}
                            className="inline-flex h-7 items-center gap-1.5 rounded-lg px-2 text-[10px] font-medium text-white/35 opacity-100 transition-all duration-300 hover:bg-rose-500/10 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-40 sm:opacity-0 sm:group-hover:opacity-100"
                            aria-label="Delete entry"
                          >
                            {isDeleting ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                            <span className="hidden sm:inline">
                              {isDeleting ? "Deleting" : "Delete"}
                            </span>
                          </button>
                          <ChevronRight className="h-4 w-4 text-white/20 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white/60" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedEntry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xl animate-fade-in"
          onClick={() => setSelectedEntry(null)}
        >
          <div
            className="card dashboard-card max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-[1.5rem] p-5 animate-scale-in md:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] text-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                  {MOOD_EMOJI[selectedEntry.classified_mood]}
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                    Entry details
                  </p>
                  <h2 className="mt-1 font-display text-xl font-semibold capitalize tracking-tight text-white">
                    {selectedEntry.classified_mood}
                  </h2>
                  <p className="mt-0.5 text-xs text-white/40">
                    {formatFullDate(selectedEntry.created_at)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/50 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {[
                {
                  label: "Strategy",
                  value: `${STRATEGY_META[selectedEntry.strategy]?.emoji ?? "✨"} ${
                    STRATEGY_META[selectedEntry.strategy]?.label ?? selectedEntry.strategy
                  }`,
                },
                {
                  label: "Confidence",
                  value: `${Math.round(selectedEntry.confidence * 100)}%`,
                },
                {
                  label: "Places suggested",
                  value: String(selectedEntry.places_suggested?.length ?? 0),
                },
                {
                  label: "Mood",
                  value: `${MOOD_EMOJI[selectedEntry.classified_mood]} ${selectedEntry.classified_mood}`,
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/8 bg-white/[0.03] p-3"
                >
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">
                    {label}
                  </p>
                  <p className="mt-1.5 truncate text-sm font-medium capitalize text-white/75">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.03] p-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">
                Original text
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                {selectedEntry.raw_text}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
