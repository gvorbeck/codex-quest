import { forwardRef, useState, useRef, useEffect } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { DESIGN_TOKENS } from "@/constants/designTokens";

// FAB Variants
type FABVariant = "primary" | "secondary" | "accent" | "ghost";
type FABSize = "sm" | "md" | "lg";
type FABPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";

// Individual FAB Props
interface FloatingActionButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Icon or content for the button */
  children: ReactNode;
  /** Button variant */
  variant?: FABVariant;
  /** Button size */
  size?: FABSize;
  /** Whether the button is in a loading state */
  loading?: boolean;
  /** Loading state text for screen readers */
  loadingText?: string;
  /** Tooltip text that appears on hover */
  tooltip?: string;
  /** Whether to show tooltip */
  showTooltip?: boolean;
  /** Custom tooltip position */
  tooltipPosition?: "top" | "bottom" | "left" | "right";
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
      tooltipPosition = "left",
      disabled,
      className = "",
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const [showTooltipState, setShowTooltipState] = useState(false);
    const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const isDisabled = disabled || loading;

    // Clean up timeout on unmount
    useEffect(() => {
      return () => {
        if (tooltipTimeoutRef.current) {
          clearTimeout(tooltipTimeoutRef.current);
        }
      };
    }, []);

    // Handle tooltip visibility
    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (tooltip && showTooltip && !isDisabled) {
        tooltipTimeoutRef.current = setTimeout(() => {
          setShowTooltipState(true);
        }, 500); // Delay before showing tooltip
      }
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
        tooltipTimeoutRef.current = null;
      }
      setShowTooltipState(false);
      onMouseLeave?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
      if (tooltip && showTooltip && !isDisabled) {
        setShowTooltipState(true);
      }
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
      setShowTooltipState(false);
      onBlur?.(e);
    };

    // Base styles for circular FAB
    const baseStyles = [
      "relative inline-flex items-center justify-center",
      "font-semibold transition-all duration-200 ease-out",
      "border-2 rounded-full shadow-lg",
      "transform hover:scale-105 active:scale-95",
      "focus:outline-none focus:ring-4 focus:ring-amber-400/50 focus:ring-offset-2 focus:ring-offset-zinc-900",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:transform-none",
      "group", // For tooltip positioning
    ];

    // Variant styles with enhanced 3D effects
    const variantStyles = {
      primary: [
        "bg-amber-400 text-zinc-900 border-amber-500",
        "shadow-[0_6px_0_0_#b45309,0_0_20px_rgba(245,158,11,0.4)]",
        "hover:shadow-[0_8px_0_0_#b45309,0_0_25px_rgba(245,158,11,0.5)]",
        "hover:bg-amber-300 hover:border-amber-400",
        "active:shadow-[0_3px_0_0_#b45309,0_0_15px_rgba(245,158,11,0.3)]",
      ],
      secondary: [
        "bg-zinc-700 text-amber-400 border-zinc-600",
        "shadow-[0_6px_0_0_#3f3f46,0_0_20px_rgba(0,0,0,0.4)]",
        "hover:shadow-[0_8px_0_0_#3f3f46,0_0_25px_rgba(0,0,0,0.5)]",
        "hover:bg-zinc-600 hover:text-amber-300",
        "active:shadow-[0_3px_0_0_#3f3f46,0_0_15px_rgba(0,0,0,0.3)]",
      ],
      accent: [
        "bg-gradient-to-br from-amber-400 to-amber-500 text-zinc-900 border-amber-600",
        "shadow-[0_6px_0_0_#b45309,0_0_20px_rgba(245,158,11,0.4)]",
        "hover:shadow-[0_8px_0_0_#b45309,0_0_25px_rgba(245,158,11,0.5)]",
        "hover:from-amber-300 hover:to-amber-400",
        "active:shadow-[0_3px_0_0_#b45309,0_0_15px_rgba(245,158,11,0.3)]",
      ],
      ghost: [
        "bg-zinc-800/80 backdrop-blur-sm text-zinc-300 border-zinc-600/50",
        "shadow-[0_6px_0_0_#27272a,0_0_20px_rgba(0,0,0,0.4)]",
        "hover:shadow-[0_8px_0_0_#27272a,0_0_25px_rgba(0,0,0,0.5)]",
        "hover:bg-zinc-700/90 hover:text-zinc-100 hover:border-zinc-500",
        "active:shadow-[0_3px_0_0_#27272a,0_0_15px_rgba(0,0,0,0.3)]",
      ],
    };

    // Size styles for circular buttons
    const sizeStyles = {
      sm: "w-12 h-12 text-sm",
      md: "w-14 h-14 text-base",
      lg: "w-16 h-16 text-lg",
    };

    // Tooltip positioning styles
    const tooltipPositionStyles = {
      top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
      bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
      left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
      right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
    };

    // Tooltip arrow styles
    const tooltipArrowStyles = {
      top: "top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-zinc-800",
      bottom:
        "bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-zinc-800",
      left: "left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-zinc-800",
      right:
        "right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-zinc-800",
    };

    // Combine all styles
    const buttonClasses = [
      ...baseStyles,
      ...variantStyles[variant],
      sizeStyles[size],
      className,
    ].join(" ");

    return (
      <div className="relative">
        <button
          ref={ref}
          disabled={isDisabled}
          aria-label={ariaLabel || tooltip}
          aria-disabled={isDisabled}
          aria-busy={loading}
          className={buttonClasses}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
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

        {/* Tooltip */}
        {tooltip && showTooltip && showTooltipState && !isDisabled && (
          <div
            role="tooltip"
            className={`absolute z-50 px-3 py-2 text-sm font-medium text-zinc-100 bg-zinc-800 rounded-lg shadow-lg border border-zinc-600 whitespace-nowrap pointer-events-none transition-opacity duration-200 ${tooltipPositionStyles[tooltipPosition]}`}
          >
            {tooltip}
            <div
              className={`absolute w-0 h-0 border-4 ${tooltipArrowStyles[tooltipPosition]}`}
            />
          </div>
        )}
      </div>
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

  // Handle expansion toggle
  const handleToggle = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onExpandedChange?.(newExpanded);
  };

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

  // Animation classes for actions
  const getActionAnimationClass = (index: number) => {
    const delay = index * 50; // Stagger animation
    return isExpanded
      ? `animate-in fade-in slide-in-from-bottom-2 duration-200 delay-[${delay}ms]`
      : `animate-out fade-out slide-out-to-bottom-2 duration-150`;
  };

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
