import React, { forwardRef, useState, useId, useEffect } from "react";

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
  showClearButton?: boolean;
  "aria-label"?: string;
  "aria-describedby"?: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
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
      showClearButton = true,
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
    const [isFocused, setIsFocused] = useState(false);

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
      setIsFocused(true);
      onFocus?.(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(event);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow Escape key to clear the input if clear button is enabled
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

    return (
      <div>
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
            maxLength !== undefined && inputValue.length > maxLength
          }
          {...props}
        />

        {showClear && (
          <button
            type="button"
            id={clearButtonId}
            onClick={handleClear}
            aria-label="Clear input"
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.backgroundColor = "#f0f0f0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = isFocused ? "1" : "0.7";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            ✕
          </button>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;
