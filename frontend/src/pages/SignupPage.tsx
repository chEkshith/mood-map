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
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-gradient-to-br from-violet-950 via-slate-950 to-slate-950 border-r border-white/8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-violet-500/12 rounded-full blur-[80px]" />
          <div className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] bg-indigo-500/8 rounded-full blur-[60px]" />
        </div>
        <div className="relative flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/20 flex items-center justify-center ring-1 ring-indigo-500/30">
            <MapPinned className="h-4 w-4 text-indigo-400" />
          </div>
          <span className="font-bold text-white">MoodMap</span>
        </div>

        <div className="relative space-y-4">
          {[
            { emoji: "😖", text: "Stressed? Find a quiet park nearby." },
            { emoji: "😰", text: "Anxious? Discover a calming café." },
            { emoji: "😄", text: "Happy? Explore a lively space to match your vibe." },
          ].map(({ emoji, text }) => (
            <div key={text} className="flex items-center gap-3 card p-3 text-sm text-slate-300">
              <span className="text-xl">{emoji}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
        <p className="relative text-slate-600 text-xs">© {new Date().getFullYear()} MoodMap</p>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/20 flex items-center justify-center ring-1 ring-indigo-500/30">
            <MapPinned className="h-4 w-4 text-indigo-400" />
          </div>
          <span className="font-bold text-white">MoodMap</span>
        </Link>

        <div className="w-full max-w-sm animate-slide-up">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
            <p className="text-slate-400 text-sm">Start mapping your mood for free</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="signup-name" className="block text-sm font-medium text-slate-300 mb-1.5">
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
              <label htmlFor="signup-email" className="block text-sm font-medium text-slate-300 mb-1.5">
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
              <label htmlFor="signup-password" className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
                <span className="text-slate-600 font-normal ml-1">(min. 8 characters)</span>
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
              {isLoading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
