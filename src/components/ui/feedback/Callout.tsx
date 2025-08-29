import { forwardRef } from "react";
import type { ReactNode, HTMLAttributes } from "react";
import { Icon } from "@/components/ui/display/Icon";
import { Typography } from "@/components/ui/design-system";
import { cn } from "@/constants/styles";

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
        "bg-lime-950/20 border-lime-600 text-lime-100",
        "shadow-[0_3px_0_0_#65a30d]", // lime-700 shadow
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
        <Icon
          name="info"
          size="md"
          className="flex-shrink-0"
          aria-hidden={true}
        />
      ),
      success: (
        <Icon
          name="check-circle"
          size="md"
          className="flex-shrink-0"
          aria-hidden={true}
        />
      ),
      warning: (
        <Icon
          name="exclamation-triangle"
          size="md"
          className="flex-shrink-0"
          aria-hidden={true}
        />
      ),
      error: (
        <Icon
          name="x-circle"
          size="md"
          className="flex-shrink-0"
          aria-hidden={true}
        />
      ),
      neutral: (
        <Icon
          name="info"
          size="md"
          className="flex-shrink-0"
          aria-hidden={true}
        />
      ),
    };

    // Combine all styles
    const calloutClasses = cn(
      ...baseStyles,
      ...variantStyles[variant],
      sizeStyles[size],
      className,
    );

    const displayIcon = icon || defaultIcons[variant];

    return (
      <div ref={ref} className={calloutClasses} role="note" {...props}>
        {(title || displayIcon) && (
          <div className="flex items-start gap-3 mb-3">
            {displayIcon && <div className="mt-0.5">{displayIcon}</div>}
            {title && (
              <Typography variant="h6" weight="semibold" className="m-0 flex-1">
                {title}
              </Typography>
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
