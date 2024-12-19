import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center p-4 space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-500" />
          <h2 className="text-lg font-semibold">Something went wrong</h2>
          <button
            className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
} 