import type { ReactNode } from "react";
import { SharedErrorBoundary } from "./SharedErrorBoundary";

interface ErrorBoundaryOptions {
  showHomeLink?: boolean;
  entityType?: string;
  entityContext?: string;
  fallbackMessage?: string;
}

/**
 * Factory function to create error boundary components
 * Eliminates the need for individual wrapper components
 */
export const createErrorBoundary = (
  contextName: string,
  options: Partial<ErrorBoundaryOptions> = {}
) => {
  return function GeneratedErrorBoundary({ children }: { children: ReactNode }) {
    return (
      <SharedErrorBoundary contextName={contextName} {...options}>
        {children}
      </SharedErrorBoundary>
    );
  };
};