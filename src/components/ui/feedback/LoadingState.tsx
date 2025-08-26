import { memo } from "react";

interface LoadingStateProps {
  message?: string;
  isUpdating?: boolean;
  variant?: "page" | "inline" | "overlay";
  className?: string;
}

export const LoadingState = memo(({ 
  message = "Loading...", 
  variant = "page",
  className = ""
}: LoadingStateProps) => {
  const getContainerClasses = () => {
    const baseClasses = "flex items-center gap-3";
    
    switch (variant) {
      case "overlay":
        return `${baseClasses} fixed top-4 right-4 z-50 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 shadow-lg`;
      case "inline":
        return `${baseClasses} ${className}`;
      case "page":
      default:
        return `${baseClasses} justify-center py-16 ${className}`;
    }
  };

  const getWrapperClasses = () => {
    switch (variant) {
      case "overlay":
        return "";
      case "inline":
        return "";
      case "page":
      default:
        return "text-center";
    }
  };

  const getMessageClasses = () => {
    switch (variant) {
      case "overlay":
        return "text-sm text-zinc-300";
      case "inline":
        return "text-zinc-400";
      case "page":
      default:
        return "text-zinc-400";
    }
  };

  return (
    <div 
      className={getWrapperClasses()} 
      role="status" 
      aria-live="polite"
    >
      <div className={getContainerClasses()}>
        <div 
          className="animate-spin inline-block w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full"
          aria-hidden="true"
        />
        <p className={getMessageClasses()}>
          {message}
        </p>
      </div>
    </div>
  );
});

LoadingState.displayName = "LoadingState";