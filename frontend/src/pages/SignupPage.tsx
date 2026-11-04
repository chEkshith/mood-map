import { Eye, EyeOff, Loader2, MapPinned } from "lucide-react";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { authApi, getApiErrorMessage } from "../api/client";
import { useMoodStore } from "../store/moodStore";

export function SignupPage() {
  const navigate = useNavigate();
  const setUser = useMoodStore((s) => s.setUser);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setIsLoading(true);
    try {
      const user = await authApi.signup({ email, password, display_name: displayName });
      setUser(user);
      toast.success(`Welcome to MoodMap, ${user.display_name}! 🎉`);
      navigate("/app");
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Signup failed. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col w-1/2 p-4">
        <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[1.75rem] glass-strong p-11">
          <div
            className="pointer-events-none absolute inset-0 opacity-80"
            style={{
              background:
                "radial-gradient(ellipse 90% 70% at 85% 0%, rgba(236,72,153,0.28), transparent 60%), radial-gradient(ellipse 80% 70% at 10% 100%, rgba(139,92,246,0.35), transparent 62%)",
            }}
          />

          <div className="relative flex items-center gap-3">
            <div className="glass-icon h-10 w-10 rounded-xl">
              <MapPinned className="h-4 w-4 text-violet-200" />
            </div>
            <span className="font-brand font-semibold text-white tracking-tight">MoodMap</span>
          </div>

          <div className="relative space-y-3.5">
            <span className="glass-chip px-3.5 py-1.5 text-[10px] uppercase tracking-[0.3em] text-violet-100/70 mb-2">
              Start your journey
            </span>
            {[
              { emoji: "😖", text: "Stressed? Find a quiet park nearby." },
              { emoji: "😰", text: "Anxious? Discover a calming café." },
              { emoji: "😄", text: "Happy? Explore a lively space to match your vibe." },
            ].map(({ emoji, text }) => (
              <div
                key={text}
                className="flex items-center gap-3 rounded-2xl glass-subtle px-4 py-3.5 text-sm text-slate-200/90 transition-all duration-300 hover:bg-white/10 hover:border-white/25"
              >
                <span className="text-xl">{emoji}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>

          <p className="relative text-white/30 text-xs">© {new Date().getFullYear()} MoodMap</p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-5 lg:p-12">
        <Link to="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
          <div className="glass-icon h-9 w-9 rounded-xl">
            <MapPinned className="h-4 w-4 text-violet-200" />
          </div>
          <span className="font-brand font-semibold text-white tracking-tight">MoodMap</span>
        </Link>

        <div className="w-full max-w-sm animate-slide-up glass-strong rounded-[1.75rem] p-6 sm:p-8">
          <div className="mb-8">
            <span className="glass-chip px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/50 mb-3">
              Create account
            </span>
            <h1 className="text-2xl font-semibold text-white mb-1.5 tracking-tight font-display">
              Begin your mood map
            </h1>
            <p className="text-slate-400/80 text-sm">Free forever. No card required.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="signup-name" className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wide">
                Display name
              </label>
              <input
                id="signup-name"
                type="text"
                required
                autoComplete="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wide">
                Email
              </label>
              <input
                id="signup-email"
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
              <label htmlFor="signup-password" className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wide">
                Password
                <span className="text-white/30 font-normal ml-1.5 normal-case">(min. 8 characters)</span>
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
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
              {isLoading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-white/45 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-violet-300 font-medium hover:text-violet-200 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
