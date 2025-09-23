import {
  forwardRef,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import type { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/utils";
import { Typography } from "@/components/ui/core/display";
import { Button } from "@/components/ui/core/primitives";
import {
  NOTIFICATION_CONSTANTS,
  PRIORITY_STYLES,
  POSITION_ANIMATIONS,
  PRIORITY_PROGRESS_COLORS,
  BASE_NOTIFICATION_STYLES,
} from "@/constants";

export type NotificationPriority = "info" | "success" | "warning" | "error";
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
      priority = "info",
      position = "top-right",
      duration = 0,
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
    const previousFocusRef = useRef<HTMLElement | null>(null);

    const handleDismiss = useCallback(() => {
      setIsAnimatingOut(true);

      // Clear any existing animation timeout
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }

      // Allow animation to complete before calling onDismiss
      animationTimeoutRef.current = setTimeout(() => {
        onDismiss?.(id);
      }, NOTIFICATION_CONSTANTS.ANIMATION_DURATION);
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

    // Focus management for critical notifications with restoration
    useEffect(() => {
      if (isVisible && priority === "error" && notificationRef.current) {
        // Store current focus before focusing the notification
        previousFocusRef.current = document.activeElement as HTMLElement;

        // Focus error notifications for immediate attention
        // Small delay to ensure the notification is rendered and positioned
        const focusTimer = setTimeout(() => {
          notificationRef.current?.focus();
        }, NOTIFICATION_CONSTANTS.FOCUS_DELAY);

        return () => {
          clearTimeout(focusTimer);
          // Restore focus when error notification is dismissed
          if (
            previousFocusRef.current &&
            document.contains(previousFocusRef.current) &&
            document.activeElement === notificationRef.current
          ) {
            previousFocusRef.current.focus();
          }
        };
      }

      return undefined;
    }, [isVisible, priority]);

    // Memoize style lookups to prevent recalculation on every render
    const styles = useMemo(() => PRIORITY_STYLES[priority], [priority]);
    const animations = useMemo(() => POSITION_ANIMATIONS[position], [position]);

    // Animation state classes - memoized to prevent recalculation
    const getAnimationClass = useCallback(() => {
      if (!isVisible) return animations.initial;
      if (isAnimatingOut) return animations.exit;
      return animations.enter;
    }, [isVisible, isAnimatingOut, animations]);

    // Memoize notification classes to prevent unnecessary re-renders
    const notificationClasses = useMemo(
      () =>
        cn(
          // Base styles
          ...BASE_NOTIFICATION_STYLES,

          // Priority-based colors
          styles.bg,
          styles.border,
          styles.shadow,

          // Animation state
          getAnimationClass(),

          // Opacity for fade effect
          isVisible && !isAnimatingOut ? "opacity-100" : "opacity-0",

          className
        ),
      [styles, isVisible, isAnimatingOut, getAnimationClass, className]
    );

    const accentClasses = cn(
      "absolute left-0 top-0 bottom-0 w-1 rounded-l-xl",
      styles.accent
    );
    const contentClasses = cn("pl-4", dismissible ? "pr-12" : "pr-4");
    const progressClasses = cn(
      "h-full transition-all ease-linear",
      PRIORITY_PROGRESS_COLORS[priority]
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
        {/* Accent bar */}
        <div className={accentClasses} />

        {/* Close button */}
        {dismissible && (
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 w-7 h-7 !p-0 !min-h-0 !border-0 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
            aria-label="Dismiss notification"
            icon="close"
            iconClasses="w-4 h-4"
          >
          </Button>
        )}

        {/* Content */}
        <div className={contentClasses}>
          {title && (
            <Typography
              variant="h6"
              color={styles.titleColor}
              className="mb-2 font-semibold"
            >
              {title}
            </Typography>
          )}

          <Typography
            variant="body"
            color={styles.messageColor}
            className="leading-relaxed"
          >
            {message}
          </Typography>
        </div>

        {/* Progress bar for timed notifications (only when duration > 0) */}
        {duration > 0 && isVisible && !isAnimatingOut && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5 dark:bg-white/5 overflow-hidden rounded-b-xl">
            <div
              className={progressClasses}
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
