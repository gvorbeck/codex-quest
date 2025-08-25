import type {
  NotificationPriority,
  NotificationPosition,
} from "@/components/ui/feedback/Notification";

/**
 * Animation and timing constants for notifications
 */
export const NOTIFICATION_CONSTANTS = {
  ANIMATION_DURATION: 300,
  DEFAULT_DURATION: 15000,
  STAGGER_DELAY: 100,
  FOCUS_DELAY: 100,
} as const;

/**
 * Priority-based styling configuration
 * Extracted outside component to prevent re-creation on every render
 */
export const PRIORITY_STYLES: Record<
  NotificationPriority,
  {
    bg: string;
    border: string;
    shadow: string;
    titleColor: "amber" | "lime" | "white" | "primary";
    messageColor: "primary" | "white";
  }
> = {
  info: {
    bg: "bg-zinc-800",
    border: "border-amber-600",
    shadow: "shadow-[0_3px_0_0_#b45309]",
    titleColor: "amber",
    messageColor: "primary",
  },
  success: {
    bg: "bg-lime-950/20",
    border: "border-lime-600",
    shadow: "shadow-[0_3px_0_0_#65a30d]",
    titleColor: "lime",
    messageColor: "primary",
  },
  warning: {
    bg: "bg-amber-950/20",
    border: "border-amber-600",
    shadow: "shadow-[0_3px_0_0_#d97706]",
    titleColor: "amber",
    messageColor: "primary",
  },
  error: {
    bg: "bg-red-950/20",
    border: "border-red-600",
    shadow: "shadow-[0_3px_0_0_#dc2626]",
    titleColor: "white",
    messageColor: "white",
  },
} as const;

/**
 * Position-based animation configuration
 * Extracted outside component to prevent re-creation on every render
 */
export const POSITION_ANIMATIONS: Record<
  NotificationPosition,
  {
    enter: string;
    exit: string;
    initial: string;
  }
> = {
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
} as const;

/**
 * Progress bar color mapping for different priorities
 */
export const PRIORITY_PROGRESS_COLORS: Record<NotificationPriority, string> = {
  info: "bg-amber-500",
  success: "bg-lime-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
} as const;

/**
 * Base notification styles that don't change
 */
export const BASE_NOTIFICATION_STYLES = [
  "border-2",
  "rounded-lg",
  "p-4",
  "max-w-sm",
  "transition-all",
  "duration-300",
  "ease-in-out",
  "backdrop-blur-sm",
  "relative",
] as const;
