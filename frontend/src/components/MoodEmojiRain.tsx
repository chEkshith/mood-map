import { useEffect, useMemo, useState, type CSSProperties } from "react";

const MOODS = [
  { emoji: "😖", glow: "rgba(244, 63, 94, 0.9)" },
  { emoji: "😰", glow: "rgba(251, 146, 60, 0.9)" },
  { emoji: "😐", glow: "rgba(203, 213, 225, 0.9)" },
  { emoji: "🥱", glow: "rgba(167, 139, 250, 0.9)" },
  { emoji: "😄", glow: "rgba(52, 211, 153, 0.9)" },
  { emoji: "😔", glow: "rgba(56, 189, 248, 0.9)" },
];

type FallingMood = {
  id: number;
  emoji: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
  drift: number;
  rotate: number;
  glow: string;
};

export function MoodEmojiRain() {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  const emojis = useMemo<FallingMood[]>(
    () =>
      Array.from({ length: 10 }, (_, id) => {
        const mood = MOODS[id % MOODS.length];
        return {
          id,
          emoji: mood.emoji,
          glow: mood.glow,
          left: 6 + Math.random() * 88,
          delay: Math.random() * 0.45,
          duration: 1.7 + Math.random() * 0.8,
          size: 1.6 + Math.random() * 1.6,
          drift: (Math.random() - 0.5) * 80,
          rotate: (Math.random() - 0.5) * 60,
        };
      }),
    []
  );

  useEffect(() => {
    if (!isVisible) return;
    const timeout = window.setTimeout(() => setIsVisible(false), 3100);
    return () => window.clearTimeout(timeout);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(139,92,246,0.16),transparent_58%)]" />
      {emojis.map((item) => (
        <span
          key={item.id}
          className="mood-emoji-fall absolute top-0 select-none"
          style={
            {
              left: `${item.left}%`,
              animationDelay: `${item.delay}s`,
              animationDuration: `${item.duration}s`,
              fontSize: `${item.size}rem`,
              filter: `drop-shadow(0 0 6px ${item.glow}) drop-shadow(0 0 18px ${item.glow})`,
              textShadow: `0 0 12px ${item.glow}, 0 0 34px ${item.glow}`,
              "--mood-drift": `${item.drift}px`,
              "--mood-rotate": `${item.rotate}deg`,
            } as CSSProperties
          }
        >
          {item.emoji}
        </span>
      ))}
    </div>
  );
}
