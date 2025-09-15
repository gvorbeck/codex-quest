import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/constants/styles";
import { DESIGN_TOKENS } from "@/constants/designTokens";
import { Icon } from "@/components/ui/display";

/**
 * A customizable checkbox component with accessibility features and consistent styling.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Checkbox label="Accept terms and conditions" />
 *
 * // Controlled with state
 * const [isChecked, setIsChecked] = useState(false);
 * <Checkbox
 *   label="Enable notifications"
 *   checked={isChecked}
 *   onCheckedChange={setIsChecked}
 *   helperText="You can change this later in settings"
 * />
 *
 * // With indeterminate state (useful for "select all" scenarios)
 * <Checkbox
 *   label="Select all items"
 *   indeterminate={someSelected && !allSelected}
 *   checked={allSelected}
 *   onCheckedChange={handleSelectAll}
 * />
 * ```
 */
interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** The label text displayed next to the checkbox */
  label: string;
  /** Default checked state for uncontrolled usage */
  defaultChecked?: boolean;
  /** Controlled checked state */
  checked?: boolean;
  /** Callback fired when the checked state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Visual size of the checkbox */
  size?: "sm" | "md" | "lg";
  /** Helper text displayed below the checkbox */
  helperText?: string;
  /** Whether the checkbox should display in an indeterminate state */
  indeterminate?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      defaultChecked = false,
      checked,
      onCheckedChange,
      onChange,
      disabled,
      size = "md",
      helperText,
      indeterminate = false,
      id: providedId,
      "aria-describedby": ariaDescribedBy,
      className = "",
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const checkboxId = providedId || generatedId;
    const helperTextId = helperText ? `${checkboxId}-helper` : undefined;

    const isControlled = checked !== undefined;
    const checkboxChecked = isControlled ? checked : defaultChecked;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = event.target.checked;

      // Call the custom handler if provided
      if (onCheckedChange) {
        onCheckedChange(newChecked);
      }

      // Call the native onChange handler if provided
      if (onChange) {
        onChange(event);
      }
    };

    // Size configurations for checkbox
    const sizeConfig = {
      sm: {
        checkbox: "w-4 h-4",
        text: "text-sm",
        gap: "gap-2",
        checkIcon: "w-3 h-3",
      },
      md: {
        checkbox: "w-5 h-5",
        text: "text-base",
        gap: "gap-3",
        checkIcon: "w-4 h-4",
      },
      lg: {
        checkbox: "w-6 h-6",
        text: "text-lg",
        gap: "gap-4",
        checkIcon: "w-5 h-5",
      },
    };

    const config = sizeConfig[size];

    // Base checkbox styles consistent with other components using design tokens
    const checkboxBaseStyles = [
      "relative flex items-center justify-center",
      "border-2 rounded",
      DESIGN_TOKENS.effects.transition,
      "focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-900",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      config.checkbox,
    ];

    // Checkbox variant styles (checked/unchecked/indeterminate states) using design tokens
    const getCheckboxVariantStyles = () => {
      if (indeterminate) {
        return [
          "bg-amber-400 border-amber-500",
          DESIGN_TOKENS.effects.shadowSm, // Using design token shadow
          "hover:bg-amber-300 hover:border-amber-400",
        ];
      }

      if (checkboxChecked) {
        return [
          "bg-amber-400 border-amber-500",
          DESIGN_TOKENS.effects.shadowSm, // Using design token shadow
          "hover:bg-amber-300 hover:border-amber-400",
        ];
      }

      return [
        "bg-zinc-700 border-zinc-600",
        DESIGN_TOKENS.effects.shadowSm, // Using design token shadow
        "hover:bg-zinc-600 hover:border-zinc-500",
      ];
    };

    // Combine checkbox styles
    const checkboxClasses = cn(
      ...checkboxBaseStyles,
      ...getCheckboxVariantStyles(),
      disabled ? "cursor-not-allowed" : "cursor-pointer"
    );

    // Label styles using design tokens
    const labelClasses = cn(
      "font-medium select-none",
      DESIGN_TOKENS.colors.text.primary, // Using design token for text color
      config.text,
      disabled ? "opacity-50" : ""
    );

    // Helper text styles using design tokens
    const helperTextClasses = cn(
      "text-sm mt-1",
      DESIGN_TOKENS.colors.text.secondary
    );

    // Container classes
    const containerClasses = cn("flex flex-col", className);
    const itemsContainerClasses = cn("flex items-center", config.gap);
    const checkIconClasses = cn(
      config.checkIcon,
      "text-zinc-900 pointer-events-none"
    );

    const combinedAriaDescribedBy = cn(ariaDescribedBy, helperTextId);

    return (
      <div className={containerClasses}>
        <div className={itemsContainerClasses}>
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            checked={isControlled ? checked : undefined}
            defaultChecked={!isControlled ? defaultChecked : undefined}
            onChange={handleChange}
            disabled={disabled}
            aria-checked={indeterminate ? "mixed" : checkboxChecked}
            aria-describedby={combinedAriaDescribedBy || undefined}
            className="sr-only"
            {...props}
          />
          <label
            htmlFor={checkboxId}
            className={cn("flex items-center cursor-pointer", config.gap)}
          >
            <div className={checkboxClasses}>
              {indeterminate ? (
                <Icon
                  name="minus"
                  className={checkIconClasses}
                  aria-hidden={true}
                />
              ) : (
                checkboxChecked && (
                  <Icon
                    name="check"
                    className={checkIconClasses}
                    aria-hidden={true}
                  />
                )
              )}
            </div>
            <span className={labelClasses}>{label}</span>
          </label>
        </div>

        {helperText && (
          <div id={helperTextId} className={helperTextClasses} role="note">
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
