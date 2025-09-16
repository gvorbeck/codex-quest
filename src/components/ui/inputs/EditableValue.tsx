import { useState, useRef, useEffect, forwardRef } from "react";
import { NumberInput } from "@/components/ui/inputs";
import { Icon } from "@/components/ui/display";
import { DESIGN_TOKENS } from "@/constants";
import { cn } from "@/utils";

interface EditableValueProps {
  /** Current value */
  value: number;
  /** Called when value changes */
  onChange?: (value: number) => void;
  /** Minimum allowed value */
  minValue?: number;
  /** Maximum allowed value */
  maxValue?: number;
  /** Whether editing is enabled */
  editable?: boolean;
  /** Display format when not editing */
  displayValue?: string | number;
  /** CSS classes for the display container */
  displayClassName?: string;
  /** CSS classes for the edit input */
  inputClassName?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Accessibility label */
  ariaLabel?: string;
  /** Show edit icon on hover */
  showEditIcon?: boolean;
  /** Additional props for the display element */
  displayProps?: React.HTMLAttributes<HTMLDivElement>;
}

const EditableValue = forwardRef<HTMLDivElement, EditableValueProps>(
  (
    {
      value,
      onChange,
      minValue = DESIGN_TOKENS.inputs.editableValue.minValue,
      maxValue = DESIGN_TOKENS.inputs.editableValue.maxValue,
      editable = false,
      displayValue,
      displayClassName = "",
      inputClassName = "",
      size = "md",
      ariaLabel,
      showEditIcon = true,
      displayProps = {},
    },
    ref
  ) => {
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus and select when entering edit mode
    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, [isEditing]);

    const handleClick = () => {
      if (editable) {
        setIsEditing(true);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (editable && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        setIsEditing(true);
      }
    };

    const handleValueChange = (newValue: number | undefined) => {
      if (newValue !== undefined && onChange) {
        onChange(newValue);
      }
    };

    const handleBlur = () => {
      setIsEditing(false);
    };

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === "Enter" || event.key === "Escape") {
        setIsEditing(false);
      }
    };

    // Compute class names outside of JSX
    const inputClasses = cn(
      "text-center",
      DESIGN_TOKENS.colors.bg.input,
      DESIGN_TOKENS.colors.border.input,
      DESIGN_TOKENS.colors.text.primary,
      inputClassName
    );

    const displayClasses = cn(
      "relative",
      DESIGN_TOKENS.effects.transition,
      editable && "cursor-pointer",
      displayClassName
    );

    const iconClasses = cn(
      DESIGN_TOKENS.colors.text.secondary,
      "opacity-0 group-hover:opacity-100",
      "transition-opacity duration-200",
      "absolute -top-1 right-2"
    );

    if (isEditing && editable) {
      return (
        <NumberInput
          ref={inputRef}
          value={value}
          onChange={handleValueChange}
          onBlur={handleBlur}
          onKeyDown={handleInputKeyDown}
          minValue={minValue}
          maxValue={maxValue}
          size={size}
          className={inputClasses}
          {...(ariaLabel && { "aria-label": ariaLabel })}
        />
      );
    }

    return (
      <div
        ref={ref}
        className={displayClasses}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role={editable ? "button" : undefined}
        tabIndex={editable ? 0 : undefined}
        aria-label={editable ? `${ariaLabel} (click to edit)` : ariaLabel}
        {...displayProps}
      >
        {displayValue ?? value}
        {editable && showEditIcon && (
          <Icon
            name="edit"
            size="xs"
            className={iconClasses}
            aria-hidden={true}
          />
        )}
      </div>
    );
  }
);

EditableValue.displayName = "EditableValue";

export default EditableValue;
