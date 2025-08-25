import React from "react";
import Tooltip from "@/components/ui/feedback/Tooltip";
import type { ReactNode } from "react";

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
}

/**
 * A wrapper component that conditionally applies tooltip functionality
 * to its children while maintaining consistency with the existing Tooltip component.
 *
 * This ensures all tooltips in the application use the same portal-based approach,
 * positioning logic, and styling patterns.
 */
const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
  tooltip,
  showTooltip = true,
  children,
  disabled = false,
  tooltipClassName = "",
}) => {
    // Only show tooltip if all conditions are met
    const shouldShowTooltip = Boolean(tooltip) && showTooltip && !disabled;

    if (shouldShowTooltip && tooltip) {
      return (
        <Tooltip content={tooltip} className={tooltipClassName}>
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
