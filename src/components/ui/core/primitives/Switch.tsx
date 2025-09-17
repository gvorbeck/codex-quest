import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/utils";

interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label: string;
  defaultActive?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: "sm" | "md" | "lg";
  helperText?: string;
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
      size = "md",
      helperText,
      id: providedId,
      "aria-describedby": ariaDescribedBy,
      className = "",
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const switchId = providedId || generatedId;
    const helperTextId = helperText ? `${switchId}-helper` : undefined;

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

    // Size configurations for track and thumb - FIXED WIDTH
    const sizeConfig = {
      sm: {
        track: "w-10 h-5", // Fixed 40px width
        thumb: "w-4 h-4", // Fixed 16px width
        translate: "translate-x-5", // 40px - 16px - 4px = 20px
        text: "text-sm",
        gap: "gap-2",
      },
      md: {
        track: "w-12 h-6", // Fixed 48px width
        thumb: "w-5 h-5", // Fixed 20px width
        translate: "translate-x-6", // 48px - 20px - 4px = 24px
        text: "text-base",
        gap: "gap-3",
      },
      lg: {
        track: "w-14 h-7", // Fixed 56px width
        thumb: "w-6 h-6", // Fixed 24px width
        translate: "translate-x-7", // 56px - 24px - 4px = 28px
        text: "text-lg",
        gap: "gap-4",
      },
    };

    const config = sizeConfig[size];

    // Base track styles consistent with Button component
    const trackBaseStyles = [
      "relative inline-flex items-center flex-shrink-0",
      "border-2 rounded-full transition-all duration-150",
      "cursor-pointer",
      "focus-within:outline-none focus-within:ring-2 focus-within:ring-amber-400 focus-within:ring-offset-2 focus-within:ring-offset-zinc-900",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      config.track,
    ];

    // Track variant styles (checked/unchecked states)
    const trackVariantStyles = switchChecked
      ? [
          "bg-amber-400 border-amber-500",
          "shadow-[0_3px_0_0_#b45309]", // amber-700 shadow
          "hover:bg-amber-300 hover:border-amber-400",
        ]
      : [
          "bg-zinc-700 border-zinc-600",
          "shadow-[0_3px_0_0_#3f3f46]", // zinc-700 shadow
          "hover:bg-zinc-600 hover:border-zinc-500",
        ];

    // Thumb styles - fixed positioning with animation
    const thumbBaseStyles = [
      "absolute top-0 left-0",
      "bg-white border border-zinc-300",
      "rounded-full transition-transform duration-150",
      "shadow-sm pointer-events-none",
      config.thumb,
    ];

    const thumbVariantStyles = switchChecked
      ? [config.translate]
      : ["translate-x-0"];

    // Handle track click to toggle switch
    const handleTrackClick = () => {
      if (!disabled) {
        const newChecked = !switchChecked;
        if (onCheckedChange) {
          onCheckedChange(newChecked);
        }
      }
    };

    // Combine track styles
    const trackClasses = cn(
      ...trackBaseStyles,
      ...trackVariantStyles,
      disabled ? "cursor-not-allowed" : ""
    );

    // Combine thumb styles
    const thumbClasses = cn(...thumbBaseStyles, ...thumbVariantStyles);

    // Label styles
    const labelClasses = cn(
      "font-medium text-zinc-100 cursor-pointer",
      config.text,
      disabled ? "cursor-not-allowed opacity-50" : ""
    );

    const combinedAriaDescribedBy = cn(ariaDescribedBy, helperTextId);

    // Container styles
    const containerClasses = cn("flex flex-col", className);
    const switchContainerClasses = cn("flex items-center", config.gap);

    return (
      <div className={containerClasses}>
        <div className={switchContainerClasses}>
          <label htmlFor={switchId} className={labelClasses}>
            {label}
          </label>

          <div className={trackClasses} onClick={handleTrackClick}>
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
              aria-describedby={combinedAriaDescribedBy || undefined}
              className="sr-only"
              {...props}
            />
            <div className={thumbClasses} aria-hidden="true" />
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
      </div>
    );
  }
);

Switch.displayName = "Switch";

export default Switch;
