import { forwardRef } from "react";
import type { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/constants/styles";

type CardVariant = "info" | "success" | "standard" | "nested" | "gradient" | "hero";
type CardSize = "compact" | "default";
type CardShadow = "soft" | "standard" | "elevated";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  shadow?: CardShadow;
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = "standard",
      size = "default",
      shadow = "standard",
      hover = false,
      className,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = "rounded-lg border-2";

    // Variant styles
    const variantStyles = {
      info: "bg-amber-950/20 border-amber-600",
      success: "bg-lime-950/20 border-lime-600", 
      standard: "bg-zinc-800 border-zinc-600",
      nested: "bg-zinc-800/50 border-amber-700/30",
      gradient: "bg-gradient-to-br from-zinc-800/50 to-zinc-900/80 border-zinc-700/50 transition-all duration-300 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1",
      hero: "bg-gradient-to-br from-background-secondary to-background-tertiary border-border/50 relative",
    };

    // Size styles
    const sizeStyles = {
      compact: "p-4",
      default: "p-6",
    };

    // Shadow styles
    const shadowStyles = {
      soft: variant === "info" ? "shadow-[0_2px_0_0_#d97706]" : "shadow-[0_2px_0_0_#52525b]",
      standard: variant === "info" 
        ? "shadow-[0_3px_0_0_#b45309]" 
        : variant === "success"
        ? "shadow-[0_3px_0_0_#65a30d]"
        : "shadow-[0_3px_0_0_#3f3f46]",
      elevated: variant === "info" 
        ? "shadow-[0_4px_0_0_#92400e]" 
        : variant === "success"
        ? "shadow-[0_4px_0_0_#4d7c0f]"
        : "shadow-[0_4px_0_0_#27272a]",
    };

    // Hover styles
    const hoverStyles = hover 
      ? "transition-all duration-150 hover:shadow-[0_4px_0_0_#3f3f46] hover:-translate-y-0.5" 
      : "";

    const cardClasses = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      shadowStyles[shadow],
      hoverStyles,
      className
    );

    return (
      <div ref={ref} className={cardClasses} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;