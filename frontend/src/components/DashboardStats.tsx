import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { StatsResponse } from "../types";

const MOOD_COLORS: Record<string, string> = {
  stressed: "#ef4444",
  anxious: "#f97316",
  bored: "#9ca3af",
  exhausted: "#a855f7",
  happy: "#22c55e",
  melancholic: "#3b82f6",
};

interface Props {
  stats: StatsResponse;
}

export function DashboardStats({ stats }: Props) {
  const trendByDate = Object.values(
    stats.mood_trend.reduce<Record<string, { date: string; count: number }>>((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = { date: item.date, count: 0 };
      }
      acc[item.date].count += item.count;
      return acc;
    }, {})
  );

  return (
    <div className="hidden lg:block space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Mood frequency</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={stats.mood_frequency}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="mood" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {stats.mood_frequency.map((entry) => (
                <Cell key={entry.mood} fill={MOOD_COLORS[entry.mood] ?? "#6366f1"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Mood trend (30 days)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trendByDate}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
