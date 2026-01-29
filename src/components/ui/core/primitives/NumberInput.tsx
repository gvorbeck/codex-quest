import React, { forwardRef, useState, useId } from "react";
import { cn } from "@/utils";
import { DESIGN_TOKENS } from "@/constants";

type NumberInputSize = "sm" | "md" | "lg";

interface NumberInputProps {
  value?: number;
  onChange?: (value: number | undefined) => void;
  minValue?: number;
  maxValue?: number;
  step?: number;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  size?: NumberInputSize;
  error?: boolean;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value,
      onChange,
      minValue,
      maxValue,
      step = 1,
      placeholder,
      disabled = false,
      required = false,
      id,
      name,
      size = "md",
      error = false,
      className = "",
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
      onBlur,
      onFocus,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const [inputValue, setInputValue] = useState(
      value !== undefined ? value.toString() : ""
    );
    const [prevValue, setPrevValue] = useState(value);

    // Sync inputValue with value prop during render
    if (value !== prevValue) {
      setPrevValue(value);
      if (value !== undefined) {
        setInputValue(value.toString());
      } else {
        setInputValue("");
      }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputVal = event.target.value;
      setInputValue(inputVal);

      if (inputVal === "") {
        onChange?.(undefined);
        return;
      }

      const numericValue = parseFloat(inputVal);

      if (!isNaN(numericValue)) {
        // Allow any numeric value during typing - validation happens on blur
        onChange?.(numericValue);
      }
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      // Validate and clamp value on blur
      if (value !== undefined) {
        let validatedValue = value;

        if (minValue !== undefined && value < minValue) {
          validatedValue = minValue;
          onChange?.(validatedValue);
        } else if (maxValue !== undefined && value > maxValue) {
          validatedValue = maxValue;
          onChange?.(validatedValue);
        }

        // Update display value to match the validated value
        setInputValue(validatedValue.toString());
      } else if (inputValue === "" && required) {
        // Handle required empty field - keep it empty but maintain state
        setInputValue("");
      }
      onBlur?.(event);
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      onFocus?.(event);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      // Call custom onKeyDown handler first if provided
      onKeyDown?.(event);

      // Allow: backspace, delete, tab, escape, enter
      if (
        [
          "Backspace",
          "Delete",
          "Tab",
          "Escape",
          "Enter",
          "Home",
          "End",
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
        ].includes(event.key)
      ) {
        return;
      }

      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X (or Cmd on Mac)
      if (
        (event.ctrlKey || event.metaKey) &&
        ["a", "c", "v", "x"].includes(event.key.toLowerCase())
      ) {
        return;
      }

      // Ensure that it is a number and stop the keypress if not
      // Allow: digits, decimal point, minus sign
      if (
        event.key.length === 1 &&
        !/^[0-9.-]$/.test(event.key) &&
        !event.ctrlKey &&
        !event.metaKey
      ) {
        event.preventDefault();
      }
    };


    // Base styles consistent with Button component
    const baseStyles = [
      "w-full",
      DESIGN_TOKENS.effects.transition,
      "border-2 rounded-lg",
      DESIGN_TOKENS.colors.bg.input,
      DESIGN_TOKENS.colors.text.primary,
      "placeholder:text-zinc-400",
      "focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-900",
      DESIGN_TOKENS.colors.border.inputFocus,
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

    // Combine all styles
    const inputClasses = cn(
      ...baseStyles,
      ...errorStyles,
      ...shadowStyles,
      sizeStyles[size],
      className
    );

    return (
      <input
        ref={ref}
        type="number"
        inputMode="numeric"
        id={inputId}
        name={name}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        min={minValue}
        max={maxValue}
        step={step}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-invalid={
          error ||
          (value !== undefined &&
            ((minValue !== undefined && value < minValue) ||
              (maxValue !== undefined && value > maxValue)))
        }
        className={inputClasses}
        {...props}
      />
    );
  }
);

NumberInput.displayName = "NumberInput";

export default NumberInput;
