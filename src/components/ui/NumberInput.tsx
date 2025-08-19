import React, { forwardRef, useState, useId, useEffect } from "react";

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
  "aria-label"?: string;
  "aria-describedby"?: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
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
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
      onBlur,
      onFocus,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const [inputValue, setInputValue] = useState(
      value !== undefined ? value.toString() : ""
    );

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputVal = event.target.value;
      setInputValue(inputVal);

      if (inputVal === "") {
        onChange?.(undefined);
        return;
      }

      const numericValue = parseFloat(inputVal);

      if (!isNaN(numericValue)) {
        // Validate against min/max constraints
        let validatedValue = numericValue;

        if (minValue !== undefined && numericValue < minValue) {
          validatedValue = minValue;
        }

        if (maxValue !== undefined && numericValue > maxValue) {
          validatedValue = maxValue;
        }

        onChange?.(validatedValue);
      }
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      // Update display value to match the actual value on blur
      if (value !== undefined) {
        setInputValue(value.toString());
      }
      onBlur?.(event);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow: backspace, delete, tab, escape, enter
      if (
        [8, 9, 27, 13, 46].indexOf(event.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (event.keyCode === 65 && event.ctrlKey === true) ||
        (event.keyCode === 67 && event.ctrlKey === true) ||
        (event.keyCode === 86 && event.ctrlKey === true) ||
        (event.keyCode === 88 && event.ctrlKey === true) ||
        // Allow: home, end, left, right
        (event.keyCode >= 35 && event.keyCode <= 39)
      ) {
        return;
      }

      // Ensure that it is a number and stop the keypress if not
      if (
        (event.shiftKey || event.keyCode < 48 || event.keyCode > 57) &&
        (event.keyCode < 96 || event.keyCode > 105) &&
        // Allow decimal point and minus sign
        event.keyCode !== 190 &&
        event.keyCode !== 189 &&
        event.keyCode !== 109
      ) {
        event.preventDefault();
      }
    };

    // Update local state when value prop changes
    useEffect(() => {
      if (value !== undefined) {
        setInputValue(value.toString());
      } else {
        setInputValue("");
      }
    }, [value]);

    return (
      <input
        ref={ref}
        type="number"
        id={inputId}
        name={name}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={onFocus}
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
          value !== undefined &&
          ((minValue !== undefined && value < minValue) ||
            (maxValue !== undefined && value > maxValue))
        }
        {...props}
      />
    );
  }
);

NumberInput.displayName = "NumberInput";

export default NumberInput;
