import { ArrowRight, BarChart2, Clock, MapPinned, Sparkles, Star, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Mood Classification",
    description:
      "Just describe how you feel in plain words. Our LLaMA3-powered AI instantly reads your emotional state with nuance.",
    color: "text-violet-300",
    bg: "from-violet-500/25 to-fuchsia-500/10",
    border: "border-violet-400/20",
    glow: "group-hover:shadow-[0_24px_70px_-24px_rgba(139,92,246,0.65)]",
  },
  {
    icon: MapPinned,
    title: "Location-Aware Suggestions",
    description:
      "MoodMap matches your mood to nearby places — cafés, parks, gyms, bookshops — using Google Places in real-time.",
    color: "text-sky-300",
    bg: "from-sky-500/25 to-blue-500/10",
    border: "border-sky-400/20",
    glow: "group-hover:shadow-[0_24px_70px_-24px_rgba(56,189,248,0.65)]",
  },
  {
    icon: BarChart2,
    title: "Mood Analytics",
    description:
      "Track your emotional patterns over time with beautiful charts. Understand your mood cycles and streaks.",
    color: "text-emerald-300",
    bg: "from-emerald-500/25 to-teal-500/10",
    border: "border-emerald-400/20",
    glow: "group-hover:shadow-[0_24px_70px_-24px_rgba(16,185,129,0.6)]",
  },
  {
    icon: Clock,
    title: "Full Mood History",
    description:
      "Every session is logged. Filter by mood, revisit past entries, and see how your emotional landscape evolves.",
    color: "text-amber-300",
    bg: "from-amber-500/25 to-orange-500/10",
    border: "border-amber-400/20",
    glow: "group-hover:shadow-[0_24px_70px_-24px_rgba(245,158,11,0.6)]",
  },
];

const MOODS = [
  { emoji: "😖", label: "Stressed", strategy: "Reset", color: "from-rose-500/20 to-orange-500/5 border-rose-400/20" },
  { emoji: "😰", label: "Anxious", strategy: "Shift", color: "from-amber-500/20 to-yellow-500/5 border-amber-400/20" },
  { emoji: "😐", label: "Bored", strategy: "Match", color: "from-sky-500/20 to-cyan-500/5 border-sky-400/20" },
  { emoji: "🥱", label: "Exhausted", strategy: "Reset", color: "from-violet-500/20 to-purple-500/5 border-violet-400/20" },
  { emoji: "😄", label: "Happy", strategy: "Match", color: "from-emerald-500/20 to-green-500/5 border-emerald-400/20" },
  { emoji: "😔", label: "Melancholic", strategy: "Shift", color: "from-indigo-500/20 to-blue-500/5 border-indigo-400/20" },
];

const STEPS = [
  { num: "01", title: "Sign up free", desc: "Create your account in seconds — no credit card needed." },
  { num: "02", title: "Describe your mood", desc: "Type how you're feeling in natural language, as little or as much as you like." },
  { num: "03", title: "Allow location", desc: "MoodMap reads your GPS to find places near you right now." },
  { num: "04", title: "Explore your map", desc: "See curated nearby places on an interactive map, tailored to your emotional state." },
];

export function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Dark overlay to improve content contrast over the background video */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-black/55"
        aria-hidden="true"
      />

      {/* Nav */}
      <header className="sticky top-0 z-40 px-3 pt-3 md:pt-4">
        <div className="max-w-6xl mx-auto glass rounded-2xl px-4 md:px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="glass-icon h-9 w-9 rounded-xl">
              <MapPinned className="h-4 w-4 text-violet-200" />
            </div>
            <span className="font-brand font-semibold text-white tracking-tight text-[17px]">
              Mood<span className="text-gradient-brand">Map</span>
            </span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Link to="/login" className="btn-secondary !py-2 !px-4 !text-sm">
              Log in
            </Link>
            <Link to="/signup" className="btn-primary !py-2 !px-4 !text-sm">
              Get started <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32 px-4">
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="glass-chip px-4 py-2 text-violet-100/90 text-xs font-medium mb-7 animate-fade-in font-accent tracking-[0.18em] uppercase">
            <Zap className="h-3 w-3 text-violet-300" />
            AI-Powered Emotional Wellness
          </div>

          <h1 className="font-display text-[2.75rem] leading-[1.02] sm:text-6xl md:text-7xl lg:text-[5.25rem] font-semibold text-white mb-6 animate-slide-up tracking-[-0.045em] text-neon">
            Your mood.
            <br />
            <span className="text-gradient italic">Your perfect place.</span>
          </h1>

          <p className="font-accent text-lg md:text-xl text-slate-300/80 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Describe how you feel, and MoodMap finds nearby places suited to help you
            reset, shift, or match your current emotional state.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/signup" className="btn-primary !px-8 !py-3.5 !text-base w-full sm:w-auto">
              Start for free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/login" className="btn-secondary !px-8 !py-3.5 !text-base w-full sm:w-auto">
              Sign in to your account
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-12 inline-flex items-center gap-3 glass-subtle rounded-full px-4 py-2 text-slate-400 text-sm animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="flex -space-x-2">
              {["V", "A", "R", "S"].map((letter) => (
                <div key={letter} className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-400/70 to-sky-400/70 ring-2 ring-[#080a18] flex items-center justify-center text-[10px] font-bold text-white">
                  {letter}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-amber-300 text-amber-300" />
              ))}
            </div>
            <span className="text-xs text-white/60">Loved by wellness seekers</span>
          </div>
        </div>
      </section>

      {/* Mood Chips */}
      <section className="py-12 px-4 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-white/40 text-xs font-semibold mb-6 uppercase tracking-[0.3em]">
            We understand every mood
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {MOODS.map(({ emoji, label, strategy, color }) => (
              <div
                key={label}
                className={`card group flex flex-col items-center gap-2 p-4 bg-gradient-to-b ${color} transition-all duration-300 hover:-translate-y-1.5 hover:border-white/30`}
              >
                <span className="text-3xl transition-transform duration-300 group-hover:scale-110">{emoji}</span>
                <span className="text-xs font-semibold text-slate-100">{label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide backdrop-blur-md
                  ${strategy === "Reset" ? "bg-blue-400/15 text-blue-200" :
                    strategy === "Shift" ? "bg-amber-400/15 text-amber-200" :
                    "bg-emerald-400/15 text-emerald-200"}`}>
                  {strategy}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="glass-chip px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-white/50 mb-5">
              Capabilities
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-semibold text-white mb-4 tracking-tight text-neon">
              Everything you need to
              <span className="text-gradient"> feel better</span>
            </h2>
            <p className="font-accent text-base md:text-lg text-slate-400/90 max-w-xl mx-auto leading-relaxed">
              MoodMap combines AI, real-time location, and wellness science to guide you to the right place at the right moment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FEATURES.map(({ icon: Icon, title, description, color, bg, border, glow }) => (
              <div key={title} className={`card group p-6 md:p-7 border ${border} transition-all duration-300 hover:-translate-y-1.5 ${glow}`}>
                <div className={`glass-icon h-12 w-12 mb-5 bg-gradient-to-br ${bg}`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 tracking-tight text-neon">{title}</h3>
                <p className="text-sm text-slate-400/90 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="glass-chip px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-white/50 mb-5">
              The flow
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-semibold text-white mb-4 tracking-tight text-neon">
              How it works
            </h2>
            <p className="font-accent text-base md:text-lg text-slate-400/90">
              From feeling to finding — in under 30 seconds.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {STEPS.map(({ num, title, desc }) => (
              <div key={num} className="card group p-6 flex gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/30">
                <span className="text-2xl font-bold font-display text-gradient shrink-0">{num}</span>
                <div>
                  <h3 className="font-semibold text-white mb-1 tracking-tight text-neon">{title}</h3>
                  <p className="text-sm text-slate-400/90 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-strong relative overflow-hidden rounded-3xl p-10 md:p-14 glow-indigo">
            <div
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background:
                  "radial-gradient(ellipse 80% 80% at 50% 0%, rgba(139,92,246,0.35), transparent 65%), radial-gradient(ellipse 70% 60% at 80% 100%, rgba(56,189,248,0.22), transparent 60%)",
              }}
            />
            <div className="relative">
              <div className="glass-icon h-14 w-14 mx-auto mb-6">
                <MapPinned className="h-6 w-6 text-violet-200" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-3 tracking-tight text-neon">
                Ready to find your place?
              </h2>
              <p className="font-accent text-base md:text-lg text-slate-300/80 mb-8 max-w-md mx-auto">
                It's free to start. No credit card, no commitment — just better days ahead.
              </p>
              <Link to="/signup" className="btn-primary !px-9 !py-3.5 !text-base">
                Create your free account <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <div className="flex items-center gap-2.5">
            <div className="glass-icon h-8 w-8 rounded-lg">
              <MapPinned className="h-3.5 w-3.5 text-violet-200" />
            </div>
            <span className="font-brand font-medium text-white/60">MoodMap</span>
          </div>
          <span>© {new Date().getFullYear()} MoodMap. All rights reserved.</span>
          <div className="flex gap-5">
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
            <Link to="/signup" className="hover:text-white transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
