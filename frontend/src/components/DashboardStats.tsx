import {
  Activity,
  BarChart3,
  MapPin,
  PieChart,
  TrendingUp,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { StatsResponse } from "../types";

const MOOD_COLORS: Record<string, string> = {
  stressed: "#f87171",
  anxious: "#fb923c",
  bored: "#94a3b8",
  exhausted: "#c084fc",
  happy: "#4ade80",
  melancholic: "#60a5fa",
};

const MOOD_EMOJI: Record<string, string> = {
  stressed: "😖",
  anxious: "😰",
  bored: "😐",
  exhausted: "🥱",
  happy: "😄",
  melancholic: "😔",
};

const CHART_AXIS_STYLE = {
  fontSize: 11,
  fill: "#94a3b8",
  fontFamily: "Plus Jakarta Sans, sans-serif",
};

const CHART_TOOLTIP_STYLE = {
  backgroundColor: "rgba(14, 16, 32, 0.9)",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: "12px",
  color: "#f8fafc",
  fontSize: "12px",
  fontFamily: "Plus Jakarta Sans, sans-serif",
  backdropFilter: "blur(18px) saturate(180%)",
  boxShadow:
    "0 18px 50px -16px rgba(2,6,23,0.9), inset 0 1px 0 rgba(255,255,255,0.16)",
};

function SectionHeading({
  icon,
  eyebrow,
  title,
  action,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
          {eyebrow}
        </p>
        <h3 className="mt-1.5 flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-white">
          {icon}
          {title}
        </h3>
      </div>
      {action}
    </div>
  );
}

function EmptyChart({ emoji, title, copy }: { emoji: string; title: string; copy: string }) {
  return (
    <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.015] px-6 text-center">
      <span className="mb-3 text-3xl">{emoji}</span>
      <p className="text-sm font-medium text-white/55">{title}</p>
      <p className="mt-1 max-w-[220px] text-xs leading-relaxed text-white/45">{copy}</p>
    </div>
  );
}

function formatShortDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatType(value: string) {
  return value.replace(/_/g, " ");
}

interface Props {
  stats: StatsResponse;
}

export function DashboardStats({ stats }: Props) {
  const moodFrequency = [...stats.mood_frequency].sort((a, b) => b.count - a.count);
  const totalMoodCount = moodFrequency.reduce((sum, item) => sum + item.count, 0);
  const hasMoodFreq = moodFrequency.length > 0;

  const trendByDate = Object.values(
    stats.mood_trend.reduce<Record<string, { date: string; count: number }>>(
      (acc, item) => {
        if (!acc[item.date]) {
          acc[item.date] = { date: item.date, count: 0 };
        }
        acc[item.date].count += item.count;
        return acc;
      },
      {}
    )
  ).sort((a, b) => a.date.localeCompare(b.date));
  const hasTrend = trendByDate.length > 0;
  const trendTotal = trendByDate.reduce((sum, item) => sum + item.count, 0);
  const peakDay = trendByDate.reduce(
    (peak, day) => (day.count > peak.count ? day : peak),
    { date: "", count: 0 }
  );

  const topPlaceTypes = stats.top_place_types.slice(0, 5);
  const maxPlaceCount = Math.max(...topPlaceTypes.map((item) => item.count), 1);

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <div className="space-y-4 lg:col-span-8">
        <section
          className="card dashboard-card relative overflow-hidden p-5 anim-stagger md:p-6"
          style={{ animationDelay: "0.48s" }}
        >
          <SectionHeading
            icon={<BarChart3 className="h-4 w-4 text-violet-200" />}
            eyebrow="Distribution"
            title="Mood frequency"
            action={
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] tabular-nums text-white/55">
                {totalMoodCount} check-ins
              </span>
            }
          />

          {hasMoodFreq ? (
            <>
              <div className="h-[230px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={moodFrequency}
                    margin={{ top: 8, right: 4, left: -20, bottom: 0 }}
                    barCategoryGap="30%"
                  >
                    <defs>
                      {moodFrequency.map(({ mood }) => (
                        <linearGradient
                          key={mood}
                          id={`moodBar-${mood}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor={MOOD_COLORS[mood] ?? "#818cf8"}
                            stopOpacity={0.95}
                          />
                          <stop
                            offset="100%"
                            stopColor={MOOD_COLORS[mood] ?? "#818cf8"}
                            stopOpacity={0.18}
                          />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid
                      strokeDasharray="4 6"
                      vertical={false}
                      stroke="rgba(255,255,255,0.055)"
                    />
                    <XAxis
                      dataKey="mood"
                      tickFormatter={(mood: string) => MOOD_EMOJI[mood] ?? mood}
                      tick={{ fontSize: 17 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={CHART_AXIS_STYLE}
                      axisLine={false}
                      tickLine={false}
                      width={32}
                    />
                    <Tooltip
                      contentStyle={CHART_TOOLTIP_STYLE}
                      cursor={{ fill: "rgba(255,255,255,0.035)", radius: 8 }}
                      formatter={(value) => [`${value} entries`, "Count"]}
                      labelFormatter={(label) =>
                        `${MOOD_EMOJI[String(label)] ?? ""} ${String(label)}`
                      }
                    />
                    <Bar
                      dataKey="count"
                      radius={[8, 8, 2, 2]}
                      animationDuration={900}
                    >
                      {moodFrequency.map((entry) => (
                        <Cell
                          key={entry.mood}
                          fill={`url(#moodBar-${entry.mood})`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-3">
                {moodFrequency.map(({ mood, count }) => (
                  <div key={mood} className="flex min-w-0 items-center gap-2 text-[11px]">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: MOOD_COLORS[mood] ?? "#818cf8" }}
                    />
                    <span className="text-base leading-none">{MOOD_EMOJI[mood] ?? "🙂"}</span>
                    <span className="truncate capitalize text-white/60">{mood}</span>
                    <span className="ml-auto tabular-nums text-white/40">{count}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyChart
              emoji="🏷️"
              title="No mood data yet"
              copy="Your mood distribution will appear after your first check-in."
            />
          )}
        </section>

        <section
          className="card dashboard-card relative overflow-hidden p-5 anim-stagger md:p-6"
          style={{ animationDelay: "0.6s" }}
        >
          <SectionHeading
            icon={<Activity className="h-4 w-4 text-sky-200" />}
            eyebrow="Momentum"
            title="Activity trend"
            action={
              hasTrend ? (
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] tabular-nums text-white/55">
                  Peak · {formatShortDate(peakDay.date)}
                </span>
              ) : undefined
            }
          />

          {hasTrend ? (
            <>
              <div className="h-[230px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={trendByDate}
                    margin={{ top: 10, right: 6, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.38} />
                        <stop offset="60%" stopColor="#818cf8" stopOpacity={0.1} />
                        <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="4 6"
                      vertical={false}
                      stroke="rgba(255,255,255,0.055)"
                    />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatShortDate}
                      tick={{ ...CHART_AXIS_STYLE, fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      minTickGap={28}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={CHART_AXIS_STYLE}
                      axisLine={false}
                      tickLine={false}
                      width={32}
                    />
                    <Tooltip
                      contentStyle={CHART_TOOLTIP_STYLE}
                      labelFormatter={(label) => formatShortDate(String(label))}
                      formatter={(value) => [`${value} entries`, "Count"]}
                      cursor={{ stroke: "rgba(196,181,253,0.25)", strokeWidth: 1 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#c4b5fd"
                      strokeWidth={2.5}
                      fill="url(#trendFill)"
                      dot={false}
                      activeDot={{
                        r: 4,
                        fill: "#f0abfc",
                        stroke: "rgba(240,171,252,0.22)",
                        strokeWidth: 6,
                      }}
                      animationDuration={1200}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/5 pt-4">
                <div className="flex items-center gap-2 text-[11px] text-white/50">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-300" />
                  <span className="tabular-nums text-white/65">{trendTotal}</span>
                  check-ins across this window
                </div>
                <span className="hidden text-[10px] uppercase tracking-[0.18em] text-white/35 sm:block">
                  Last 30 days
                </span>
              </div>
            </>
          ) : (
            <EmptyChart
              emoji="📈"
              title="No trend data yet"
              copy="Keep checking in to reveal your emotional momentum."
            />
          )}
        </section>
      </div>

      <div className="space-y-4 lg:col-span-4">
        <section
          className="card dashboard-card relative overflow-hidden p-5 anim-stagger md:p-6"
          style={{ animationDelay: "0.54s" }}
        >
          <SectionHeading
            icon={<PieChart className="h-4 w-4 text-fuchsia-200" />}
            eyebrow="Balance"
            title="Mood mix"
          />

          {hasMoodFreq ? (
            <>
              <div className="relative h-[210px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={moodFrequency}
                      dataKey="count"
                      nameKey="mood"
                      innerRadius="64%"
                      outerRadius="90%"
                      paddingAngle={4}
                      stroke="none"
                      animationDuration={1000}
                    >
                      {moodFrequency.map((entry) => (
                        <Cell
                          key={entry.mood}
                          fill={MOOD_COLORS[entry.mood] ?? "#818cf8"}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={CHART_TOOLTIP_STYLE}
                      formatter={(value) => [`${value} entries`, "Count"]}
                      labelFormatter={(label) =>
                        `${MOOD_EMOJI[String(label)] ?? ""} ${String(label)}`
                      }
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-3xl font-semibold tracking-tight text-white">
                    {totalMoodCount}
                  </span>
                  <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/45">
                    check-ins
                  </span>
                </div>
              </div>

              <div className="mt-3 space-y-2.5">
                {moodFrequency.map(({ mood, count }) => {
                  const percentage = totalMoodCount
                    ? Math.round((count / totalMoodCount) * 100)
                    : 0;
                  return (
                    <div key={mood} className="flex items-center gap-2.5 text-[11px]">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: MOOD_COLORS[mood] ?? "#818cf8" }}
                      />
                      <span className="text-base leading-none">{MOOD_EMOJI[mood] ?? "🙂"}</span>
                      <span className="capitalize text-white/65">{mood}</span>
                      <span className="ml-auto tabular-nums text-white/45">{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <EmptyChart
              emoji="🌱"
              title="Nothing to measure yet"
              copy="Your mood mix will take shape as you check in."
            />
          )}
        </section>

        <section
          className="card dashboard-card relative overflow-hidden p-5 anim-stagger md:p-6"
          style={{ animationDelay: "0.66s" }}
        >
          <SectionHeading
            icon={<MapPin className="h-4 w-4 text-emerald-200" />}
            eyebrow="Places"
            title="Top place types"
          />

          {topPlaceTypes.length > 0 ? (
            <div className="space-y-4">
              {topPlaceTypes.map((item, index) => {
                const width = Math.max((item.count / maxPlaceCount) * 100, 6);
                return (
                  <div key={item.type}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="text-[10px] font-semibold tabular-nums text-white/35">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="truncate text-xs font-medium capitalize text-white/65">
                          {formatType(item.type)}
                        </span>
                      </div>
                      <span className="text-[11px] tabular-nums text-white/50">
                        {item.count}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.055]">
                      <div
                        className="dashboard-progress h-full rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-sky-400 shadow-[0_0_12px_rgba(167,139,250,0.45)]"
                        style={{
                          width: `${width}%`,
                          animationDelay: `${index * 90}ms`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyChart
              emoji="🧭"
              title="No place patterns yet"
              copy="We'll surface the places that support your mood over time."
            />
          )}
        </section>
      </div>
    </div>
  );
}
