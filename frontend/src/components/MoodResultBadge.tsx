import type { MoodEnum, MoodResult } from "../types";

const MOOD_EMOJI: Record<MoodEnum, string> = {
  stressed: "😖",
  anxious: "😰",
  bored: "😐",
  exhausted: "🥱",
  happy: "😄",
  melancholic: "😔",
};

const STRATEGY_STYLES: Record<string, string> = {
  reset: "bg-blue-100 text-blue-700",
  shift: "bg-amber-100 text-amber-700",
  match: "bg-green-100 text-green-700",
};

interface Props {
  mood: MoodResult;
  whySuggested?: string;
}

export function MoodResultBadge({ mood, whySuggested }: Props) {
  const percentage = Math.round(mood.confidence * 100);
  const strategyClass = STRATEGY_STYLES[mood.strategy] ?? "bg-gray-100 text-gray-700";

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-4xl">{MOOD_EMOJI[mood.classified_mood]}</span>
        <div>
          <h2 className="text-lg font-bold text-gray-900 capitalize">
            You seem {mood.classified_mood}
          </h2>
          <span
            className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${strategyClass}`}
          >
            {mood.strategy}
          </span>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Confidence</span>
          <span>{percentage}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {whySuggested && <p className="text-sm italic text-gray-500">{whySuggested}</p>}
    </div>
  );
}
