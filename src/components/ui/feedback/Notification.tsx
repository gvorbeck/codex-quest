import { forwardRef, useEffect, useState, useCallback, useRef } from "react";
import type { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/constants/styles";
import { Typography } from "@/components/ui/design-system";

export type NotificationPriority = "default" | "success" | "warning" | "error";
export type NotificationPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

export interface NotificationProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Unique identifier for the notification */
  id: string;
  /** Required message content */
  message: ReactNode;
  /** Optional title - hidden if not provided */
  title?: string;
  /** Visual priority/type affecting colors */
  priority?: NotificationPriority;
  /** Position on screen */
  position?: NotificationPosition;
  /** Auto-dismiss timer in milliseconds (0 = no auto-dismiss) */
  duration?: number;
  /** Callback fired when notification is dismissed */
  onDismiss?: (id: string) => void;
  /** Whether notification can be manually dismissed */
  dismissible?: boolean;
  /** Whether notification is visible (controls animation) */
  isVisible?: boolean;
}

const Notification = forwardRef<HTMLDivElement, NotificationProps>(
  (
    {
      id,
      message,
      title,
      priority = "default",
      position = "top-right",
      duration = 15000,
      onDismiss,
      dismissible = true,
      isVisible = true,
      className,
      ...props
    },
    ref
  ) => {
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);
    const dismissTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    const handleDismiss = useCallback(() => {
      setIsAnimatingOut(true);

      // Clear any existing animation timeout
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }

      // Allow animation to complete before calling onDismiss
      animationTimeoutRef.current = setTimeout(() => {
        onDismiss?.(id);
      }, 300);
    }, [id, onDismiss]);

    // Auto-dismiss timer
    useEffect(() => {
      if (duration > 0 && isVisible) {
        // Clear any existing dismiss timeout
        if (dismissTimeoutRef.current) {
          clearTimeout(dismissTimeoutRef.current);
        }

        dismissTimeoutRef.current = setTimeout(() => {
          handleDismiss();
        }, duration);

        return () => {
          if (dismissTimeoutRef.current) {
            clearTimeout(dismissTimeoutRef.current);
          }
        };
      }

      return undefined;
    }, [duration, isVisible, handleDismiss]);

    // Cleanup effect for component unmount
    useEffect(() => {
      return () => {
        if (dismissTimeoutRef.current) {
          clearTimeout(dismissTimeoutRef.current);
        }
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
        }
      };
    }, []);

    // Focus management for critical notifications
    useEffect(() => {
      if (isVisible && priority === "error" && notificationRef.current) {
        // Focus error notifications for immediate attention
        // Small delay to ensure the notification is rendered and positioned
        const focusTimer = setTimeout(() => {
          notificationRef.current?.focus();
        }, 100);

        return () => clearTimeout(focusTimer);
      }

      return undefined;
    }, [isVisible, priority]);

    // Priority-based styling
    const priorityStyles = {
      default: {
        bg: "bg-zinc-800",
        border: "border-amber-600",
        shadow: "shadow-[0_3px_0_0_#b45309]",
        titleColor: "amber" as const,
        messageColor: "primary" as const,
      },
      success: {
        bg: "bg-lime-950/20",
        border: "border-lime-600",
        shadow: "shadow-[0_3px_0_0_#65a30d]",
        titleColor: "lime" as const,
        messageColor: "primary" as const,
      },
      warning: {
        bg: "bg-amber-950/20",
        border: "border-amber-600",
        shadow: "shadow-[0_3px_0_0_#d97706]",
        titleColor: "amber" as const,
        messageColor: "primary" as const,
      },
      error: {
        bg: "bg-red-950/20",
        border: "border-red-600",
        shadow: "shadow-[0_3px_0_0_#dc2626]",
        titleColor: "white" as const,
        messageColor: "white" as const,
      },
    };

    // Position-based transform for animations
    const positionAnimations = {
      "top-right": {
        enter: "translate-x-0 translate-y-0",
        exit: "translate-x-full translate-y-0",
        initial: "translate-x-full translate-y-0",
      },
      "top-left": {
        enter: "translate-x-0 translate-y-0",
        exit: "-translate-x-full translate-y-0",
        initial: "-translate-x-full translate-y-0",
      },
      "bottom-right": {
        enter: "translate-x-0 translate-y-0",
        exit: "translate-x-full translate-y-0",
        initial: "translate-x-full translate-y-0",
      },
      "bottom-left": {
        enter: "translate-x-0 translate-y-0",
        exit: "-translate-x-full translate-y-0",
        initial: "-translate-x-full translate-y-0",
      },
      "top-center": {
        enter: "translate-x-0 translate-y-0",
        exit: "translate-x-0 -translate-y-full",
        initial: "translate-x-0 -translate-y-full",
      },
      "bottom-center": {
        enter: "translate-x-0 translate-y-0",
        exit: "translate-x-0 translate-y-full",
        initial: "translate-x-0 translate-y-full",
      },
    };

    const styles = priorityStyles[priority];
    const animations = positionAnimations[position];

    // Animation state classes
    const getAnimationClass = () => {
      if (!isVisible) return animations.initial;
      if (isAnimatingOut) return animations.exit;
      return animations.enter;
    };

    const notificationClasses = cn(
      // Base styles
      "border-2 rounded-lg p-4 max-w-sm transition-all duration-300 ease-in-out",
      "backdrop-blur-sm relative",

      // Priority-based colors
      styles.bg,
      styles.border,
      styles.shadow,

      // Animation state
      getAnimationClass(),

      // Opacity for fade effect
      isVisible && !isAnimatingOut ? "opacity-100" : "opacity-0",

      className
    );

    return (
      <div
        ref={(node) => {
          notificationRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={notificationClasses}
        role="alert"
        aria-live={priority === "error" ? "assertive" : "polite"}
        aria-atomic="true"
        tabIndex={priority === "error" ? 0 : -1}
        {...props}
      >
        {/* Close button */}
        {dismissible && (
          <button
            onClick={handleDismiss}
            className={cn(
              "absolute top-2 right-2 w-6 h-6 flex items-center justify-center",
              "rounded-full transition-colors duration-150",
              "hover:bg-zinc-700/50 focus:bg-zinc-700/50 focus:outline-none",
              "text-zinc-400 hover:text-zinc-100"
            )}
            aria-label="Dismiss notification"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Content */}
        <div className={dismissible ? "pr-8" : ""}>
          {title && (
            <Typography variant="h6" color={styles.titleColor} className="mb-1">
              {title}
            </Typography>
          )}

          <Typography
            variant="bodySmall"
            color={styles.messageColor}
            className="leading-relaxed"
          >
            {message}
          </Typography>
        </div>

        {/* Progress bar for timed notifications */}
        {duration > 0 && isVisible && !isAnimatingOut && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-700/30 rounded-b-lg overflow-hidden">
            <div
              className={cn(
                "h-full transition-all ease-linear rounded-b-lg",
                priority === "success"
                  ? "bg-lime-500"
                  : priority === "error"
                  ? "bg-red-500"
                  : "bg-amber-500"
              )}
              style={{
                animation: `shrink ${duration}ms linear forwards`,
              }}
            />
          </div>
        )}
      </div>
    );
  }
);

Notification.displayName = "Notification";

export default Notification;
