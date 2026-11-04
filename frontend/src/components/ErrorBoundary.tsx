import { AlertTriangle } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";
import BackgroundVideo from "../BackgroundVideo";
import { AuroraBackground } from "./AuroraBackground";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("ErrorBoundary caught an error", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <>
          <BackgroundVideo />
          <AuroraBackground className="fixed inset-0 z-0" />
          <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
            <div className="glass-strong rounded-[1.75rem] p-8 max-w-sm w-full text-center">
              <div className="glass-icon h-14 w-14 mx-auto mb-4">
                <AlertTriangle className="h-6 w-6 text-amber-300" />
              </div>
              <h1 className="text-lg font-semibold font-display text-white mb-2 tracking-tight">Something went wrong</h1>
              <p className="text-sm text-white/50 mb-6">
                An unexpected error occurred. Try reloading the page.
              </p>
              <button
                onClick={this.handleReload}
                className="btn-primary w-full"
              >
                Reload
              </button>
            </div>
          </div>
        </>
      );
    }

    return this.props.children;
  }
}
