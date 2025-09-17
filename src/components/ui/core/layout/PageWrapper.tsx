import { forwardRef } from "react";
import { cn } from "@/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "7xl" | "full";
}

const PageWrapper = forwardRef<HTMLDivElement, PageWrapperProps>(
  ({ children, className = "", maxWidth = "4xl" }, ref) => {
    const maxWidthClasses = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      "4xl": "max-w-4xl",
      "6xl": "max-w-6xl",
      "7xl": "max-w-7xl",
      full: "max-w-full",
    };

    const containerClasses = cn(
      maxWidthClasses[maxWidth],
      "mx-auto",
      className
    );

    return (
      <div ref={ref} className={containerClasses}>
        {children}
      </div>
    );
  }
);

PageWrapper.displayName = "PageWrapper";

export default PageWrapper;
