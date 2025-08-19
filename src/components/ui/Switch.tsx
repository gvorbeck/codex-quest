import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";

interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  defaultActive?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      label,
      defaultActive = false,
      checked,
      onCheckedChange,
      onChange,
      disabled,
      id: providedId,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const switchId = providedId || generatedId;

    const isControlled = checked !== undefined;
    const switchChecked = isControlled ? checked : defaultActive;

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

    return (
      <div>
        <label htmlFor={switchId}>
          <input
            ref={ref}
            id={switchId}
            type="checkbox"
            role="switch"
            checked={isControlled ? checked : undefined}
            defaultChecked={!isControlled ? defaultActive : undefined}
            onChange={handleChange}
            disabled={disabled}
            aria-checked={switchChecked}
            aria-describedby={ariaDescribedBy}
            {...props}
          />
          <span>{label}</span>
        </label>
      </div>
    );
  }
);

Switch.displayName = "Switch";

export default Switch;
