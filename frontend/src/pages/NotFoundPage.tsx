import { ArrowLeft, MapPinned } from "lucide-react";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="relative animate-scale-in glass-strong rounded-[1.75rem] p-10 max-w-lg w-full">
        <div className="glass-icon h-16 w-16 mx-auto mb-6">
          <MapPinned className="h-8 w-8 text-violet-200" />
        </div>

        <p className="text-6xl font-semibold font-display text-gradient mb-3 tracking-tight">404</p>
        <h1 className="text-2xl font-semibold font-display text-white mb-3 tracking-tight">Page not found</h1>
        <p className="text-white/50 max-w-sm mx-auto mb-8 leading-relaxed">
          Looks like this page got lost on the map. Let's navigate you back somewhere familiar.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">
            <ArrowLeft className="h-4 w-4" />
            Go to Home
          </Link>
          <Link to="/app" className="btn-secondary">
            Open the App
          </Link>
        </div>
      </div>
    </div>
  );
}
