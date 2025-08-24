import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class CharacterSheetErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error in character sheet:", error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <section className="text-center py-16" role="alert">
          <h2 className="text-xl font-semibold text-primary-200 mb-4">
            Character Sheet Error
          </h2>
          <p className="text-primary-400 mb-6">
            There was a problem displaying this character sheet. The character 
            data may be corrupted or there's an issue loading the character information.
          </p>
          <div className="space-x-4">
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
            <Link
              href="/"
              className="text-highlight hover:text-highlight-hover transition-colors"
            >
              Return to Homepage
            </Link>
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