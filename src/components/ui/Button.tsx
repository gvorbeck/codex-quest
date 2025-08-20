import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  loadingText?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      loading = false,
      loadingText = "Loading...",
      disabled,
      type = "button",
      variant = "primary",
      size = "md",
      className = "",
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    // Base styles
    const baseStyles = [
      "inline-flex items-center justify-center gap-2",
      "font-semibold transition-all duration-150",
      "border-2 rounded-lg",
      "transform active:translate-y-0.5 active:shadow-sm",
      "focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-900",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:transform-none disabled:shadow-none",
    ];

    // Variant styles with 3D shadow effect - using standard Tailwind colors
    const variantStyles = {
      primary: [
        "bg-amber-400 text-zinc-900 border-amber-500",
        "shadow-[0_4px_0_0_#d97706] hover:shadow-[0_6px_0_0_#d97706]", // amber-600 shadow
        "hover:bg-amber-300 hover:border-amber-400",
        "active:shadow-[0_2px_0_0_#d97706] active:bg-amber-500",
      ],
      secondary: [
        "bg-transparent text-amber-400 border-amber-400",
        "shadow-[0_4px_0_0_#d97706] hover:shadow-[0_6px_0_0_#d97706]",
        "hover:bg-amber-400 hover:text-zinc-900 hover:border-amber-500",
        "active:shadow-[0_2px_0_0_#d97706] active:bg-amber-500 active:text-zinc-900",
      ],
      ghost: [
        "bg-transparent text-zinc-300 border-zinc-600",
        "shadow-[0_4px_0_0_#52525b] hover:shadow-[0_6px_0_0_#52525b]", // zinc-600 shadow
        "hover:bg-zinc-700 hover:text-zinc-100 hover:border-zinc-500",
        "active:shadow-[0_2px_0_0_#52525b] active:bg-zinc-800",
      ],
      destructive: [
        "bg-red-500 text-white border-red-600",
        "shadow-[0_4px_0_0_#dc2626] hover:shadow-[0_6px_0_0_#dc2626]", // red-600 shadow
        "hover:bg-red-400 hover:border-red-500",
        "active:shadow-[0_2px_0_0_#dc2626] active:bg-red-600",
      ],
    };

    // Size styles - made chunkier
    const sizeStyles = {
      sm: "px-4 py-3 text-sm min-h-[40px]",
      md: "px-6 py-4 text-base min-h-[48px]",
      lg: "px-8 py-5 text-lg min-h-[56px]",
    };

    // Combine all styles
    const buttonClasses = [
      ...baseStyles,
      ...variantStyles[variant],
      sizeStyles[size],
      className,
    ].join(" ");

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-label={ariaLabel}
        aria-disabled={isDisabled}
        aria-busy={loading}
        className={buttonClasses}
        {...props}
      >
        {loading && (
          <span
            aria-hidden="true"
            className="animate-spin inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full"
          />
        )}
        <span className={loading ? "opacity-0" : ""}>{children}</span>
        {loading && <span className="sr-only">{loadingText}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
