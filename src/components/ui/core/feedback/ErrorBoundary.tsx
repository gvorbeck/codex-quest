import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui";
import { Typography } from "@/components/ui/core/display";
import { logger } from "@/utils";

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

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console in development
    logger.error("Error caught by ErrorBoundary:", error, errorInfo);

    // In production, you might want to log this to an error reporting service
    // Example: errorReportingService.captureException(error, { extra: errorInfo });
  }

  override render() {
    if (this.state.hasError) {
      // Render fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div role="alert">
          <Typography variant="h2" as="h2">
            Something went wrong
          </Typography>
          <Typography variant="body">
            We're sorry, but an unexpected error occurred. Please try refreshing
            the page.
          </Typography>
          <details>
            <summary>Error details (for developers)</summary>
            <pre>{this.state.error?.message}</pre>
          </details>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </div>
      );
    }

    return this.props.children;
  }
}
