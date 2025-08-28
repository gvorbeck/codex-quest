import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui";
import { Typography } from "@/components/ui/design-system";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class HomeErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error on home page:", error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <section className="text-center py-16" role="alert">
          <Typography variant="h2" color="primary" className="mb-4">
            Page Loading Error
          </Typography>
          <p className="text-primary-400 mb-6">
            We're experiencing technical difficulties loading the homepage.
            Please try refreshing the page.
          </p>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
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
