import type { ReactNode } from "react";
import { SharedErrorBoundary } from "./SharedErrorBoundary";

interface Props {
  children: ReactNode;
}

export function HomeErrorBoundary({ children }: Props) {
  return (
    <SharedErrorBoundary contextName="home page" showHomeLink={false}>
      {children}
    </SharedErrorBoundary>
  );
}
