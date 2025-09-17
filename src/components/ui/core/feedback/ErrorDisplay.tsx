import type { ReactNode } from "react";

interface ErrorDisplayProps {
  error?: string | ReactNode;
  className?: string;
}

export default function ErrorDisplay({ error, className = "" }: ErrorDisplayProps) {
  if (!error) return null;

  return (
    <div
      role="alert"
      className={`text-red-400 text-sm bg-red-950/20 border border-red-600/30 rounded-lg p-3 ${className}`}
    >
      {error}
    </div>
  );
}