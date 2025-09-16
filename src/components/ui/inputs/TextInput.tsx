import React, { forwardRef, useState, useId, useEffect } from "react";
import { Icon } from "@/components/ui";
import { cn } from "@/constants";

type TextInputSize = "sm" | "md" | "lg";

interface TextInputProps {
  value?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  type?: "text" | "email" | "password" | "url" | "tel";
  size?: TextInputSize;
  error?: boolean;
  showClearButton?: boolean;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onClear?: () => void;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      value = "",
      onChange,
      maxLength,
      placeholder,
      disabled = false,
      required = false,
      id,
      name,
      type = "text",
      size = "md",
      error = false,
      showClearButton = true,
      className = "",
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
      onBlur,
      onFocus,
      onKeyDown,
      onClear,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const clearButtonId = `${inputId}-clear`;
    const [inputValue, setInputValue] = useState(value);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;

      // Respect maxLength constraint
      if (maxLength && newValue.length > maxLength) {
        return;
      }

      setInputValue(newValue);
      onChange?.(newValue);
    };

    const handleClear = () => {
      setInputValue("");
      onChange?.("");
      onClear?.();

      // Return focus to the input after clearing
      if (ref && typeof ref === "object" && ref.current) {
        ref.current.focus();
      }
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      onFocus?.(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(event);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      // Call external onKeyDown handler first
      onKeyDown?.(event);

      // Allow Escape key to clear the input if clear button is enabled
      if (
        event.key === "Escape" &&
        showClearButton &&
        inputValue &&
        !event.defaultPrevented
      ) {
        event.preventDefault();
        handleClear();
      }
    };

    // Update local state when value prop changes
    useEffect(() => {
      setInputValue(value);
    }, [value]);

    const showClear =
      showClearButton && inputValue && inputValue.length > 0 && !disabled;

    // Base styles consistent with Button and NumberInput components
    const baseStyles = [
      "w-full transition-all duration-150",
      "border-2 rounded-lg",
      "bg-zinc-800 text-zinc-100 border-zinc-600",
      "placeholder:text-zinc-400",
      "focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-900",
      "focus:border-amber-400 focus:bg-zinc-700",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-zinc-900",
    ];

    // Error state styles
    const errorStyles = error
      ? [
          "border-red-500 focus:border-red-400 focus:ring-red-400",
          "bg-red-950/20 focus:bg-red-950/30",
        ]
      : [];

    // Shadow styles - 3D effect like Button
    const shadowStyles = [
      "shadow-[0_3px_0_0_#3f3f46]", // zinc-700 shadow
      "focus:shadow-[0_4px_0_0_#b45309]", // amber-700 shadow when focused
      error ? "shadow-[0_3px_0_0_#b91c1c]" : "", // red-700 shadow for errors
    ];

    // Size styles
    const sizeStyles = {
      sm: "px-3 py-2 text-sm min-h-[36px]",
      md: "px-4 py-3 text-base min-h-[44px]",
      lg: "px-5 py-4 text-lg min-h-[52px]",
    };

    // Clear button styles
    const clearButtonStyles = [
      "absolute right-2 top-1/2 -translate-y-1/2",
      "w-6 h-6 rounded-full",
      "flex items-center justify-center",
      "text-zinc-400 hover:text-zinc-200",
      "hover:bg-zinc-700 transition-colors duration-150",
      "focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-800",
    ];

    // Adjust input padding when clear button is shown
    const inputPaddingClass = showClear ? "pr-10" : "";

    // Combine all styles
    const inputClasses = cn(
      ...baseStyles,
      ...errorStyles,
      ...shadowStyles,
      sizeStyles[size],
      inputPaddingClass,
      className,
    );

    return (
      <div className="relative">
        <input
          ref={ref}
          type={type}
          id={inputId}
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          maxLength={maxLength}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          aria-invalid={
            error || (maxLength !== undefined && inputValue.length > maxLength)
          }
          className={inputClasses}
          {...props}
        />

        {showClear && (
          <button
            type="button"
            id={clearButtonId}
            onClick={handleClear}
            aria-label="Clear input"
            className={cn(...clearButtonStyles)}
          >
            <Icon name="close" size="sm" aria-hidden={true} />
          </button>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;
