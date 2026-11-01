import { AlertTriangle } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";
import BackgroundVideo from "../BackgroundVideo";

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
          <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
            <div className="glass rounded-3xl p-8 max-w-sm w-full text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-amber-400 mb-4" />
              <h1 className="text-lg font-bold text-white mb-2">Something went wrong</h1>
              <p className="text-sm text-slate-400 mb-6">
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
