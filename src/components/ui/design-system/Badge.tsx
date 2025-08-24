import { forwardRef } from "react";
import type { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/constants/styles";

type BadgeVariant = "status" | "supplemental" | "combination" | "primary" | "secondary" | "success" | "warning" | "danger";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      variant = "status",
      size = "sm",
      className,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = "inline-flex items-center justify-center font-medium rounded";

    // Variant styles
    const variantStyles = {
      status: "bg-lime-600 text-zinc-900",
      supplemental: "bg-lime-600 text-zinc-900", 
      combination: "bg-lime-600 text-zinc-900",
      primary: "bg-amber-400 text-zinc-900",
      secondary: "bg-zinc-600 text-zinc-100",
      success: "bg-emerald-600 text-white",
      warning: "bg-amber-500 text-zinc-900",
      danger: "bg-red-600 text-white",
    };

    // Size styles
    const sizeStyles = {
      sm: "text-xs px-2 py-1",
      md: "text-sm px-3 py-1.5", 
      lg: "text-base px-4 py-2",
    };

    const badgeClasses = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    return (
      <span ref={ref} className={badgeClasses} {...props}>
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;