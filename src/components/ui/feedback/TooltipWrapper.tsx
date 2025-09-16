import React from "react";
import type { ReactNode } from "react";
import type { PositioningOptions } from "@/types";
import Tooltip from "./Tooltip";

interface TooltipWrapperProps {
  /** The tooltip content to display */
  tooltip?: string | undefined;
  /** Whether to show the tooltip */
  showTooltip?: boolean;
  /** The children to wrap with tooltip functionality */
  children: ReactNode;
  /** Whether the trigger element is disabled (tooltips won't show for disabled elements) */
  disabled?: boolean;
  /** Additional className for the tooltip */
  tooltipClassName?: string | undefined;
  /** Preferred position for the tooltip */
  preferredPosition?: "above" | "below" | undefined;
  /** Custom positioning options for the tooltip */
  positioningOptions?: Partial<PositioningOptions> | undefined;
}

/**
 * A wrapper component that conditionally applies tooltip functionality
 * to its children while maintaining consistency with the existing Tooltip component.
 *
 * This ensures all tooltips in the application use the same portal-based approach,
 * positioning logic, and styling patterns. Now supports all enhanced Tooltip features.
 */
const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
  tooltip,
  showTooltip = true,
  children,
  disabled = false,
  tooltipClassName = "",
  preferredPosition,
  positioningOptions,
}) => {
  // Only show tooltip if all conditions are met
  const shouldShowTooltip =
    Boolean(tooltip?.trim()) && showTooltip && !disabled;

  if (shouldShowTooltip && tooltip) {
    return (
      <Tooltip
        content={tooltip}
        className={tooltipClassName}
        preferredPosition={preferredPosition}
        positioningOptions={positioningOptions}
        disabled={disabled}
      >
        {children}
      </Tooltip>
    );
  }

  // Return children unwrapped if no tooltip should be shown
  return <>{children}</>;
};

TooltipWrapper.displayName = "TooltipWrapper";

export default TooltipWrapper;
export type { TooltipWrapperProps };
