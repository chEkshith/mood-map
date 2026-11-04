import { ArrowLeft, Eye, EyeOff, Loader2, MapPinned } from "lucide-react";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { authApi, getApiErrorMessage } from "../api/client";
import { useMoodStore } from "../store/moodStore";

export function LoginPage() {
  const navigate = useNavigate();
  const setUser = useMoodStore((s) => s.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await authApi.login({ email, password });
      setUser(user);
      toast.success(`Welcome back, ${user.display_name}!`);
      navigate("/app");
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Login failed. Check your credentials."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Dark overlay to improve content contrast over the background video */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-black/70"
        aria-hidden="true"
      />

      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-4">
        <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[1.75rem] glass-strong p-11">
          <div
            className="pointer-events-none absolute inset-0 opacity-80"
            style={{
              background:
                "radial-gradient(ellipse 90% 70% at 15% 0%, rgba(139,92,246,0.35), transparent 60%), radial-gradient(ellipse 70% 60% at 90% 90%, rgba(56,189,248,0.22), transparent 60%)",
            }}
          />

          <Link to="/" className="relative flex items-center gap-3 w-fit">
            <div className="glass-icon h-10 w-10 rounded-xl">
              <MapPinned className="h-4 w-4 text-violet-200" />
            </div>
            <span className="font-brand font-semibold text-white tracking-tight">MoodMap</span>
          </Link>

          <div className="relative">
            <span className="glass-chip px-3.5 py-1.5 text-[10px] uppercase tracking-[0.3em] text-violet-100/70 mb-6">
              Emotional intelligence
            </span>
            <blockquote className="font-display text-3xl font-medium text-white leading-[1.2] tracking-tight mb-6">
              "The places around you can shift how you feel inside — you just need the right guide."
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-400/80 to-sky-400/80 flex items-center justify-center text-sm font-bold text-white ring-1 ring-white/25">
                M
              </div>
              <div>
                <p className="text-sm font-semibold text-white">MoodMap</p>
                <p className="text-xs text-white/40">AI Wellness Platform</p>
              </div>
            </div>
          </div>

          <p className="relative text-white/30 text-xs">© {new Date().getFullYear()} MoodMap</p>
        </div>
      </div>

      {/* Right: Login form */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-5 lg:p-12">
        <Link
          to="/"
          className="absolute top-5 left-5 lg:top-7 lg:left-8 inline-flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>

        {/* Mobile logo */}
        <Link to="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
          <div className="glass-icon h-9 w-9 rounded-xl">
            <MapPinned className="h-4 w-4 text-violet-200" />
          </div>
          <span className="font-brand font-semibold text-white tracking-tight">MoodMap</span>
        </Link>

        <div className="w-full max-w-sm animate-slide-up glass-strong rounded-[1.75rem] p-6 sm:p-8">
          <div className="mb-8">
            <span className="glass-chip px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/50 mb-3">
              Welcome back
            </span>
            <h1 className="text-2xl font-semibold text-white mb-1.5 tracking-tight font-display">
              Sign in to your space
            </h1>
            <p className="text-slate-400/80 text-sm">Continue mapping how you feel.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wide">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="login-password" className="block text-xs font-medium text-white/60 uppercase tracking-wide">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full !py-3 mt-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-white/45 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-violet-300 font-medium hover:text-violet-200 transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
