import { BarChart2, Clock, LogOut, MapPinned, Menu, User, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import BackgroundVideo from "./BackgroundVideo";
import { AuroraBackground } from "./components/AuroraBackground";
import { IntroSplash } from "./components/IntroSplash";
import { VortxBackground } from "./components/VortxBackground";
import { VortxLogo } from "./components/VortxLogo";
import { authApi } from "./api/client";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import { AppPage } from "./pages/AppPage";
import { DashboardPage } from "./pages/DashboardPage";
import { HistoryPage } from "./pages/HistoryPage";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SignupPage } from "./pages/SignupPage";
import { useMoodStore } from "./store/moodStore";

const NAV_LINKS = [
  { to: "/app", label: "Map", icon: MapPinned },
  { to: "/dashboard", label: "Dashboard", icon: BarChart2 },
  { to: "/history", label: "History", icon: Clock },
  { to: "/profile", label: "Profile", icon: User },
];

function PublicLayout() {
  return (
    <>
      <BackgroundVideo />
      <AuroraBackground className="fixed inset-0 z-0" />
      <div className="relative z-10">
        <Outlet />
      </div>
    </>
  );
}

function VortxLayout() {
  const navigate = useNavigate();
  const user = useMoodStore((s) => s.user);
  const clearUser = useMoodStore((s) => s.clearUser);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await authApi.logout();
    clearUser();
    navigate("/login");
  };

  return (
    <div className="h-screen w-full bg-black p-3 md:p-4 font-inter">
      <div className="w-full h-full rounded-[1.75rem] flex flex-col overflow-hidden relative bg-black/40 ring-1 ring-white/10">
        <VortxBackground />
        <AuroraBackground className="absolute inset-0 z-0" />

        <nav className="relative z-10 mx-3 mt-3 md:mx-5 md:mt-5 flex items-center justify-between gap-3 rounded-2xl glass px-3 py-2.5 md:px-5 md:py-3">
          <NavLink
            to="/app"
            className="anim-stagger flex items-center gap-3 group"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="glass-icon h-10 w-10 md:h-11 md:w-11 rounded-xl transition-transform duration-300 group-hover:scale-105">
              <VortxLogo className="w-6 h-6 md:w-7 md:h-7" />
            </span>
            <span className="flex flex-col">
              <span className="text-white text-[10px] md:text-xs tracking-[0.4em] font-light">
                V O R T X
              </span>
              <span className="text-[8px] md:text-[9px] uppercase tracking-[0.28em] text-white/40">
                Creations
              </span>
            </span>
          </NavLink>

          <div
            className="anim-stagger flex items-center gap-2 md:gap-3"
            style={{ animationDelay: "0.2s" }}
          >
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-300
                     ${
                       isActive
                         ? "bg-white/15 text-white border border-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_10px_24px_-12px_rgba(0,0,0,0.65)]"
                         : "text-white/65 hover:text-white hover:bg-white/10 border border-transparent"
                     }`
                  }
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </span>
                </NavLink>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-2.5">
              <div className="flex items-center gap-2 rounded-full glass-subtle pl-1 pr-3 py-1">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.display_name}
                    className="h-7 w-7 rounded-full object-cover ring-1 ring-white/25"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-400/70 to-sky-400/70 ring-1 ring-white/25 flex items-center justify-center text-xs font-bold text-white">
                    {user?.display_name?.[0]?.toUpperCase()}
                  </div>
                )}
                <span className="text-xs text-white/75 font-medium max-w-[110px] truncate">
                  {user?.display_name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="btn-secondary !px-3.5 !py-2 !text-xs"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>

            <button
              className="md:hidden glass-icon h-10 w-10 rounded-xl text-white transition-colors hover:bg-white/10"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div className="md:hidden relative z-10 mx-3 mt-2 space-y-1.5 rounded-2xl glass p-3 anim-stagger">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-white/15 text-white border border-white/25"
                      : "text-white/70 hover:text-white hover:bg-white/10 border border-transparent"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="btn-secondary w-full !py-3 !text-sm mt-1"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}

        <main className="relative z-10 flex-1 overflow-y-auto px-4 md:px-6 pb-8 md:pb-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const { isLoading } = useAuth();

  return (
    <>
      <IntroSplash />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(255, 255, 255, 0.08)",
            color: "#f8fafc",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "14px",
            fontSize: "14px",
            fontFamily: "Plus Jakarta Sans, sans-serif",
            backdropFilter: "blur(20px) saturate(180%)",
            boxShadow: "0 24px 60px -18px rgba(2,6,23,0.75), inset 0 1px 0 rgba(255,255,255,0.22)",
          },
          success: {
            iconTheme: { primary: "#c4b5fd", secondary: "#1e1b4b" },
          },
          error: {
            iconTheme: { primary: "#fda4af", secondary: "#4c0519" },
          },
        }}
      />

      {isLoading ? (
        <>
          <BackgroundVideo />
          <AuroraBackground className="fixed inset-0 z-0" />
          <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
            <div className="glass-strong rounded-3xl px-10 py-9 flex flex-col items-center gap-5">
              <div className="glass-icon h-12 w-12 rounded-2xl">
                <MapPinned className="h-5 w-5 text-violet-300 animate-pulse" />
              </div>
              <p className="text-xs font-medium tracking-[0.28em] uppercase text-white/50">
                Loading your space
              </p>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet-400 to-sky-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<VortxLayout />}>
              <Route path="/app" element={<AppPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Routes>
      )}
    </>
  );
}
