import { Sparkles } from "lucide-react";
import type { MoodResult } from "../types";

const MOOD_CONFIG: Record<
  string,
  { emoji: string; label: string; color: string; bg: string; glow: string }
> = {
  stressed:    { emoji: "😖", label: "Stressed",    color: "text-red-300",    bg: "from-red-500/15 to-orange-500/5",   glow: "rgba(239,68,68,0.15)" },
  anxious:     { emoji: "😰", label: "Anxious",     color: "text-amber-300",  bg: "from-amber-500/15 to-yellow-500/5", glow: "rgba(245,158,11,0.15)" },
  bored:       { emoji: "😐", label: "Bored",       color: "text-blue-300",   bg: "from-blue-500/15 to-cyan-500/5",    glow: "rgba(59,130,246,0.15)" },
  exhausted:   { emoji: "🥱", label: "Exhausted",   color: "text-violet-300", bg: "from-violet-500/15 to-purple-500/5",glow: "rgba(139,92,246,0.15)" },
  happy:       { emoji: "😄", label: "Happy",       color: "text-emerald-300",bg: "from-emerald-500/15 to-green-500/5",glow: "rgba(16,185,129,0.15)" },
  melancholic: { emoji: "😔", label: "Melancholic", color: "text-slate-300",  bg: "from-slate-500/15 to-blue-500/5",   glow: "rgba(100,116,139,0.15)" },
};

const STRATEGY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  reset: { label: "Reset", color: "text-blue-300",  bg: "bg-blue-500/15 border-blue-500/25" },
  shift: { label: "Shift", color: "text-amber-300", bg: "bg-amber-500/15 border-amber-500/25" },
  match: { label: "Match", color: "text-green-300", bg: "bg-green-500/15 border-green-500/25" },
};

interface Props {
  mood: MoodResult;
  whySuggested?: string;
}

export function MoodResultBadge({ mood, whySuggested }: Props) {
  const config = MOOD_CONFIG[mood.classified_mood] ?? MOOD_CONFIG.bored;
  const strategy = STRATEGY_CONFIG[mood.strategy] ?? STRATEGY_CONFIG.match;
  const confidencePct = Math.round(mood.confidence * 100);

  return (
    <div
      className={`card p-5 bg-gradient-to-br ${config.bg} animate-scale-in`}
      style={{ boxShadow: `0 4px 24px ${config.glow}, 0 0 0 1px rgba(255,255,255,0.06) inset` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{config.emoji}</span>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-0.5">Detected mood</p>
            <h3 className={`text-lg font-bold ${config.color}`}>{config.label}</h3>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-500 mb-0.5">Confidence</p>
          <p className={`text-sm font-bold ${config.color}`}>{confidencePct}%</p>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="h-1 w-full bg-white/5 rounded-full mb-4 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${config.color.replace("text-", "bg-")}`}
          style={{ width: `${confidencePct}%` }}
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span className="text-xs text-slate-400 font-medium">Strategy:</span>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${strategy.bg} ${strategy.color}`}>
          {strategy.label}
        </span>
      </div>

      {whySuggested && (
        <p className="text-xs text-slate-500 mt-2 leading-relaxed border-t border-white/5 pt-2">
          {whySuggested}
        </p>
      )}
    </div>
  );
}
