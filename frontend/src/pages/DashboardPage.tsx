import { useEffect } from "react";
import { DashboardStats } from "../components/DashboardStats";
import { useMoodStore } from "../store/moodStore";

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
        <p className="text-sm text-gray-500">Loading your dashboard...</p>
      </div>
    );
  }

  const topPlaceType = stats.top_place_types[0]?.type ?? "—";

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <p className="text-xs text-gray-500">Total entries</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total_entries}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <p className="text-xs text-gray-500">Mood streak</p>
          <p className="text-2xl font-bold text-gray-900">{stats.mood_streak} days</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <p className="text-xs text-gray-500">Most common mood</p>
          <p className="text-2xl font-bold text-gray-900 capitalize">
            {stats.most_common_mood ?? "—"}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <p className="text-xs text-gray-500">Top place type</p>
          <p className="text-2xl font-bold text-gray-900 capitalize">
            {topPlaceType.replace(/_/g, " ")}
          </p>
        </div>
      </div>

      <DashboardStats stats={stats} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent entries</h3>
        <ul className="divide-y divide-gray-100">
          {history.slice(0, 5).map((entry) => (
            <li key={entry.id} className="py-2 flex items-center justify-between text-sm">
              <span className="truncate pr-4 text-gray-700">{entry.raw_text}</span>
              <span className="text-gray-400 flex-shrink-0">
                {new Date(entry.created_at).toLocaleDateString()}
              </span>
            </li>
          ))}
          {history.length === 0 && <li className="py-2 text-sm text-gray-400">No entries yet.</li>}
        </ul>
      </div>
    </div>
  );
}
