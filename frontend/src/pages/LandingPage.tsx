import {
  ArrowRight,
  ArrowUpRight,
  BarChart2,
  Clock,
  Coffee,
  MapPinned,
  Sparkles,
  Trees,
} from "lucide-react";
import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Mood check-ins",
    description:
      "Write a sentence or two. MoodMap reads the tone and picks a direction without a long questionnaire.",
  },
  {
    icon: MapPinned,
    title: "Places near you",
    description:
      "Suggestions come from Google Places and are filtered by distance, opening hours, and whether they fit the mood.",
  },
  {
    icon: BarChart2,
    title: "Patterns over time",
    description:
      "A quiet record of how your moods move week to week, so patterns are easier to notice.",
  },
  {
    icon: Clock,
    title: "History you can revisit",
    description:
      "Every check-in is saved. Look back at what helped, what didn't, and where you were.",
  },
];

const MOODS = [
  { label: "Stressed", strategy: "Reset" },
  { label: "Anxious", strategy: "Shift" },
  { label: "Bored", strategy: "Match" },
  { label: "Exhausted", strategy: "Reset" },
  { label: "Happy", strategy: "Match" },
  { label: "Melancholic", strategy: "Shift" },
];

const STEPS = [
  {
    title: "Create an account",
    desc: "An email and password is all it takes. No card, no setup wizard.",
  },
  {
    title: "Write how you feel",
    desc: "A sentence is enough. You don't need the perfect words.",
  },
  {
    title: "Share your location",
    desc: "Used once per check-in to find places you can actually reach.",
  },
  {
    title: "Pick a place and go",
    desc: "Open it in Maps, save it, or ask for another suggestion.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-black/75"
        aria-hidden="true"
      />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05060f]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between pl-4 pr-2 md:pl-6 md:pr-0">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/[0.05]">
              <MapPinned className="h-4 w-4 text-violet-200" />
            </div>
            <span className="font-brand text-[17px] font-semibold tracking-tight text-white">
              MoodMap
            </span>
          </Link>
          <div className="flex items-center gap-3 md:gap-5">
            <Link
              to="/login"
              className="text-sm font-medium text-white/55 transition-colors hover:text-white"
            >
              Log in
            </Link>
            <Link to="/signup" className="btn-primary !px-4 !py-2 !text-sm">
              Get started
            </Link>
          </div>
        </div>
      </header>

      <section className="px-4 pb-20 pt-16 md:px-6 md:pb-28 md:pt-24">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <p className="mb-6 flex items-center gap-3 text-sm text-white/45">
              <span className="h-px w-8 bg-white/25" />
              A calmer way to choose where to go
            </p>
            <h1 className="font-display text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl lg:text-[4.6rem]">
              Where you go can change how you feel.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300/75">
              Tell MoodMap how you're feeling. It suggests nearby places that fit the
              moment — somewhere to reset, shift, or lean into it.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/signup" className="btn-primary !px-6 !py-3 !text-base">
                Try MoodMap <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium text-white/55 transition-colors hover:text-white"
              >
                I already have an account
              </Link>
            </div>
            <p className="mt-4 text-xs text-white/35">
              Free to use. No card required.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-violet-500/5 blur-2xl" aria-hidden="true" />
            <div className="rounded-2xl border border-white/10 bg-[#0a0b16]/85 p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[11px] uppercase tracking-[0.18em] text-white/30">
                  Today · 4:12 pm
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-emerald-300/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Nearby
                </span>
              </div>

              <div className="py-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/30">
                  You wrote
                </p>
                <p className="mt-2 font-display text-xl leading-snug text-white">
                  "I'm wound up and need somewhere quiet."
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                    <Trees className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">The Quiet Garden</p>
                    <p className="mt-0.5 text-xs text-white/45">
                      Green space · 7 min walk · Usually calm
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-white/25" />
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                  <span className="text-white/40">
                    Matched to <span className="text-white/70">Stressed</span>
                  </span>
                  <span className="text-violet-300/80">Reset</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-xl border border-white/10 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-400/10 text-sky-300">
                    <Coffee className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-sm text-white">Corner Café</p>
                    <p className="text-xs text-white/40">10 min walk · Quiet at this hour</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-white/25" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-14 md:px-6 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-md font-display text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Not every feeling needs the same place.
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-white/50">
              MoodMap sorts how you feel into six moods and one of three directions:
              reset, shift, or match.
            </p>
          </div>
          <div className="grid grid-cols-2 border-l border-t border-white/10 sm:grid-cols-3 lg:grid-cols-6">
            {MOODS.map(({ label, strategy }) => (
              <div key={label} className="border-b border-r border-white/10 px-4 py-5">
                <p className="text-sm font-medium text-white/85">{label}</p>
                <p className="mt-1 text-xs text-white/40">{strategy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-20 md:px-6 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/35">
              What it does
            </p>
            <h2 className="mt-4 max-w-sm font-display text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl">
              Thoughtful tools, quietly useful.
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/50">
              No lengthy questionnaire. No endless browsing. Just enough help to decide
              where to go next.
            </p>
          </div>
          <div className="border-t border-white/10">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="grid gap-4 border-b border-white/10 py-6 sm:grid-cols-[2.5rem_1fr] sm:gap-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                  <Icon className="h-4 w-4 text-violet-200" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/45">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-20 md:px-6 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="max-w-xl">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/35">
              How it works
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
              From a feeling to a place in four steps.
            </h2>
          </div>
          <ol className="mt-10 border-t border-white/10">
            {STEPS.map(({ title, desc }, i) => (
              <li
                key={title}
                className="grid gap-3 border-b border-white/10 py-6 sm:grid-cols-[3rem_1fr_1.2fr] sm:items-baseline sm:gap-6"
              >
                <span className="text-xs tabular-nums text-white/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-medium text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-white/45">{desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Start with how you feel.
            </h2>
            <p className="mt-2 text-sm text-white/50">MoodMap will take it from there.</p>
          </div>
          <Link
            to="/signup"
            className="btn-primary w-full !px-6 !py-3 !text-base sm:w-auto"
          >
            Create a free account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 px-4 py-8 md:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-white/35 md:flex-row">
          <div className="flex items-center gap-2.5">
            <MapPinned className="h-4 w-4 text-violet-200/70" />
            <span className="font-brand font-medium text-white/60">MoodMap</span>
          </div>
          <span>© {new Date().getFullYear()} MoodMap</span>
          <div className="flex gap-5">
            <Link to="/login" className="transition-colors hover:text-white">
              Login
            </Link>
            <Link to="/signup" className="transition-colors hover:text-white">
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
