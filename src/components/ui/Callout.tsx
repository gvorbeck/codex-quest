import { forwardRef } from "react";
import type { ReactNode, HTMLAttributes } from "react";

type CalloutVariant = "info" | "success" | "warning" | "error" | "neutral";

interface CalloutProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: CalloutVariant;
  title?: string;
  icon?: ReactNode;
  size?: "sm" | "md" | "lg";
}

const Callout = forwardRef<HTMLDivElement, CalloutProps>(
  (
    {
      children,
      variant = "info",
      title,
      icon,
      size = "md",
      className = "",
      ...props
    },
    ref
  ) => {
    // Base styles consistent with other UI components
    const baseStyles = [
      "rounded-lg border-2 transition-all duration-150",
      "shadow-[0_3px_0_0_#3f3f46]", // zinc-700 shadow for 3D effect
    ];

    // Variant styles
    const variantStyles = {
      info: [
        "bg-amber-950/20 border-amber-600 text-amber-100",
        "shadow-[0_3px_0_0_#b45309]", // amber-700 shadow
      ],
      success: [
        "bg-emerald-950/20 border-emerald-600 text-emerald-100",
        "shadow-[0_3px_0_0_#047857]", // emerald-700 shadow
      ],
      warning: [
        "bg-orange-950/20 border-orange-600 text-orange-100",
        "shadow-[0_3px_0_0_#c2410c]", // orange-700 shadow
      ],
      error: [
        "bg-red-950/20 border-red-600 text-red-100",
        "shadow-[0_3px_0_0_#b91c1c]", // red-700 shadow
      ],
      neutral: [
        "bg-zinc-800 border-zinc-600 text-zinc-100",
        "shadow-[0_3px_0_0_#3f3f46]", // zinc-700 shadow
      ],
    };

    // Size styles
    const sizeStyles = {
      sm: "p-3 text-sm",
      md: "p-4 text-base",
      lg: "p-6 text-lg",
    };

    // Default icons for each variant
    const defaultIcons = {
      info: (
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      ),
      success: (
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
      warning: (
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
      error: (
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      ),
      neutral: (
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      ),
    };

    // Combine all styles
    const calloutClasses = [
      ...baseStyles,
      ...variantStyles[variant],
      sizeStyles[size],
      className,
    ].join(" ");

    const displayIcon = icon || defaultIcons[variant];

    return (
      <div ref={ref} className={calloutClasses} role="note" {...props}>
        {(title || displayIcon) && (
          <div className="flex items-start gap-3 mb-3">
            {displayIcon && <div className="mt-0.5">{displayIcon}</div>}
            {title && (
              <h6 className="font-semibold text-current m-0 flex-1">{title}</h6>
            )}
          </div>
        )}
        <div className={title || displayIcon ? "ml-8" : ""}>{children}</div>
      </div>
    );
  }
);

Callout.displayName = "Callout";

export default Callout;
