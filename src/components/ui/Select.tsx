import { forwardRef, useId } from "react";
import type { SelectHTMLAttributes } from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  helperText?: string;
  onValueChange?: (value: string) => void;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      placeholder,
      error,
      helperText,
      onValueChange,
      onChange,
      disabled,
      required,
      id: providedId,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = providedId || generatedId;
    const errorId = error ? `${selectId}-error` : undefined;
    const helperTextId = helperText ? `${selectId}-helper` : undefined;

    // Combine all describedby IDs
    const describedByIds =
      [ariaDescribedBy, errorId, helperTextId].filter(Boolean).join(" ") ||
      undefined;

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = event.target.value;

      // Call the custom handler if provided
      if (onValueChange) {
        onValueChange(newValue);
      }

      // Call the native onChange handler if provided
      if (onChange) {
        onChange(event);
      }
    };

    return (
      <div>
        <label htmlFor={selectId}>
          {label}
          {required && <span aria-label="required">*</span>}
        </label>

        <select
          ref={ref}
          id={selectId}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          aria-describedby={describedByIds}
          aria-invalid={error ? true : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {helperText && (
          <div id={helperTextId} role="note">
            {helperText}
          </div>
        )}

        {error && (
          <div id={errorId} role="alert" aria-live="assertive">
            {error}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
