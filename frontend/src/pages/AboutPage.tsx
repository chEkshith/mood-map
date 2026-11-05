import {
  ArrowUpRight,
  BrainCircuit,
  CalendarDays,
  Cloud,
  Code2,
  Compass,
  Database,
  GraduationCap,
  Globe2,
  Layers,
  Linkedin,
  MapPinned,
  MapPin,
  Radar,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

const DEVELOPER_IMAGE =
  "https://raw.githubusercontent.com/chEkshith/my-portfolio/f435595ee06a34e100ac7965c2cd4023a3c64dfe/portfolio_assets/Professional_Picture.jpeg";

const DEVELOPER = {
  name: "Ekshith Chokkani",
  role: "Full Stack Developer · AI Agent Builder · Problem Solver",
  summary:
    "A passionate Full Stack Developer, AI Agent Builder, and Problem Solver who thrives on learning, continuous growth, and building impactful digital solutions. Known for blending curiosity, adaptability, and persistence to tackle complex technical challenges with clean design and robust architecture. Currently open to work and exciting collaborations.",
  education: {
    degree: "B.Tech in Computer Science and Engineering (CSE)",
    institution: "Vasireddy Venkatadri Institute of Technology (VVITU)",
    graduation: "2027",
    cgpa: "9.0 / 10",
    status: "Open to work",
  },
  github: "https://github.com/chEkshith",
};

const PROFILE_LINKS: Array<{
  label: string;
  href: string;
  logo?: string;
  Icon?: LucideIcon;
  iconClass?: string;
  accent: string;
}> = [
  {
    label: "GitHub",
    href: "https://github.com/chEkshith",
    logo: "https://cdn.simpleicons.org/github/white",
    accent: "border-white/15 bg-white/[0.05] hover:border-white/30",
  },
  {
    label: "Portfolio",
    href: "https://ekshith-portfolio.vercel.app/",
    Icon: Globe2,
    iconClass: "text-violet-200",
    accent: "border-violet-400/20 bg-violet-400/10 hover:border-violet-400/40",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ekshith-ch/",
    Icon: Linkedin,
    iconClass: "text-[#0A66C2]",
    accent: "border-sky-400/20 bg-sky-400/10 hover:border-sky-400/40",
  },
  {
    label: "LeetCode",
    href: "https://leetcode.com/chokkaniekshith",
    logo: "https://cdn.simpleicons.org/leetcode/FFA116",
    accent: "border-amber-400/20 bg-amber-400/10 hover:border-amber-400/40",
  },
  {
    label: "CodeChef",
    href: "https://www.codechef.com/users/vvit23bq1a4710",
    logo: "https://cdn.simpleicons.org/codechef/D9C7B8",
    accent: "border-orange-400/20 bg-orange-400/10 hover:border-orange-400/40",
  },
];

const STATS = [
  {
    label: "Mood states",
    value: "6",
    meta: "Stressed · anxious · bored · exhausted · happy · melancholic",
    emoji: "🎭",
    accent: "border-violet-400/20 bg-violet-400/10",
    glow: "bg-violet-500/20",
    line: "from-violet-400/50 via-violet-400/10 to-transparent",
  },
  {
    label: "Suggestion strategies",
    value: "3",
    meta: "Reset · Shift · Match",
    emoji: "🎯",
    accent: "border-emerald-400/20 bg-emerald-400/10",
    glow: "bg-emerald-500/20",
    line: "from-emerald-400/50 via-emerald-400/10 to-transparent",
  },
  {
    label: "Live integrations",
    value: "3",
    meta: "Groq · Google Places · Cloudinary",
    emoji: "⚡",
    accent: "border-amber-400/20 bg-amber-400/10",
    glow: "bg-amber-500/20",
    line: "from-amber-400/50 via-amber-400/10 to-transparent",
  },
  {
    label: "Built for",
    value: "Calm",
    meta: "A quieter way to find your next place",
    emoji: "🌿",
    accent: "border-sky-400/20 bg-sky-400/10",
    glow: "bg-sky-500/20",
    line: "from-sky-400/50 via-sky-400/10 to-transparent",
  },
];

const INTERNAL_FEATURES = [
  {
    icon: BrainCircuit,
    title: "AI mood check-ins",
    description:
      "Write freely. The classifier reads tone and context instead of relying on a rigid questionnaire.",
    accent: "border-violet-400/20 bg-violet-400/10 text-violet-100",
  },
  {
    icon: Target,
    title: "Personalized strategies",
    description:
      "Every mood maps to a Reset, Shift, or Match approach so suggestions feel intentional.",
    accent: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
  },
  {
    icon: MapPin,
    title: "Nearby place suggestions",
    description:
      "Real places ranked by distance, rating, and how well they fit your current emotional state.",
    accent: "border-sky-400/20 bg-sky-400/10 text-sky-100",
  },
  {
    icon: Layers,
    title: "Wellness dashboard",
    description:
      "Mood frequency, streaks, trends, and top place types come together in one calm overview.",
    accent: "border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-100",
  },
  {
    icon: CalendarDays,
    title: "Mood history timeline",
    description:
      "Every check-in is saved and can be filtered, revisited, or removed whenever you want.",
    accent: "border-amber-400/20 bg-amber-400/10 text-amber-100",
  },
  {
    icon: ShieldCheck,
    title: "Secure accounts",
    description:
      "JWT-based sessions, encrypted passwords, profile management, and one-click account deletion.",
    accent: "border-rose-400/20 bg-rose-400/10 text-rose-100",
  },
];

const EXTERNAL_FEATURES = [
  {
    icon: Globe2,
    title: "Google Places",
    description:
      "Live venue data, ratings, addresses, and photos power every nearby recommendation.",
    accent: "border-sky-400/20 bg-sky-400/10 text-sky-100",
  },
  {
    icon: Zap,
    title: "Groq AI",
    description:
      "Fast LLM inference classifies free-form text with a keyword fallback when needed.",
    accent: "border-amber-400/20 bg-amber-400/10 text-amber-100",
  },
  {
    icon: Cloud,
    title: "Cloudinary",
    description:
      "Stores avatars and cached place photos with automatic resizing and optimization.",
    accent: "border-violet-400/20 bg-violet-400/10 text-violet-100",
  },
  {
    icon: Radar,
    title: "Browser geolocation",
    description:
      "A single location request centers your search without tracking you in the background.",
    accent: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
  },
  {
    icon: Compass,
    title: "Interactive map",
    description:
      "Leaflet maps with mood-aware pins and popups make nearby places easy to explore.",
    accent: "border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-100",
  },
  {
    icon: Users,
    title: "Responsive experience",
    description:
      "A mobile-friendly workspace that feels the same on desktop, tablet, and phone.",
    accent: "border-rose-400/20 bg-rose-400/10 text-rose-100",
  },
];

const TECH_STACK = [
  {
    icon: Code2,
    label: "Frontend",
    items: [
      "React 18",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "React Router",
      "Zustand",
      "React Leaflet",
      "Recharts",
      "Axios",
    ],
  },
  {
    icon: Layers,
    label: "Backend",
    items: [
      "Python",
      "FastAPI",
      "Pydantic",
      "Motor",
      "JWT (python-jose)",
      "Passlib",
      "SlowAPI",
      "Uvicorn",
    ],
  },
  {
    icon: Sparkles,
    label: "AI & Services",
    items: [
      "Groq (openai/gpt-oss-20b)",
      "Google Places API",
      "Cloudinary",
      "httpx",
    ],
  },
  {
    icon: Database,
    label: "Data & Ops",
    items: [
      "MongoDB",
      "Docker",
      "Nginx",
      "GitHub Actions",
      "Sentry",
      "Pytest",
    ],
  },
];

const SKILLS = [
  { label: "Languages", items: ["Python", "Java", "JavaScript", "Solidity", "HTML", "CSS"] },
  {
    label: "Frontend & Backend",
    items: ["React.js", "Node.js", "Express.js", "FastAPI", "Tailwind CSS"],
  },
  { label: "Databases", items: ["MongoDB", "MySQL", "SQLite"] },
  {
    label: "Tools & Platforms",
    items: [
      "VS Code",
      "Antigravity",
      "Git",
      "GitHub",
      "Postman",
      "Vercel",
      "GitHub Actions",
      "Arduino IDE",
      "MS Word",
    ],
  },
];

const PROJECTS = [
  {
    title: "Campus Connect",
    tag: "MERN Project",
    href: "https://github.com/Benny45123/CampusConnect",
    description:
      "A secure campus digital hub enabling students to share and discover academic resources through intelligent content management.",
    accent: "from-violet-500/20 to-sky-500/10 text-violet-100",
  },
  {
    title: "Mood Map",
    tag: "AI Mood Intelligence",
    href: "https://github.com/chEkshith/mood-map",
    description:
      "An AI-powered emotional wellness platform analyzing user moods to recommend nearby places based on emotional needs and location data.",
    accent: "from-emerald-500/20 to-teal-500/10 text-emerald-100",
  },
  {
    title: "Support Pilot",
    tag: "AI Agent",
    href: "https://github.com/chEkshith/customer-support-ai-employee-triage",
    description:
      "A local-first support intelligence platform that classifies customer queries, retrieves grounded information, and provides structured responses with source citations.",
    accent: "from-amber-500/20 to-orange-500/10 text-amber-100",
  },
  {
    title: "Health Sync",
    tag: "Unified Wellness",
    href: "https://github.com/chEkshith/health-sync",
    description:
      "A personal AI health concierge managing appointments, medication tracking, and fitness goals in a secure workflow.",
    accent: "from-rose-500/20 to-fuchsia-500/10 text-rose-100",
  },
];

function DeveloperAvatar() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-36 w-36 items-center justify-center rounded-[1.6rem] bg-gradient-to-br from-violet-400/80 to-sky-400/70 text-4xl font-bold text-white ring-2 ring-white/25 shadow-[0_18px_44px_-18px_rgba(76,29,149,0.85)] md:h-48 md:w-48">
        EC
      </div>
    );
  }

  return (
    <img
      src={DEVELOPER_IMAGE}
      alt={DEVELOPER.name}
      onError={() => setFailed(true)}
      className="h-36 w-36 rounded-[1.6rem] object-cover ring-2 ring-white/25 shadow-[0_18px_44px_-18px_rgba(0,0,0,0.85)] md:h-48 md:w-48"
    />
  );
}

export function AboutPage() {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>(".scroll-reveal")
    );
    if (!nodes.length) return;

    if (typeof IntersectionObserver === "undefined") {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -80px 0px" }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
      <section
        className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-[#16182d]/95 via-[#0a0c1b]/90 to-[#06070f]/88 p-5 backdrop-blur-xl scroll-reveal md:p-6"
        style={{ transitionDelay: "0.1s" }}
      >
        <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-violet-500/15 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-sky-500/10 blur-[100px]" />

        <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="glass-chip px-3 py-1 text-xs uppercase tracking-[0.26em] text-violet-100/70">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                About the project
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-white/45">
                <MapPinned className="h-3.5 w-3.5" />
                Built with care
              </span>
            </div>
            <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
              Behind <span className="text-gradient">MoodMap</span>
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
              MoodMap turns a few honest words into places that fit the moment —
              combining AI mood understanding, real-world location data, and a
              calm, private workspace.
            </p>
          </div>

          <Link
            to="/app"
            className="btn-primary group !px-5 !py-3 !text-sm self-start md:self-auto"
          >
            Try MoodMap
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {STATS.map(({ label, value, meta, emoji, accent, glow, line }, index) => (
          <div
            key={label}
            className="card dashboard-card group relative overflow-hidden p-5 scroll-reveal"
            style={{ transitionDelay: `${0.18 + index * 0.07}s` }}
          >
            <div
              className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full blur-3xl transition-transform duration-500 group-hover:scale-125 ${glow}`}
            />
            <div className="relative flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                  {label}
                </p>
                <p className="mt-2 truncate font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  {value}
                </p>
              </div>
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105 ${accent}`}
              >
                {emoji}
              </span>
            </div>
            <p className="relative mt-4 text-sm leading-relaxed text-white/45">
              {meta}
            </p>
            <div className={`relative mt-4 h-px w-full bg-gradient-to-r ${line}`} />
          </div>
        ))}
      </div>

      <section
        className="card dashboard-card mt-4 overflow-hidden scroll-reveal"
        style={{ transitionDelay: "0.46s" }}
      >
        <div className="flex items-center gap-3 border-b border-white/5 px-5 py-4 md:px-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-violet-100">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
              The idea
            </p>
            <h2 className="mt-0.5 font-display text-xl font-semibold tracking-tight text-white md:text-2xl">
              A mood-aware map, not another feed
            </h2>
          </div>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-3 md:p-6">
          {[
            {
              step: "01",
              title: "Describe the moment",
              desc: "A sentence or two is enough. MoodMap reads tone, context, and nuance.",
            },
            {
              step: "02",
              title: "Understand the mood",
              desc: "AI classifies how you feel and picks a Reset, Shift, or Match strategy.",
            },
            {
              step: "03",
              title: "Find a nearby place",
              desc: "Real venues are ranked by distance, rating, and emotional fit — then mapped.",
            },
          ].map(({ step, title, desc }) => (
            <div
              key={step}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <p className="font-display text-2xl font-semibold tracking-tight text-violet-200/80">
                {step}
              </p>
              <p className="mt-2 text-base font-medium text-white/85">{title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/45">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {[
          {
            key: "internal",
            eyebrow: "Inside the app",
            title: "Internal features",
            description:
              "Everything you interact with directly inside MoodMap.",
            items: INTERNAL_FEATURES,
          },
          {
            key: "external",
            eyebrow: "Behind the scenes",
            title: "External features",
            description:
              "The services and capabilities that extend MoodMap beyond the browser.",
            items: EXTERNAL_FEATURES,
          },
        ].map(({ key, eyebrow, title, description, items }) => (
          <section
            key={key}
            className="card dashboard-card overflow-hidden scroll-reveal"
            style={{ transitionDelay: key === "internal" ? "0.52s" : "0.58s" }}
          >
            <div className="border-b border-white/5 px-5 py-4 md:px-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
                {eyebrow}
              </p>
              <h2 className="mt-1 font-display text-xl font-semibold tracking-tight text-white md:text-2xl">
                {title}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-white/45">
                {description}
              </p>
            </div>

            <ul className="grid gap-3 p-5 sm:grid-cols-2 md:p-6">
              {items.map(({ icon: Icon, title: itemTitle, description: itemDesc, accent }) => (
                <li
                  key={itemTitle}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors duration-300 hover:border-white/20"
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${accent}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-3 text-base font-medium text-white/85">
                    {itemTitle}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/45">
                    {itemDesc}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section
        className="card dashboard-card mt-4 overflow-hidden scroll-reveal"
        style={{ transitionDelay: "0.66s" }}
      >
        <div className="flex items-center gap-3 border-b border-white/5 px-5 py-4 md:px-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/10 text-sky-100">
            <Code2 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
              Under the hood
            </p>
            <h2 className="mt-0.5 font-display text-xl font-semibold tracking-tight text-white md:text-2xl">
              Technologies used
            </h2>
          </div>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2 md:p-6 lg:grid-cols-4">
          {TECH_STACK.map(({ icon: Icon, label, items }) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-violet-100">
                  <Icon className="h-4 w-4" />
                </span>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/60">
                  {label}
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-white/55"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="card dashboard-card mt-4 overflow-hidden scroll-reveal"
        style={{ transitionDelay: "0.74s" }}
      >
        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-violet-500/10 blur-[90px]" />

        <div className="relative border-b border-white/5 px-5 py-4 md:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
            The developer
          </p>
          <h2 className="mt-1 flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-white md:text-2xl">
            <span className="text-base">👨‍💻</span>
            About the builder
          </h2>
        </div>

        <div className="relative p-5 md:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="shrink-0 self-start rounded-[1.7rem] bg-gradient-to-br from-violet-400/30 via-white/10 to-sky-400/20 p-1 shadow-[0_20px_60px_-24px_rgba(76,29,149,0.8)]">
              <DeveloperAvatar />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-white md:text-3xl">
                  {DEVELOPER.name}
                </h3>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  {DEVELOPER.education.status}
                </span>
              </div>
              <p className="mt-1.5 text-sm font-medium uppercase tracking-[0.12em] text-violet-200/70">
                {DEVELOPER.role}
              </p>
              <p className="mt-3 text-base leading-relaxed text-white/60 md:text-lg">
                {DEVELOPER.summary}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                {PROFILE_LINKS.map(({ label, href, logo, Icon, iconClass, accent }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className={`group inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium text-white/70 transition-all duration-300 hover:text-white ${accent}`}
                  >
                    {Icon ? (
                      <Icon className={`h-5 w-5 ${iconClass ?? ""}`} />
                    ) : (
                      <img
                        src={logo}
                        alt={`${label} logo`}
                        loading="lazy"
                        className="h-5 w-5 object-contain"
                      />
                    )}
                    {label}
                    <ArrowUpRight className="h-3 w-3 text-white/35 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Degree", value: DEVELOPER.education.degree, icon: GraduationCap },
              {
                label: "Institution",
                value: DEVELOPER.education.institution,
                icon: MapPinned,
              },
              { label: "Graduation", value: DEVELOPER.education.graduation, icon: CalendarDays },
              { label: "CGPA", value: DEVELOPER.education.cgpa, icon: Sparkles },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="flex items-center gap-1.5">
                  <Icon className="h-3 w-3 text-white/35" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                    {label}
                  </p>
                </div>
                <p className="mt-1.5 text-base font-medium leading-snug text-white/80">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
              Technical expertise
            </p>
            <div className="mt-3 space-y-3">
              {SKILLS.map(({ label, items }) => (
                <div key={label} className="flex flex-col gap-1.5 sm:flex-row sm:items-start">
                  <p className="w-full shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-white/35 sm:w-40 sm:pt-1">
                    {label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-white/55"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                Key projects
              </p>
              <span className="text-xs text-white/30">Selected work</span>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {PROJECTS.map(({ title, tag, description, accent, href }) => (
                <a
                  key={title}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_18px_44px_-24px_rgba(0,0,0,0.9)]"
                >
                  <div
                    className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${accent} blur-2xl`}
                  />
                  <ArrowUpRight className="absolute right-4 top-4 h-3.5 w-3.5 text-white/25 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white/70" />
                  <div className="relative pr-6">
                    <span
                      className={`inline-flex rounded-full border border-white/10 bg-gradient-to-r px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.16em] ${accent}`}
                    >
                      {tag}
                    </span>
                    <p className="mt-2 text-base font-semibold text-white/85 transition-colors group-hover:text-white">
                      {title}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/45">
                      {description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
