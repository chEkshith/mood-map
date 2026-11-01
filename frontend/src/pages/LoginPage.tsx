import { Eye, EyeOff, Loader2, MapPinned } from "lucide-react";
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
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 border-r border-white/10 bg-slate-950/20 backdrop-blur-2xl relative overflow-hidden">
        <div className="relative flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/20 flex items-center justify-center ring-1 ring-indigo-500/30">
            <MapPinned className="h-4 w-4 text-indigo-400" />
          </div>
          <span className="font-bold text-white">MoodMap</span>
        </div>
        <div className="relative">
          <blockquote className="text-xl font-medium text-slate-200 leading-relaxed mb-4">
            "The places around you can shift how you feel inside — you just need the right guide."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-300">M</div>
            <div>
              <p className="text-sm font-medium text-white">MoodMap</p>
              <p className="text-xs text-slate-500">AI Wellness Platform</p>
            </div>
          </div>
        </div>
        <p className="relative text-slate-600 text-xs">© {new Date().getFullYear()} MoodMap</p>
      </div>

      {/* Right: Login form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        {/* Mobile logo */}
        <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/20 flex items-center justify-center ring-1 ring-indigo-500/30">
            <MapPinned className="h-4 w-4 text-indigo-400" />
          </div>
          <span className="font-bold text-white">MoodMap</span>
        </Link>

        <div className="w-full max-w-sm animate-slide-up glass rounded-3xl p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
            <p className="text-slate-400 text-sm">Sign in to your MoodMap account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-slate-300 mb-1.5">
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
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-sm font-medium text-slate-300">
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
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full !py-3"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
