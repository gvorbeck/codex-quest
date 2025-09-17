import React, { forwardRef, useState, useId, useEffect } from "react";
import { Icon } from "@/components";
import { cn } from "@/utils";

type TextAreaSize = "sm" | "md" | "lg";

interface TextAreaProps {
  value?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  size?: TextAreaSize;
  error?: boolean;
  showClearButton?: boolean;
  className?: string;
  label?: string;
  rows?: number;
  cols?: number;
  resize?: "none" | "both" | "horizontal" | "vertical";
  "aria-label"?: string;
  "aria-describedby"?: string;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onClear?: () => void;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
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
      size = "sm",
      error = false,
      showClearButton = false,
      className = "",
      label,
      rows = 2,
      cols,
      resize = "vertical",
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
      onBlur,
      onFocus,
      onClear,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const clearButtonId = `${inputId}-clear`;
    const [inputValue, setInputValue] = useState(value);

    const handleTextAreaChange = (
      event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
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

    const handleFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
      onFocus?.(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
      onBlur?.(event);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Allow Escape key to clear the textarea if clear button is enabled
      if (event.key === "Escape" && showClearButton && inputValue) {
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

    // Compact styling for smaller TextField
    const baseStyles = [
      "w-full transition-all duration-150",
      "border rounded",
      "bg-zinc-800/50 text-zinc-100 border-zinc-600/50",
      "placeholder:text-zinc-400/70",
      "focus:outline-none focus:ring-1 focus:ring-amber-400/50 focus:ring-offset-1 focus:ring-offset-zinc-900",
      "focus:border-amber-400/60 focus:bg-zinc-750",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-zinc-900/30",
    ];

    // Error state styles
    const errorStyles = error
      ? [
          "border-red-500/60 focus:border-red-400/60 focus:ring-red-400/50",
          "bg-red-950/10 focus:bg-red-950/20",
        ]
      : [];

    // Size styles for textarea - accounting for multiple lines
    const sizeStyles = {
      sm: "px-2 py-1.5 text-xs",
      md: "px-3 py-2 text-sm",
      lg: "px-4 py-2.5 text-base",
    };

    // Resize styles
    const resizeStyles = {
      none: "resize-none",
      both: "resize",
      horizontal: "resize-x",
      vertical: "resize-y",
    };

    // Clear button styles - positioned at top right for textarea
    const clearButtonStyles = [
      "absolute right-1.5 top-2",
      "w-4 h-4 rounded-full",
      "flex items-center justify-center",
      "text-zinc-500 hover:text-zinc-300",
      "hover:bg-zinc-600/50 transition-colors duration-150",
      "focus:outline-none focus:ring-1 focus:ring-amber-400/50",
      "z-10",
    ];

    // Adjust input padding when clear button is shown
    const inputPaddingClass = showClear ? "pr-6" : "";

    // Combine all styles for textarea
    const textAreaClasses = cn(
      ...baseStyles,
      ...errorStyles,
      sizeStyles[size],
      resizeStyles[resize],
      inputPaddingClass,
      className
    );

    const effectiveAriaLabel = ariaLabel || label;

    return (
      <div className="relative">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs text-zinc-300 mb-1 font-medium"
          >
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={ref}
            id={inputId}
            name={name}
            value={inputValue}
            onChange={handleTextAreaChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            maxLength={maxLength}
            rows={rows}
            cols={cols}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            aria-label={effectiveAriaLabel}
            aria-describedby={ariaDescribedBy}
            aria-invalid={
              error ||
              (maxLength !== undefined && inputValue.length > maxLength)
            }
            className={textAreaClasses}
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
              <Icon name="close" size="xs" aria-hidden={true} />
            </button>
          )}
        </div>
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
