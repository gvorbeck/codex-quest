import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error boundary component that catches JavaScript errors anywhere in the child component tree
 * Provides a fallback UI and error logging for better user experience
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console in development
    console.error("Error caught by ErrorBoundary:", error, errorInfo);

    // In production, you might want to log this to an error reporting service
    // Example: errorReportingService.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          style={{
            padding: "2rem",
            textAlign: "center",
            border: "1px solid #dc3545",
            borderRadius: "4px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            margin: "1rem",
          }}
        >
          <h2>Something went wrong</h2>
          <p>
            We're sorry, but an unexpected error occurred. Please try refreshing
            the page.
          </p>
          <details style={{ marginTop: "1rem", textAlign: "left" }}>
            <summary>Error details (for developers)</summary>
            <pre style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
              {this.state.error?.message}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
