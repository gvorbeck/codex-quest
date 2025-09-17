import { Tooltip } from "@/components/ui/core/feedback";
import { Icon, type IconName } from "@/components/ui/core/display/Icon";
import type { PositioningOptions } from "@/types";
import type { ReactNode } from "react";

// Default styles for consistent theming
const DEFAULT_ICON_STYLES =
  "text-zinc-500 hover:text-zinc-300 cursor-help transition-colors duration-200";

interface InfoTooltipProps {
  /** The content to show in the tooltip */
  content: string | ReactNode;
  /** Additional CSS classes for the wrapper */
  className?: string;
  /** Icon name to display */
  iconName?: IconName;
  /** Icon size */
  iconSize?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Additional CSS classes for the icon */
  iconClassName?: string;
  /** Preferred position for the tooltip */
  preferredPosition?: "above" | "below" | undefined;
  /** Custom positioning options for the tooltip */
  positioningOptions?: Partial<PositioningOptions> | undefined;
  /** Whether to disable the tooltip */
  disabled?: boolean;
  /** Accessible label for screen readers */
  ariaLabel?: string;
}

/**
 * InfoTooltip component that displays an info icon with a tooltip
 * Provides better accessibility than the previous version
 * Allows customization of icon and positioning
 */
export default function InfoTooltip({
  content,
  className = "",
  iconName = "info-question",
  iconSize = "sm",
  iconClassName,
  preferredPosition,
  positioningOptions,
  disabled = false,
  ariaLabel = "More information",
}: InfoTooltipProps) {
  const finalIconClassName =
    iconClassName || `${DEFAULT_ICON_STYLES} ${className}`;

  return (
    <Tooltip
      content={content}
      preferredPosition={preferredPosition}
      positioningOptions={positioningOptions}
      disabled={disabled}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        className="inline-block"
      >
        <Icon
          name={iconName}
          size={iconSize}
          className={finalIconClassName}
          title={ariaLabel} // Fallback for older browsers
        />
      </div>
    </Tooltip>
  );
}
