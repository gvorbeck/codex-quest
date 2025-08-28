import type { ReactNode } from "react";
import { SharedErrorBoundary } from "./SharedErrorBoundary";

interface Props {
  children: ReactNode;
}

export function GameGenErrorBoundary({ children }: Props) {
  return (
    <SharedErrorBoundary contextName="game creation">
      {children}
    </SharedErrorBoundary>
  );
}
