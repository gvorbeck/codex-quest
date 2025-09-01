import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui";
import { TextHeader } from "@/components/ui/display";
import { Typography } from "@/components/ui/design-system";
import { logger } from "@/utils/logger";

interface Props {
  children: ReactNode;
  contextName: string;
  entityType?: string;
  entityContext?: string;
  fallbackMessage?: string;
  showHomeLink?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Shared error boundary component to reduce duplication
 * Can be customized for different contexts while maintaining consistency
 */
export class SharedErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error(`Error in ${this.props.contextName}:`, error, errorInfo);
  }

  private getErrorMessage(): { title: string; message: string } {
    const { contextName, entityType, entityContext, fallbackMessage } =
      this.props;

    if (entityType && entityContext) {
      return {
        title: `${entityType} Error`,
        message: `There was a problem displaying this ${entityContext} sheet. The ${entityContext} data may be corrupted or there's an issue loading the ${entityContext} information.`,
      };
    }

    if (fallbackMessage) {
      return {
        title: `${contextName} Error`,
        message: fallbackMessage,
      };
    }

    // Default contextual messages
    const contextMessages: Record<string, { title: string; message: string }> =
      {
        "character creation": {
          title: "Character Creation Unavailable",
          message:
            "We're experiencing technical difficulties with the character creation system. Please try refreshing the page or start over.",
        },
        "game creation": {
          title: "Game Creation Unavailable",
          message:
            "We're experiencing technical difficulties with the game creation system. Please try refreshing the page or start over.",
        },
        "home page": {
          title: "Page Loading Error",
          message:
            "We're experiencing technical difficulties loading the homepage. Please try refreshing the page.",
        },
      };

    return (
      contextMessages[contextName.toLowerCase()] || {
        title: "Something went wrong",
        message:
          "We're sorry, but an unexpected error occurred. Please try refreshing the page.",
      }
    );
  }

  override render() {
    if (this.state.hasError) {
      const { title, message } = this.getErrorMessage();
      const { showHomeLink = true } = this.props;

      return (
        <section className="text-center py-16" role="alert">
          <TextHeader variant="h2" size="lg">
            {title}
          </TextHeader>
          <Typography variant="body" color="secondary" className="mb-6">
            {message}
          </Typography>
          <div className="space-x-4">
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
            {showHomeLink && (
              <Link
                href="/"
                className="text-highlight hover:text-highlight-hover transition-colors"
              >
                Return to Homepage
              </Link>
            )}
          </div>
          <details className="mt-6 text-left max-w-md mx-auto">
            <summary className="text-sm text-primary-300 cursor-pointer">
              Error details (for developers)
            </summary>
            <pre className="mt-2 text-xs text-primary-400 bg-primary-800 p-3 rounded overflow-auto">
              {this.state.error?.message}
            </pre>
          </details>
        </section>
      );
    }

    return this.props.children;
  }
}
