import { ArrowRight, BarChart2, Clock, MapPinned, Sparkles, Star, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Mood Classification",
    description:
      "Just describe how you feel in plain words. Our LLaMA3-powered AI instantly reads your emotional state with nuance.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: MapPinned,
    title: "Location-Aware Suggestions",
    description:
      "MoodMap matches your mood to nearby places — cafés, parks, gyms, bookshops — using Google Places in real-time.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
  },
  {
    icon: BarChart2,
    title: "Mood Analytics",
    description:
      "Track your emotional patterns over time with beautiful charts. Understand your mood cycles and streaks.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: Clock,
    title: "Full Mood History",
    description:
      "Every session is logged. Filter by mood, revisit past entries, and see how your emotional landscape evolves.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
];

const MOODS = [
  { emoji: "😖", label: "Stressed", strategy: "Reset", color: "from-red-500/20 to-orange-500/10 border-red-500/20" },
  { emoji: "😰", label: "Anxious", strategy: "Shift", color: "from-amber-500/20 to-yellow-500/10 border-amber-500/20" },
  { emoji: "😐", label: "Bored", strategy: "Match", color: "from-blue-500/20 to-cyan-500/10 border-blue-500/20" },
  { emoji: "🥱", label: "Exhausted", strategy: "Reset", color: "from-purple-500/20 to-violet-500/10 border-purple-500/20" },
  { emoji: "😄", label: "Happy", strategy: "Match", color: "from-green-500/20 to-emerald-500/10 border-green-500/20" },
  { emoji: "😔", label: "Melancholic", strategy: "Shift", color: "from-slate-500/20 to-blue-500/10 border-slate-500/20" },
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
      {/* Nav */}
      <header className="glass sticky top-0 z-40 border-b border-white/8">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-indigo-500/20 flex items-center justify-center ring-1 ring-indigo-500/30">
              <MapPinned className="h-4 w-4 text-indigo-400" />
            </div>
            <span className="font-bold text-white tracking-tight">
              Mood<span className="text-gradient">Map</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-secondary !py-1.5 !px-4 !text-sm">
              Log in
            </Link>
            <Link to="/signup" className="btn-primary !py-1.5 !px-4 !text-sm">
              Get started <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-36 px-4">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-violet-500/8 rounded-full blur-[80px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-6 animate-fade-in">
            <Zap className="h-3 w-3" />
            AI-Powered Emotional Wellness
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 animate-slide-up">
            Your mood.
            <br />
            <span className="text-gradient">Your perfect place.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Describe how you feel, and MoodMap finds nearby places suited to help you
            reset, shift, or match your current emotional state.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/signup" className="btn-primary !px-8 !py-3 !text-base w-full sm:w-auto">
              Start for free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/login" className="btn-secondary !px-8 !py-3 !text-base w-full sm:w-auto">
              Sign in to your account
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex items-center justify-center gap-2 text-slate-500 text-sm animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="flex -space-x-2">
              {["V", "A", "R", "S"].map((letter) => (
                <div key={letter} className="h-7 w-7 rounded-full bg-indigo-500/20 ring-2 ring-slate-950 flex items-center justify-center text-xs font-bold text-indigo-400">
                  {letter}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span>Loved by wellness seekers</span>
          </div>
        </div>
      </section>

      {/* Mood Chips */}
      <section className="py-12 px-4 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-slate-500 text-sm font-medium mb-6 uppercase tracking-widest">
            We understand every mood
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {MOODS.map(({ emoji, label, strategy, color }) => (
              <div
                key={label}
                className={`card flex flex-col items-center gap-2 p-4 bg-gradient-to-b ${color}`}
              >
                <span className="text-3xl">{emoji}</span>
                <span className="text-xs font-semibold text-slate-200">{label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                  ${strategy === "Reset" ? "bg-blue-500/20 text-blue-300" :
                    strategy === "Shift" ? "bg-amber-500/20 text-amber-300" :
                    "bg-green-500/20 text-green-300"}`}>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything you need to feel better
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              MoodMap combines AI, real-time location, and wellness science to guide you to the right place at the right moment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FEATURES.map(({ icon: Icon, title, description, color, bg, border }) => (
              <div key={title} className={`card p-6 border ${border} hover:scale-[1.01] transition-transform`}>
                <div className={`h-10 w-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How it works</h2>
            <p className="text-slate-400">From feeling to finding — in under 30 seconds.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {STEPS.map(({ num, title, desc }) => (
              <div key={num} className="card p-6 flex gap-4">
                <span className="text-2xl font-black text-gradient shrink-0">{num}</span>
                <div>
                  <h3 className="font-semibold text-white mb-1">{title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="card p-10 glow-indigo bg-gradient-to-b from-indigo-500/10 to-transparent border-indigo-500/20">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center ring-1 ring-indigo-500/30 mx-auto mb-6">
              <MapPinned className="h-6 w-6 text-indigo-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Ready to find your place?
            </h2>
            <p className="text-slate-400 mb-8">
              It's free to start. No credit card, no commitment — just better days ahead.
            </p>
            <Link to="/signup" className="btn-primary !px-10 !py-3 !text-base">
              Create your free account <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <MapPinned className="h-4 w-4 text-indigo-400" />
            <span className="font-semibold text-slate-400">MoodMap</span>
          </div>
          <span>© {new Date().getFullYear()} MoodMap. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-slate-300 transition-colors">Login</Link>
            <Link to="/signup" className="hover:text-slate-300 transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
