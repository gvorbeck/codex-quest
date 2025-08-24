import { useState, useRef, useEffect, forwardRef } from "react";
import { NumberInput } from "@/components/ui/inputs";
import { EditIcon } from "@/components/ui/display";

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
  ({
    value,
    onChange,
    minValue = 3,
    maxValue = 25,
    editable = false,
    displayValue,
    displayClassName = "",
    inputClassName = "",
    size = "md",
    ariaLabel,
    showEditIcon = true,
    displayProps = {},
  }, ref) => {
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
      if (editable && (e.key === 'Enter' || e.key === ' ')) {
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

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" || event.key === "Escape") {
        setIsEditing(false);
      }
    };

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
          className={`text-center bg-zinc-700 border-amber-400 text-zinc-100 ${inputClassName}`}
          {...(ariaLabel && { "aria-label": ariaLabel })}
        />
      );
    }

    return (
      <div
        ref={ref}
        className={`
          relative transition-colors duration-200
          ${editable ? "cursor-pointer" : ""}
          ${displayClassName}
        `}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role={editable ? "button" : undefined}
        tabIndex={editable ? 0 : undefined}
        aria-label={editable ? `${ariaLabel} (click to edit)` : ariaLabel}
        {...displayProps}
      >
        {displayValue ?? value}
        {editable && showEditIcon && (
          <EditIcon
            className="
              w-3 h-3 text-zinc-400 
              opacity-0 group-hover:opacity-100 
              transition-opacity duration-200
              absolute -top-1 right-2
            "
          />
        )}
      </div>
    );
  }
);

EditableValue.displayName = "EditableValue";

export default EditableValue;