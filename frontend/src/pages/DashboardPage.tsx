import { BarChart2, Flame, Target, TrendingUp } from "lucide-react";
import { useEffect } from "react";
import { DashboardStats } from "../components/DashboardStats";
import { useMoodStore } from "../store/moodStore";

const MOOD_EMOJI: Record<string, string> = {
  stressed: "😖", anxious: "😰", bored: "😐",
  exhausted: "🥱", happy: "😄", melancholic: "😔",
};

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
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Skeleton */}
        <div className="mb-6">
          <div className="skeleton h-6 w-32 rounded mb-2" />
          <div className="skeleton h-4 w-56 rounded" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-5 animate-pulse space-y-2">
              <div className="skeleton h-3 w-1/2 rounded" />
              <div className="skeleton h-6 w-16 rounded" />
            </div>
          ))}
        </div>
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    );
  }

  const topPlaceType = stats.top_place_types[0]?.type?.replace(/_/g, " ") ?? "—";

  const statCards = [
    {
      label: "Total entries",
      value: stats.total_entries.toString(),
      icon: BarChart2,
      color: "text-violet-300",
      bg: "bg-violet-500/10 border-violet-400/20",
      glow: "hover:shadow-[0_26px_70px_-26px_rgba(139,92,246,0.7)]",
    },
    {
      label: "Mood streak",
      value: `${stats.mood_streak} days`,
      icon: Flame,
      color: "text-orange-300",
      bg: "bg-orange-500/10 border-orange-400/20",
      glow: "hover:shadow-[0_26px_70px_-26px_rgba(249,115,22,0.7)]",
    },
    {
      label: "Most common mood",
      value: stats.most_common_mood
        ? `${MOOD_EMOJI[stats.most_common_mood] ?? ""} ${stats.most_common_mood}`
        : "—",
      icon: TrendingUp,
      color: "text-fuchsia-300",
      bg: "bg-fuchsia-500/10 border-fuchsia-400/20",
      glow: "hover:shadow-[0_26px_70px_-26px_rgba(232,121,249,0.65)]",
    },
    {
      label: "Top place type",
      value: topPlaceType,
      icon: Target,
      color: "text-emerald-300",
      bg: "bg-emerald-500/10 border-emerald-400/20",
      glow: "hover:shadow-[0_26px_70px_-26px_rgba(16,185,129,0.65)]",
    },
  ];

  return (
    <div
      className="max-w-6xl mx-auto px-4 py-6 space-y-6 anim-stagger"
      style={{ animationDelay: "0.35s" }}
    >
      <div className="anim-stagger" style={{ animationDelay: "0.45s" }}>
        <span className="glass-chip px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-violet-100/70 mb-3">
          Insights
        </span>
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-white tracking-tight">
          Your wellness <span className="text-gradient">dashboard</span>
        </h1>
        <p className="text-sm text-white/50 mt-1.5">
          Your emotional wellness overview
        </p>
      </div>

      {/* Stat Cards */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 anim-stagger"
        style={{ animationDelay: "0.55s" }}
      >
        {statCards.map(({ label, value, icon: Icon, color, bg, glow }) => (
          <div
            key={label}
            className={`card p-5 border ${bg} transition-all duration-300 hover:-translate-y-1 hover:border-white/30 ${glow}`}
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/45 font-semibold leading-tight">{label}</p>
              <Icon className={`h-4 w-4 ${color} shrink-0`} />
            </div>
            <p className={`text-2xl font-semibold font-display capitalize leading-none tracking-tight ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="anim-stagger" style={{ animationDelay: "0.65s" }}>
        <DashboardStats stats={stats} />
      </div>

      {/* Recent Entries */}
      <div className="card p-5 anim-stagger" style={{ animationDelay: "0.75s" }}>
        <h3 className="text-sm font-semibold text-white mb-4">Recent entries</h3>
        {history.length === 0 ? (
          <p className="text-sm text-white/40 text-center py-6">No entries yet. Start by describing your mood!</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {history.slice(0, 5).map((entry) => (
              <li key={entry.id} className="py-3 flex items-center gap-3">
                <span className="text-xl shrink-0">{MOOD_EMOJI[entry.classified_mood] ?? "😐"}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white/75 truncate">{entry.raw_text}</p>
                  <p className="text-xs text-white/35 mt-0.5 capitalize">{entry.classified_mood}</p>
                </div>
                <span className="text-xs text-white/30 shrink-0">
                  {new Date(entry.created_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
