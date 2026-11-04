import {
  CircleDashed,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  MoonStar,
  Sun,
} from "lucide-react";
import type { MoodResult } from "../types";

const MOOD_CONFIG: Record<
  string,
  { label: string; icon: typeof Sun; iconClass: string; bar: string }
> = {
  stressed: {
    label: "Stressed",
    icon: CloudLightning,
    iconClass: "border-rose-400/20 bg-rose-400/10 text-rose-300",
    bar: "bg-rose-400",
  },
  anxious: {
    label: "Anxious",
    icon: CloudRain,
    iconClass: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    bar: "bg-amber-400",
  },
  bored: {
    label: "Bored",
    icon: CircleDashed,
    iconClass: "border-sky-400/20 bg-sky-400/10 text-sky-300",
    bar: "bg-sky-400",
  },
  exhausted: {
    label: "Exhausted",
    icon: MoonStar,
    iconClass: "border-violet-400/20 bg-violet-400/10 text-violet-300",
    bar: "bg-violet-400",
  },
  happy: {
    label: "Happy",
    icon: Sun,
    iconClass: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    bar: "bg-emerald-400",
  },
  melancholic: {
    label: "Melancholic",
    icon: CloudDrizzle,
    iconClass: "border-slate-400/20 bg-slate-400/10 text-slate-300",
    bar: "bg-slate-400",
  },
};

const STRATEGY_CONFIG: Record<string, { label: string; className: string }> = {
  reset: {
    label: "Reset",
    className: "border-blue-400/20 bg-blue-400/10 text-blue-200",
  },
  shift: {
    label: "Shift",
    className: "border-amber-400/20 bg-amber-400/10 text-amber-200",
  },
  match: {
    label: "Match",
    className: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  },
};

interface Props {
  mood: MoodResult;
  whySuggested?: string;
}

export function MoodResultBadge({ mood, whySuggested }: Props) {
  const config = MOOD_CONFIG[mood.classified_mood] ?? MOOD_CONFIG.bored;
  const strategy = STRATEGY_CONFIG[mood.strategy] ?? STRATEGY_CONFIG.match;
  const confidencePct = Math.round(mood.confidence * 100);
  const Icon = config.icon;

  return (
    <div className="app-panel animate-scale-in p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${config.iconClass}`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">
              Mood detected
            </p>
            <h3 className="mt-0.5 font-display text-lg font-semibold tracking-tight text-white">
              {config.label}
            </h3>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">
            Confidence
          </p>
          <p className="mt-0.5 text-sm font-semibold text-white/80">{confidencePct}%</p>
        </div>
      </div>

      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${config.bar}`}
          style={{ width: `${confidencePct}%` }}
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
        <span className="text-xs text-white/40">Suggested direction</span>
        <span
          className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${strategy.className}`}
        >
          {strategy.label}
        </span>
      </div>

      {whySuggested && (
        <p className="mt-3 text-xs leading-relaxed text-white/45">{whySuggested}</p>
      )}
    </div>
  );
}
