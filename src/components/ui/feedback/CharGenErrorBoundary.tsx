import type { ReactNode } from "react";
import { SharedErrorBoundary } from "./SharedErrorBoundary";

interface Props {
  children: ReactNode;
}

export function CharGenErrorBoundary({ children }: Props) {
  return (
    <SharedErrorBoundary contextName="character creation">
      {children}
    </SharedErrorBoundary>
  );
}
