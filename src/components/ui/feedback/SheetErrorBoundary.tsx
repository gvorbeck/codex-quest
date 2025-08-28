import type { ReactNode } from "react";
import { SharedErrorBoundary } from "./SharedErrorBoundary";

interface Props {
  children: ReactNode;
  entityType: string; // "Game Sheet" | "Character Sheet"
  entityContext: string; // "game" | "character"
}

export function SheetErrorBoundary({ children, entityType, entityContext }: Props) {
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
