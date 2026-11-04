import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const BRAND_LETTERS = "MoodMap".split("");
const SESSION_KEY = "moodmap-intro-seen";

export function IntroSplash() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined" || pathname !== "/") return false;
    return window.sessionStorage.getItem(SESSION_KEY) !== "1";
  });
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!visible) return;
    window.sessionStorage.setItem(SESSION_KEY, "1");
    const exitTimer = window.setTimeout(() => setExiting(true), 2200);
    const hideTimer = window.setTimeout(() => setVisible(false), 3000);
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`intro-splash ${exiting ? "intro-splash--exit" : ""}`}
      aria-hidden="true"
    >
      <div className="intro-splash__glow" />
      <div className="intro-splash__content">
        <p className="intro-splash__eyebrow">Your mood · Your place</p>
        <h1 className="intro-splash__title" aria-label="MoodMap">
          {BRAND_LETTERS.map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              className="intro-splash__letter"
              style={{ animationDelay: `${0.15 + index * 0.08}s` }}
            >
              {letter}
            </span>
          ))}
        </h1>
        <div className="intro-splash__rule" />
        <p className="intro-splash__tagline">
          Find the place that fits how you feel
        </p>
      </div>
    </div>
  );
}
