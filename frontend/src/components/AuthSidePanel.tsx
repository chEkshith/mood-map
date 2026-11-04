import { MapPinned } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type AuthSidePanelProps = {
  accent?: "violet" | "pink";
  children: ReactNode;
};

export function AuthSidePanel({ accent = "violet", children }: AuthSidePanelProps) {
  return (
    <div className="hidden lg:flex flex-col w-[47%] py-16 px-3">
      <div className="auth-panel relative flex h-full flex-col justify-between overflow-hidden rounded-[1.75rem] glass-strong p-11">
        <div className="auth-panel__video-frame" aria-hidden="true">
          <video
            className="auth-panel__video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
          >
            <source src="/login_video.webm" type="video/webm" />
          </video>
        </div>

        <div className="auth-panel__scrim" aria-hidden="true" />
        <div className={`auth-panel__glow auth-panel__glow--${accent}`} aria-hidden="true" />
        <div className="auth-panel__grid" aria-hidden="true" />
        <div className="auth-panel__beam" aria-hidden="true" />
        <span className="auth-panel__orb auth-panel__orb--one" aria-hidden="true" />
        <span className="auth-panel__orb auth-panel__orb--two" aria-hidden="true" />

        <Link
          to="/"
          className="anim-stagger relative z-10 flex w-fit items-center gap-3"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="glass-icon h-10 w-10 rounded-xl">
            <MapPinned className="h-4 w-4 text-violet-200" />
          </div>
          <span className="font-brand font-semibold text-white tracking-tight">MoodMap</span>
        </Link>

        <div className="relative z-10">{children}</div>

        <p
          className="anim-fade relative z-10 text-xs text-white/35"
          style={{ animationDelay: "0.7s" }}
        >
          © {new Date().getFullYear()} MoodMap · Made for calmer days
        </p>
      </div>
    </div>
  );
}
