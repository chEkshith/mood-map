import { Loader2 } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AuroraBackground } from "./AuroraBackground";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <>
        <AuroraBackground className="fixed inset-0 z-0" />
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center gap-4">
          <div className="glass-icon h-14 w-14">
            <Loader2 className="h-6 w-6 animate-spin text-violet-200" />
          </div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/40">Loading your space</p>
        </div>
      </>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
