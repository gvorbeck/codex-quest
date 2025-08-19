import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  loadingText?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      loading = false,
      loadingText = "Loading...",
      disabled,
      type = "button",
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-label={ariaLabel}
        aria-disabled={isDisabled}
        {...props}
      >
        {loading ? loadingText : children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
