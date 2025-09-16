import { forwardRef, useState, useEffect, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import {
  createButtonStyles,
  combineButtonStyles,
  validateFABProps,
  logValidationResults,
  logger,
} from "@/utils";
import type { BaseButtonProps, ButtonVariant } from "@/types";
import { Icon, TooltipWrapper } from "@/components";
import { DESIGN_TOKENS } from "@/constants";
import { useFocusManagement } from "@/hooks";

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
  /** Test ID for automated testing */
  "data-testid"?: string;
  /** Custom error boundary handler */
  onFABError?: (error: Error) => void;
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
  /** Test ID for automated testing */
  "data-testid"?: string;
  /** Whether to enable focus trapping in expanded state */
  trapFocus?: boolean;
  /** Custom error boundary handler */
  onFABGroupError?: (error: Error) => void;
  /** Performance optimization: disable animations */
  disableAnimations?: boolean;
}

// Extract style objects to module level to prevent recreation on each render
const BUTTON_STYLES = createButtonStyles(true); // true = FAB (rounded square)

// Predefined delay classes to ensure Tailwind inclusion
const DELAY_CLASSES = [
  "delay-0",
  "delay-50",
  "delay-100",
  "delay-150",
  "delay-200",
  "delay-300",
];

// Base FAB component with enhanced Phase 2 features
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
      "data-testid": testId,
      onFABError,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    // Runtime prop validation (development only)
    const validationResults = useMemo(() => {
      return validateFABProps({
        variant,
        size,
        children,
        ...(tooltip && { tooltip }),
        ...(ariaLabel && { "aria-label": ariaLabel }),
      });
    }, [variant, size, children, tooltip, ariaLabel]);

    // Log validation results in development
    useEffect(() => {
      logValidationResults("FloatingActionButton", validationResults);
    }, [validationResults]);

    // Error boundary handling
    const handleError = useCallback(
      (error: Error) => {
        if (onFABError) {
          onFABError(error);
        } else {
          logger.error("FloatingActionButton Error:", error);
        }
      },
      [onFABError]
    );

    // Memoized style computation for performance
    const buttonClasses = useMemo(() => {
      try {
        return combineButtonStyles(
          BUTTON_STYLES.base,
          BUTTON_STYLES.variants[variant],
          BUTTON_STYLES.sizes[size],
          className
        );
      } catch (error) {
        handleError(error as Error);
        // Fallback styles
        return `inline-flex items-center justify-center p-3 rounded-full bg-amber-400 text-zinc-900 ${className}`;
      }
    }, [variant, size, className, handleError]);

    const buttonElement = (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-label={ariaLabel || tooltip}
        aria-disabled={isDisabled}
        aria-busy={loading}
        data-testid={testId}
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

// Enhanced FAB Group component with Phase 2 features
const FABGroup: React.FC<FABGroupProps> = ({
  actions,
  position = "bottom-right",
  expanded = false,
  onExpandedChange,
  mainAction,
  showLabels = true,
  className = "",
  expandDirection = "up",
  "data-testid": testId,
  trapFocus = true,
  onFABGroupError,
  disableAnimations = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  // Error boundary handling
  const handleError = useCallback(
    (error: Error) => {
      if (onFABGroupError) {
        onFABGroupError(error);
      } else {
        logger.error("FABGroup Error:", error);
      }
    },
    [onFABGroupError]
  );

  // Development validation
  useEffect(() => {
    if (import.meta.env.MODE === "development") {
      if (!actions || actions.length === 0) {
        handleError(new Error("FABGroup: actions array is empty or undefined"));
      }
    }
  }, [actions, handleError]);

  // Enhanced focus management
  const { containerRef, focusFirstElement } = useFocusManagement({
    trapFocus,
    restoreFocus: true,
    isActive: isExpanded,
  });

  // Sync internal state with external expanded prop
  useEffect(() => {
    setIsExpanded(expanded);
  }, [expanded]);

  // Handle expansion toggle with memoized callback
  const handleToggle = useCallback(() => {
    try {
      const newExpanded = !isExpanded;
      setIsExpanded(newExpanded);
      onExpandedChange?.(newExpanded);

      // Focus management for accessibility
      if (newExpanded && trapFocus) {
        // Small delay to allow DOM updates
        setTimeout(() => {
          focusFirstElement();
        }, 100);
      }
    } catch (error) {
      handleError(error as Error);
    }
  }, [isExpanded, onExpandedChange, trapFocus, focusFirstElement, handleError]);

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
  }, [isExpanded, onExpandedChange]); // Position styles for the FAB group
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
      if (disableAnimations) {
        return ""; // No animations when disabled
      }

      const delayIndex = Math.min(index, DELAY_CLASSES.length - 1);
      const delayClass = DELAY_CLASSES[delayIndex];

      return isExpanded
        ? `animate-in fade-in slide-in-from-bottom-2 duration-200 ${delayClass}`
        : `animate-out fade-out slide-out-to-bottom-2 duration-150`;
    },
    [isExpanded, disableAnimations]
  );

  // Determine if we're using vertical or horizontal layout
  const isVertical = expandDirection === "up" || expandDirection === "down";

  // Determine alignment based on expand direction
  const containerAlignment = isVertical ? "items-end" : "items-center";

  return (
    <div
      ref={containerRef}
      className={`${positionStyles[position]} flex ${directionStyles[expandDirection]} ${containerAlignment} gap-4 z-50 ${className}`}
      role="group"
      aria-label="Floating action menu"
      data-testid={testId}
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
          key={mainAction.key}
          {...(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { key, ...props } = mainAction;
            return props;
          })()}
          onClick={(e) => {
            handleToggle();
            mainAction.onClick?.(e);
          }}
          aria-label={mainAction["aria-label"] || mainAction.label}
          aria-expanded={isExpanded}
          aria-haspopup="true"
          className={`${
            disableAnimations
              ? ""
              : "transform transition-transform duration-200"
          } ${isExpanded && !disableAnimations ? "rotate-45" : "rotate-0"} ${
            mainAction.className || ""
          }`}
        />
      ) : (
        // Default toggle button if no main action provided
        <FloatingActionButton
          onClick={handleToggle}
          aria-label={isExpanded ? "Close actions menu" : "Open actions menu"}
          aria-expanded={isExpanded}
          aria-haspopup="true"
          className={`${
            disableAnimations
              ? ""
              : "transform transition-transform duration-200"
          } ${isExpanded && !disableAnimations ? "rotate-45" : "rotate-0"}`}
        >
          <Icon name="plus" size="lg" aria-hidden={true} />
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
