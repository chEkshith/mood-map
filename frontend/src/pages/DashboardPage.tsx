import { ArrowUpRight, CalendarDays } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatedNumber } from "../components/AnimatedNumber";
import { DashboardStats } from "../components/DashboardStats";
import { useMoodStore } from "../store/moodStore";

const MOOD_EMOJI: Record<string, string> = {
  stressed: "😖",
  anxious: "😰",
  bored: "😐",
  exhausted: "🥱",
  happy: "😄",
  melancholic: "😔",
};

const MOOD_DOT: Record<string, string> = {
  stressed: "bg-rose-400",
  anxious: "bg-orange-400",
  bored: "bg-slate-400",
  exhausted: "bg-violet-400",
  happy: "bg-emerald-400",
  melancholic: "bg-sky-400",
};

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

  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function DashboardPage() {
  const stats = useMoodStore((s) => s.stats);
  const fetchStats = useMoodStore((s) => s.fetchStats);
  const history = useMoodStore((s) => s.history);
  const fetchHistory = useMoodStore((s) => s.fetchHistory);

  useEffect(() => {
    fetchStats();
    fetchHistory({ limit: 5, skip: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!stats) {
    return (
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-6 md:px-8 md:py-8">
        <div className="h-44 rounded-[1.5rem] border border-white/10 bg-white/[0.025] p-6">
          <div className="skeleton mb-4 h-5 w-28 rounded" />
          <div className="skeleton mb-3 h-10 w-2/3 rounded" />
          <div className="skeleton h-4 w-1/2 rounded" />
        </div>
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="card space-y-3 p-5">
              <div className="skeleton h-3 w-1/2 rounded" />
              <div className="skeleton h-8 w-20 rounded" />
              <div className="skeleton h-2.5 w-2/3 rounded" />
            </div>
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="skeleton h-[420px] rounded-2xl lg:col-span-8" />
          <div className="skeleton h-[420px] rounded-2xl lg:col-span-4" />
        </div>
      </div>
    );
  }

  const topPlaceType =
    stats.top_place_types[0]?.type.replace(/_/g, " ") ?? "—";
  const topMoodEmoji = stats.most_common_mood
    ? MOOD_EMOJI[stats.most_common_mood] ?? "🙂"
    : "🌱";

  const statCards = [
    {
      label: "Total entries",
      value: <AnimatedNumber value={stats.total_entries} />,
      meta: "Lifetime check-ins",
      emoji: "📊",
      accent: "border-violet-400/20 bg-violet-400/10",
      glow: "bg-violet-500/20",
      line: "from-violet-400/50 via-violet-400/10 to-transparent",
    },
    {
      label: "Mood streak",
      value: (
        <>
          <AnimatedNumber value={stats.mood_streak} />
          <span className="ml-1 text-sm font-medium text-white/50">days</span>
        </>
      ),
      meta: "Keep the rhythm going",
      emoji: "🔥",
      accent: "border-amber-400/20 bg-amber-400/10",
      glow: "bg-amber-500/20",
      line: "from-amber-400/50 via-amber-400/10 to-transparent",
    },
    {
      label: "Most common mood",
      value: stats.most_common_mood ? (
        <span className="capitalize">
          {topMoodEmoji} {stats.most_common_mood}
        </span>
      ) : (
        "—"
      ),
      meta: "Your emotional baseline",
      emoji: "💫",
      accent: "border-fuchsia-400/20 bg-fuchsia-400/10",
      glow: "bg-fuchsia-500/20",
      line: "from-fuchsia-400/50 via-fuchsia-400/10 to-transparent",
    },
    {
      label: "Top place type",
      value: <span className="capitalize">{topPlaceType}</span>,
      meta: "Where you find calm",
      emoji: "📍",
      accent: "border-emerald-400/20 bg-emerald-400/10",
      glow: "bg-emerald-500/20",
      line: "from-emerald-400/50 via-emerald-400/10 to-transparent",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
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
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                Live insights
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-white/45">
                <CalendarDays className="h-3.5 w-3.5" />
                {new Date().toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Your wellness <span className="text-gradient">dashboard</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60">
              Patterns, streaks, and places that shape your mood — all in one calm view.
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

      <div className="mt-4 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {statCards.map(
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
              <p className="relative mt-4 text-[11px] text-white/45">{meta}</p>
              <div
                className={`relative mt-4 h-px w-full bg-gradient-to-r ${line}`}
              />
            </div>
          )
        )}
      </div>

      <div className="mt-4">
        <DashboardStats stats={stats} />
      </div>

      <section
        className="card dashboard-card mt-4 overflow-hidden anim-stagger"
        style={{ animationDelay: "0.74s" }}
      >
        <div className="flex items-center justify-between gap-4 border-b border-white/5 px-5 py-4 md:px-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
              Latest
            </p>
            <h2 className="mt-1 flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-white">
              <span className="text-base">🕘</span>
              Recent entries
            </h2>
          </div>
          <Link
            to="/history"
            className="group inline-flex items-center gap-1.5 text-xs font-medium text-white/60 transition-colors hover:text-white"
          >
            View all
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
              🌱
            </div>
            <p className="text-sm font-medium text-white/60">Your story starts here.</p>
            <p className="mt-1 max-w-xs text-xs leading-relaxed text-white/45">
              Log your first mood to see patterns, streaks, and places appear here.
            </p>
            <Link to="/app" className="btn-secondary mt-4 !text-xs">
              Log a mood
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-white/[0.04]">
            {history.slice(0, 5).map((entry, index) => {
              const strategy =
                STRATEGY_META[entry.strategy] ?? {
                  label: entry.strategy,
                  emoji: "✨",
                  className: "border-white/10 bg-white/[0.04] text-white/50",
                };

              return (
                <li
                  key={entry.id}
                  className="anim-stagger"
                  style={{ animationDelay: `${0.8 + index * 0.06}s` }}
                >
                  <div className="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-white/[0.025] md:px-6">
                    <div
                      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] text-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105"
                      aria-hidden="true"
                    >
                      {MOOD_EMOJI[entry.classified_mood] ?? "🙂"}
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0b0c1d] ${
                          MOOD_DOT[entry.classified_mood] ?? "bg-white/40"
                        }`}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-white/75 transition-colors group-hover:text-white">
                        {entry.raw_text}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px]">
                        <span className="capitalize text-white/55">
                          {entry.classified_mood}
                        </span>
                        <span className="text-white/15">·</span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-medium ${strategy.className}`}
                        >
                          <span>{strategy.emoji}</span>
                          {strategy.label}
                        </span>
                        <span className="hidden text-white/15 sm:inline">·</span>
                        <span className="hidden text-white/45 sm:inline">
                          {entry.places_count} place{entry.places_count === 1 ? "" : "s"}
                        </span>
                      </div>
                    </div>

                    <time
                      dateTime={entry.created_at}
                      className="shrink-0 text-[11px] text-white/45"
                    >
                      {formatEntryDate(entry.created_at)}
                    </time>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
