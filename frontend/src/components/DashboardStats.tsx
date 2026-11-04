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
  stressed:    "#f87171",
  anxious:     "#fb923c",
  bored:       "#94a3b8",
  exhausted:   "#c084fc",
  happy:       "#4ade80",
  melancholic: "#60a5fa",
};

const CHART_AXIS_STYLE = { fontSize: 11, fill: "#94a3b8", fontFamily: "Plus Jakarta Sans, sans-serif" };
const CHART_TOOLTIP_STYLE = {
  backgroundColor: "rgba(18, 19, 38, 0.72)",
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: "12px",
  color: "#f8fafc",
  fontSize: "12px",
  fontFamily: "Plus Jakarta Sans, sans-serif",
  backdropFilter: "blur(18px) saturate(180%)",
  boxShadow: "0 18px 50px -16px rgba(2,6,23,0.8), inset 0 1px 0 rgba(255,255,255,0.2)",
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

  const hasMoodFreq = stats.mood_frequency.length > 0;
  const hasTrend = trendByDate.length > 0;

  return (
    <div className="space-y-4">
      {/* Mood Frequency Bar Chart */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-white mb-4 tracking-tight">Mood frequency</h3>
        {hasMoodFreq ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.mood_frequency} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="mood" tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={CHART_TOOLTIP_STYLE}
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {stats.mood_frequency.map((entry) => (
                  <Cell key={entry.mood} fill={MOOD_COLORS[entry.mood] ?? "#818cf8"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-48 flex items-center justify-center">
            <p className="text-sm text-white/40">No mood data yet</p>
          </div>
        )}
      </div>

      {/* Mood Trend Line Chart */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-white mb-4 tracking-tight">Activity trend (30 days)</h3>
        {hasTrend ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendByDate}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ ...CHART_AXIS_STYLE, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#a78bfa"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, fill: "#c4b5fd", strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-48 flex items-center justify-center">
            <p className="text-sm text-white/40">No trend data yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
