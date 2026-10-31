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
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/15",
    },
    {
      label: "Mood streak",
      value: `${stats.mood_streak} days`,
      icon: Flame,
      color: "text-orange-400",
      bg: "bg-orange-500/10 border-orange-500/15",
    },
    {
      label: "Most common mood",
      value: stats.most_common_mood
        ? `${MOOD_EMOJI[stats.most_common_mood] ?? ""} ${stats.most_common_mood}`
        : "—",
      icon: TrendingUp,
      color: "text-violet-400",
      bg: "bg-violet-500/10 border-violet-500/15",
    },
    {
      label: "Top place type",
      value: topPlaceType,
      icon: Target,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/15",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-slate-400 mt-0.5">Your emotional wellness overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`card p-5 border ${bg}`}>
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs text-slate-500 font-medium leading-tight">{label}</p>
              <Icon className={`h-4 w-4 ${color} shrink-0`} />
            </div>
            <p className={`text-xl font-bold capitalize leading-none ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <DashboardStats stats={stats} />

      {/* Recent Entries */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Recent entries</h3>
        {history.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-6">No entries yet. Start by describing your mood!</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {history.slice(0, 5).map((entry) => (
              <li key={entry.id} className="py-3 flex items-center gap-3">
                <span className="text-xl shrink-0">{MOOD_EMOJI[entry.classified_mood] ?? "😐"}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-300 truncate">{entry.raw_text}</p>
                  <p className="text-xs text-slate-600 mt-0.5 capitalize">{entry.classified_mood}</p>
                </div>
                <span className="text-xs text-slate-600 shrink-0">
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
