import { forwardRef, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import {
  createButtonStyles,
  combineButtonStyles,
  type BaseButtonProps,
  type ButtonVariant,
} from "@/utils/buttonStyles";
import { TooltipWrapper } from "@/components/ui/feedback";
import { DESIGN_TOKENS } from "@/constants/designTokens";

// FAB specific types - extends the base button variants
type FABVariant = ButtonVariant;
type FABSize = "sm" | "md" | "lg";
type FABPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";

// Individual FAB Props
interface FloatingActionButtonProps extends Omit<BaseButtonProps, "children"> {
  /** Icon or content for the button */
  children: ReactNode;
  /** Button variant */
  variant?: FABVariant;
  /** Button size */
  size?: FABSize;
  /** Tooltip text that appears on hover */
  tooltip?: string;
  /** Whether to show tooltip */
  showTooltip?: boolean;
  /** Additional className for the tooltip */
  tooltipClassName?: string;
}

// FAB Group Props for stacking multiple FABs
interface FABGroupProps {
  /** Array of FAB configurations */
  actions: Array<FloatingActionButtonProps & { key: string; label: string }>;
  /** Position of the FAB group on screen */
  position?: FABPosition;
  /** Whether the group is expanded (showing all actions) */
  expanded?: boolean;
  /** Callback when expansion state changes */
  onExpandedChange?: (expanded: boolean) => void;
  /** Main action button configuration */
  mainAction?: FloatingActionButtonProps & { key: string; label: string };
  /** Whether to show labels next to actions when expanded */
  showLabels?: boolean;
  /** Custom className for the group container */
  className?: string;
  /** Animation direction when expanding */
  expandDirection?: "up" | "down" | "left" | "right";
}

// Extract style objects to module level to prevent recreation on each render
const BUTTON_STYLES = createButtonStyles(true); // true = circular FAB

// Predefined delay classes to ensure Tailwind inclusion
const DELAY_CLASSES = [
  "delay-0",
  "delay-50",
  "delay-100",
  "delay-150",
  "delay-200",
  "delay-300",
];

// Base FAB component
const FloatingActionButton = forwardRef<
  HTMLButtonElement,
  FloatingActionButtonProps
>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      loadingText = "Loading...",
      tooltip,
      showTooltip = true,
      tooltipClassName,
      disabled,
      className = "",
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    // Combine all styles using shared utility
    const buttonClasses = combineButtonStyles(
      BUTTON_STYLES.base,
      BUTTON_STYLES.variants[variant],
      BUTTON_STYLES.sizes[size],
      className
    );

    const buttonElement = (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-label={ariaLabel || tooltip}
        aria-disabled={isDisabled}
        aria-busy={loading}
        className={buttonClasses}
        {...props}
      >
        {loading ? (
          <span
            aria-hidden="true"
            className="animate-spin inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full"
          />
        ) : (
          children
        )}
        {loading && <span className="sr-only">{loadingText}</span>}
      </button>
    );

    // Use TooltipWrapper for consistent tooltip behavior
    return (
      <TooltipWrapper
        tooltip={tooltip}
        showTooltip={showTooltip}
        disabled={isDisabled}
        tooltipClassName={tooltipClassName}
      >
        {buttonElement}
      </TooltipWrapper>
    );
  }
);

FloatingActionButton.displayName = "FloatingActionButton";

// FAB Group component for multiple stacked actions
const FABGroup: React.FC<FABGroupProps> = ({
  actions,
  position = "bottom-right",
  expanded = false,
  onExpandedChange,
  mainAction,
  showLabels = true,
  className = "",
  expandDirection = "up",
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  // Sync internal state with external expanded prop
  useEffect(() => {
    setIsExpanded(expanded);
  }, [expanded]);

  // Handle expansion toggle with memoized callback
  const handleToggle = useCallback(() => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onExpandedChange?.(newExpanded);
  }, [isExpanded, onExpandedChange]);

  // Handle ESC key to close expanded groups
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isExpanded) {
        setIsExpanded(false);
        onExpandedChange?.(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }

    // Return undefined for the else case to satisfy TypeScript
    return undefined;
  }, [isExpanded, onExpandedChange]);

  // Position styles for the FAB group
  const positionStyles = {
    "bottom-right": "fixed bottom-6 right-6",
    "bottom-left": "fixed bottom-6 left-6",
    "top-right": "fixed top-6 right-6",
    "top-left": "fixed top-6 left-6",
  };

  // Direction styles for action expansion
  const directionStyles = {
    up: "flex-col-reverse",
    down: "flex-col",
    left: "flex-row-reverse",
    right: "flex-row",
  };

  // Animation classes for actions using predefined classes
  const getActionAnimationClass = useCallback(
    (index: number) => {
      const delayIndex = Math.min(index, DELAY_CLASSES.length - 1);
      const delayClass = DELAY_CLASSES[delayIndex];

      return isExpanded
        ? `animate-in fade-in slide-in-from-bottom-2 duration-200 ${delayClass}`
        : `animate-out fade-out slide-out-to-bottom-2 duration-150`;
    },
    [isExpanded]
  );

  // Determine if we're using vertical or horizontal layout
  const isVertical = expandDirection === "up" || expandDirection === "down";

  return (
    <div
      className={`${positionStyles[position]} flex ${directionStyles[expandDirection]} items-center gap-4 z-50 ${className}`}
    >
      {/* Secondary Actions */}
      {isExpanded && (
        <div
          className={`flex ${directionStyles[expandDirection]} ${
            isVertical ? "items-end" : "items-center"
          } gap-3`}
        >
          {actions.map((action, index) => {
            const { key, label, ...actionProps } = action;
            return (
              <div
                key={key}
                className={`flex ${
                  isVertical ? "flex-row" : "flex-col"
                } items-center gap-2 ${getActionAnimationClass(index)}`}
              >
                {/* Label */}
                {showLabels && (
                  <span
                    className={`${DESIGN_TOKENS.colors.text.primary} ${
                      DESIGN_TOKENS.colors.bg.label
                    } px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg border border-zinc-600 ${
                      isVertical ? "order-first" : "order-last"
                    }`}
                  >
                    {label}
                  </span>
                )}

                {/* Action Button */}
                <FloatingActionButton
                  {...actionProps}
                  aria-label={actionProps["aria-label"] || label}
                  tooltip={actionProps.tooltip || label}
                  showTooltip={!showLabels} // Don't show tooltip if we have labels
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Main Action Button */}
      {mainAction ? (
        <FloatingActionButton
          {...mainAction}
          onClick={(e) => {
            handleToggle();
            mainAction.onClick?.(e);
          }}
          aria-label={mainAction["aria-label"] || mainAction.label}
          aria-expanded={isExpanded}
          aria-haspopup="true"
          className={`transform transition-transform duration-200 ${
            isExpanded ? "rotate-45" : "rotate-0"
          } ${mainAction.className || ""}`}
        />
      ) : (
        // Default toggle button if no main action provided
        <FloatingActionButton
          onClick={handleToggle}
          aria-label={isExpanded ? "Close actions menu" : "Open actions menu"}
          aria-expanded={isExpanded}
          aria-haspopup="true"
          className={`transform transition-transform duration-200 ${
            isExpanded ? "rotate-45" : "rotate-0"
          }`}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M12 5V19M5 12H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </FloatingActionButton>
      )}

      {/* Backdrop overlay when expanded */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={handleToggle}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export { FloatingActionButton, FABGroup };
export type {
  FloatingActionButtonProps,
  FABGroupProps,
  FABVariant,
  FABSize,
  FABPosition,
};
