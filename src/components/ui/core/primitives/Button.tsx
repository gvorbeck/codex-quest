import { combineButtonStyles, createButtonStyles } from "@/utils";
import type { BaseButtonProps } from "@/types";
import { forwardRef } from "react";
import type { ReactNode } from "react";
import Icon, { type IconName } from "@/components/ui/core/display/Icon";

interface ButtonProps extends BaseButtonProps {
  children?: ReactNode;
  icon?: IconName;
  iconClasses?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      icon,
      iconClasses,
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

    // Get button styles using shared utility
    const buttonStyles = createButtonStyles(false); // false = not circular

    // Combine all styles
    const buttonClasses = combineButtonStyles(
      buttonStyles.base,
      buttonStyles.variants[variant],
      buttonStyles.sizes[size],
      className
    );

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
            className="animate-spin inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full flex-shrink-0"
          />
        )}
        <span
          className={`flex items-center gap-2 ${loading ? "opacity-0" : ""}`}
        >
          {icon && <Icon name={icon} className={iconClasses || ""} />}
          {children}
        </span>
        {loading && <span className="sr-only">{loadingText}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
