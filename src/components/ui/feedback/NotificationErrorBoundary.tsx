import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Typography } from "@/components/ui/design-system";
import { logger } from "@/utils/logger";

interface Props {
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Specialized error boundary for the notification system
 * Provides graceful degradation when notifications fail
 */
export class NotificationErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console
    logger.error("Notification system error:", error, errorInfo);

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Auto-recover after a delay to prevent permanent notification system failure
    setTimeout(() => {
      this.setState({ hasError: false });
    }, 5000);
  }

  override render() {
    if (this.state.hasError) {
      // Provide minimal fallback UI with accessibility support
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="fixed top-4 right-4 z-50 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl p-4 max-w-sm"
        >
          <Typography variant="helper" color="secondary">
            Notification system temporarily unavailable
          </Typography>
        </div>
      );
    }

    return this.props.children;
  }
}
