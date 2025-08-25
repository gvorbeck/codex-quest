import { forwardRef, useId } from "react";
import type { SelectHTMLAttributes } from "react";
import { Icon } from "@/components/ui/display/Icon";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children" | "size"> {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  helperText?: string;
  size?: "sm" | "md" | "lg";
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
      size = "md",
      onValueChange,
      onChange,
      disabled,
      required,
      id: providedId,
      className = "",
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

    // Base styles consistent with Button component
    const baseStyles = [
      "w-full transition-all duration-150",
      "border-2 rounded-lg",
      "bg-zinc-800 text-zinc-100 border-zinc-600",
      "focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-900",
      "focus:border-amber-400 focus:bg-zinc-700",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-zinc-900",
      "appearance-none", // Remove default select arrow
      "cursor-pointer",
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

    // Label styles
    const labelStyles = [
      "block font-medium text-zinc-100 mb-2",
      size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base",
    ];

    // Combine all styles
    const selectClasses = [
      ...baseStyles,
      ...errorStyles,
      ...shadowStyles,
      sizeStyles[size],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const labelClasses = labelStyles.join(" ");

    return (
      <div className="relative">
        <label htmlFor={selectId} className={labelClasses}>
          {label}
          {required && (
            <span className="text-red-400 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            aria-describedby={describedByIds}
            aria-invalid={error ? true : undefined}
            className={selectClasses}
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

          {/* Custom dropdown arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Icon 
              name="chevron-down" 
              size="md" 
              className="text-zinc-400"
              aria-hidden={true}
            />
          </div>
        </div>

        {helperText && (
          <div
            id={helperTextId}
            className="text-sm text-zinc-400 mt-1"
            role="note"
          >
            {helperText}
          </div>
        )}

        {error && (
          <div
            id={errorId}
            className="text-sm text-red-400 mt-1"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
