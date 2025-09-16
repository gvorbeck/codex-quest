import { forwardRef } from "react";
import { SIZE_STYLES } from "@/constants";
import { cn } from "@/utils";
import type { BaseButtonProps } from "@/types";
import { StatusDot } from "@/components/ui/display";
import Button from "@/components/ui/inputs/Button";

// Design tokens for RollableButton styling
const ROLLABLE_BUTTON_STYLES = {
  base: "w-full flex items-center justify-between py-3 px-4 gap-4 group/item",
  colors: {
    bg: "bg-zinc-750/20 border-zinc-600/60",
    hover:
      "hover:bg-zinc-700/30 hover:border-amber-400/20 hover:shadow-lg hover:shadow-amber-400/5",
    text: {
      label: "text-amber-400 group-hover/item:text-amber-300",
      value: "text-zinc-100 group-hover/item:text-amber-300",
    },
  },
} as const;

interface RollableButtonProps extends Omit<BaseButtonProps, "children"> {
  label: string;
  value: string | number;
  tooltip: string;
  size?: "sm" | "md" | "lg";
}

const RollableButton = forwardRef<HTMLButtonElement, RollableButtonProps>(
  (
    {
      label,
      value,
      tooltip,
      size = "md",
      variant = "ghost",
      className = "",
      ...props
    },
    ref
  ) => {
    const currentSize = SIZE_STYLES[size];

    const buttonClasses = cn(
      ROLLABLE_BUTTON_STYLES.base,
      ROLLABLE_BUTTON_STYLES.colors.bg,
      ROLLABLE_BUTTON_STYLES.colors.hover,
      "transition-all duration-200",
      "!justify-between", // Override Button's justify-center
      className
    );

    const labelClasses = cn(
      ROLLABLE_BUTTON_STYLES.colors.text.label,
      currentSize.labelText,
      "transition-colors text-left"
    );

    const valueClasses = cn(
      ROLLABLE_BUTTON_STYLES.colors.text.value,
      currentSize.contentText,
      "text-right transition-colors"
    );

    return (
      <Button
        ref={ref}
        variant={variant}
        className={buttonClasses}
        title={tooltip}
        aria-label={tooltip}
        role="button"
        {...props}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <StatusDot
            size="xs"
            status="inactive"
            className="group-hover/item:bg-amber-400 transition-colors duration-200 flex-shrink-0"
            ariaLabel="Rollable button indicator"
          />
          <span className={labelClasses}>{label}</span>
        </div>
        <div className={valueClasses}>{value}</div>
      </Button>
    );
  }
);

RollableButton.displayName = "RollableButton";

export default RollableButton;
