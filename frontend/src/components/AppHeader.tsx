import { BarChart2, Clock, Info, LogOut, MapPinned, User } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../api/client";
import { useMoodStore } from "../store/moodStore";

const NAV_LINKS = [
  { to: "/app", label: "Map", icon: MapPinned },
  { to: "/dashboard", label: "Dashboard", icon: BarChart2 },
  { to: "/history", label: "History", icon: Clock },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/about", label: "About", icon: Info },
];

function getActiveLink(pathname: string) {
  return (
    NAV_LINKS.find(({ to }) => pathname === to || pathname.startsWith(`${to}/`)) ??
    NAV_LINKS[0]
  );
}

function Avatar({
  name,
  url,
  className,
}: {
  name?: string;
  url?: string | null;
  className: string;
}) {
  if (url) {
    return (
      <img
        src={url}
        alt={name ?? "Profile"}
        className={`rounded-full object-cover ring-1 ring-white/25 ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gradient-to-br from-violet-400/70 to-sky-400/70 text-xs font-bold text-white ring-1 ring-white/25 ${className}`}
    >
      {name?.[0]?.toUpperCase() ?? "?"}
    </div>
  );
}

export function AppHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useMoodStore((s) => s.user);
  const clearUser = useMoodStore((s) => s.clearUser);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false });
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const handleLogout = async () => {
    await authApi.logout();
    clearUser();
    navigate("/login");
  };

  const syncIndicator = useCallback(() => {
    const activeLink = getActiveLink(location.pathname);
    const element = linkRefs.current[activeLink.to];
    if (!element) return;
    setIndicator({
      left: element.offsetLeft,
      width: element.offsetWidth,
      visible: true,
    });
  }, [location.pathname]);

  useLayoutEffect(() => {
    syncIndicator();
  }, [syncIndicator]);

  useEffect(() => {
    window.addEventListener("resize", syncIndicator);
    return () => window.removeEventListener("resize", syncIndicator);
  }, [syncIndicator]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileOpen]);

  return (
    <header id="app-header" className="relative z-20 mx-3 mt-3 md:mx-5 md:mt-5">
      <nav className="app-nav flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 md:px-4">
        <NavLink to="/app" className="group relative z-10 flex items-center gap-3">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-gradient-to-br from-violet-500/30 via-white/[0.07] to-sky-500/20 shadow-[0_10px_28px_-14px_rgba(139,92,246,0.9),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-500 group-hover:-rotate-3 group-hover:scale-105 md:h-11 md:w-11">
            <span className="app-nav-brand-glow absolute inset-0 rounded-xl bg-violet-400/25 blur-lg" />
            <MapPinned className="relative h-4 w-4 text-violet-100 md:h-5 md:w-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-brand text-[17px] font-semibold tracking-tight text-white">
              MoodMap
            </span>
            <span className="mt-1 hidden text-[9px] font-medium uppercase tracking-[0.24em] text-white/35 sm:block">
              Find your calm
            </span>
          </span>
        </NavLink>

        <div className="relative z-10 flex items-center gap-2 md:gap-3">
          <div className="hidden items-center rounded-xl border border-white/10 bg-black/20 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:flex">
            <div className="relative flex items-center">
              <span
                aria-hidden="true"
                className="app-nav-pill pointer-events-none absolute inset-y-0 left-0 rounded-lg"
                style={{
                  width: indicator.width,
                  opacity: indicator.visible ? 1 : 0,
                  transform: `translateX(${indicator.left}px)`,
                }}
              />
              {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  ref={(element) => {
                    linkRefs.current[to] = element;
                  }}
                  className={({ isActive }) =>
                    `group relative z-10 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                      isActive ? "text-white" : "text-white/55 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`h-3.5 w-3.5 transition-all duration-300 ${
                          isActive
                            ? "scale-110 text-violet-100"
                            : "text-white/40 group-hover:-translate-y-0.5 group-hover:text-white/75"
                        }`}
                      />
                      <span>{label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="hidden h-6 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent md:block" />

          <div className="hidden items-center gap-2 md:flex">
            <NavLink
              to="/profile"
              className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] py-1 pl-1 pr-2.5 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.09] hover:shadow-[0_10px_30px_-16px_rgba(139,92,246,0.75)]"
            >
              <span className="relative">
                <Avatar
                  name={user?.display_name}
                  url={user?.avatar_url}
                  className="h-7 w-7 transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#080914] bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              </span>
              <span className="max-w-[110px] truncate text-xs font-medium text-white/70 transition-colors group-hover:text-white">
                {user?.display_name}
              </span>
            </NavLink>
            <button
              onClick={handleLogout}
              className="group inline-flex h-9 items-center gap-2 rounded-xl border border-transparent px-2.5 text-xs font-medium text-white/45 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.06] hover:text-white"
              aria-label="Log out"
            >
              <LogOut className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
              <span className="hidden xl:inline">Logout</span>
            </button>
          </div>

          <button
            className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="app-mobile-nav"
          >
            <span className="relative h-4 w-5">
              <span
                className={`absolute left-0 h-[1.5px] w-5 rounded-full bg-current transition-all duration-300 ${
                  mobileOpen ? "top-1/2 rotate-45" : "top-1"
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 h-[1.5px] w-5 -translate-y-1/2 rounded-full bg-current transition-all duration-300 ${
                  mobileOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 h-[1.5px] w-5 rounded-full bg-current transition-all duration-300 ${
                  mobileOpen ? "top-1/2 -rotate-45" : "bottom-1"
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div
          id="app-mobile-nav"
          className="app-nav absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 rounded-2xl p-2 animate-slide-up md:hidden"
        >
          <div className="mb-2 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <div className="relative">
              <Avatar
                name={user?.display_name}
                url={user?.avatar_url}
                className="h-9 w-9"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#080914] bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {user?.display_name}
              </p>
              <p className="truncate text-[11px] text-white/35">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-1">
            {NAV_LINKS.map(({ to, label, icon: Icon }, index) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `anim-stagger flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "border-white/15 bg-gradient-to-r from-violet-500/20 to-sky-500/10 text-white"
                      : "border-transparent text-white/55 hover:bg-white/[0.06] hover:text-white"
                  }`
                }
                style={{ animationDelay: `${index * 45}ms` }}
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-lg border ${
                        isActive
                          ? "border-violet-300/30 bg-violet-400/15 text-violet-100"
                          : "border-white/10 bg-white/[0.04] text-white/45"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    {label}
                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_10px_rgba(196,181,253,0.9)]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="group mt-2 flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-white/50 transition-all duration-300 hover:border-rose-300/20 hover:bg-rose-500/10 hover:text-rose-200"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/45 transition-colors group-hover:border-rose-300/20 group-hover:text-rose-200">
              <LogOut className="h-3.5 w-3.5" />
            </span>
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
