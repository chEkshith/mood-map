import { BarChart2, Clock, LogOut, MapPinned, Menu, User, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import BackgroundVideo from "./BackgroundVideo";
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

function NavBar() {
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
    <header className="glass sticky top-0 z-40 border-b border-white/8">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/app" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/20 flex items-center justify-center ring-1 ring-indigo-500/30 group-hover:bg-indigo-500/30 transition-all">
            <MapPinned className="h-4 w-4 text-indigo-400" />
          </div>
          <span className="font-bold text-white tracking-tight">
            Mood<span className="text-gradient">Map</span>
          </span>
        </NavLink>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150
                 ${isActive
                   ? "bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/25"
                   : "text-slate-400 hover:text-white hover:bg-white/5"
                 }`
              }
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.display_name}
                className="h-7 w-7 rounded-full object-cover ring-1 ring-white/10"
              />
            ) : (
              <div className="h-7 w-7 rounded-full bg-indigo-500/20 ring-1 ring-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400">
                {user?.display_name?.[0]?.toUpperCase()}
              </div>
            )}
            <span className="text-sm text-slate-400 font-medium">{user?.display_name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary !px-3 !py-1.5 !text-xs"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/8 px-4 py-3 space-y-1 animate-fade-in">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                 ${isActive
                   ? "bg-indigo-500/15 text-indigo-300"
                   : "text-slate-400 hover:text-white hover:bg-white/5"
                 }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
          <div className="pt-2 border-t border-white/8 mt-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function ProtectedLayout() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  const { isLoading } = useAuth();

  return (
    <>
      <BackgroundVideo />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(15, 23, 42, 0.72)",
            color: "#f1f5f9",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "12px",
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
            backdropFilter: "blur(18px) saturate(160%)",
          },
          success: {
            iconTheme: { primary: "#818cf8", secondary: "#1e293b" },
          },
          error: {
            iconTheme: { primary: "#f87171", secondary: "#1e293b" },
          },
        }}
      />

      <div className="relative z-10">
        {isLoading ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="glass rounded-3xl px-8 py-7 flex flex-col items-center gap-4">
              <div className="h-10 w-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center ring-1 ring-indigo-500/30">
                <MapPinned className="h-5 w-5 text-indigo-400 animate-pulse" />
              </div>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<ProtectedLayout />}>
                <Route path="/app" element={<AppPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        )}
      </div>
    </>
  );
}
