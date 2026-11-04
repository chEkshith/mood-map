import { MapPinned } from "lucide-react";
import { Outlet, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import BackgroundVideo from "./BackgroundVideo";
import { AppHeader } from "./components/AppHeader";
import { AuroraBackground } from "./components/AuroraBackground";
import { IntroSplash } from "./components/IntroSplash";
import { VortxBackground } from "./components/VortxBackground";
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
  return (
    <div className="h-screen w-full bg-black p-3 md:p-4 font-inter">
      <div className="w-full h-full rounded-[1.75rem] flex flex-col overflow-hidden relative bg-black/40 ring-1 ring-white/10">
        <VortxBackground />
        <AuroraBackground className="absolute inset-0 z-0" />
        <AppHeader />

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
