import type { ReactNode } from "react";
import { createErrorBoundary } from "./errorBoundaryFactory";
import { SharedErrorBoundary } from "./SharedErrorBoundary";

/**
 * Pre-configured error boundary components
 */
export const CharGenErrorBoundary = createErrorBoundary("character creation");
export const HomeErrorBoundary = createErrorBoundary("home page", { showHomeLink: false });
export const GameGenErrorBoundary = createErrorBoundary("game creation");

/**
 * Sheet error boundary with dynamic props
 */
export function SheetErrorBoundary({
  children,
  entityType,
  entityContext,
}: {
  children: ReactNode;
  entityType: string;
  entityContext: string;
}) {
  return (
    <SharedErrorBoundary
      contextName={`${entityContext} sheet`}
      entityType={entityType}
      entityContext={entityContext}
    >
      {children}
    </SharedErrorBoundary>
  );
}