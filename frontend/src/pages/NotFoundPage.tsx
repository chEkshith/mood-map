import { ArrowLeft, MapPinned } from "lucide-react";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="relative animate-scale-in glass rounded-3xl p-10 max-w-lg w-full">
        <div className="h-16 w-16 rounded-2xl bg-indigo-500/15 flex items-center justify-center ring-1 ring-indigo-500/25 mx-auto mb-6">
          <MapPinned className="h-8 w-8 text-indigo-400" />
        </div>

        <p className="text-6xl font-black text-gradient mb-3">404</p>
        <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
        <p className="text-slate-400 max-w-sm mb-8 leading-relaxed">
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
