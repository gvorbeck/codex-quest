import type {
  NotificationPriority,
  NotificationPosition,
} from "@/components/ui/feedback/Notification";

/**
 * Animation and timing constants for notifications
 */
export const NOTIFICATION_CONSTANTS = {
  ANIMATION_DURATION: 400,
  DEFAULT_DURATION: 0,
  STAGGER_DELAY: 150,
  FOCUS_DELAY: 100,
  MAX_NOTIFICATIONS: 5,
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
    titleColor: "amber" | "lime" | "white" | "primary" | "slate";
    messageColor: "primary" | "white" | "slate";
    accent: string;
  }
> = {
  info: {
    bg: "bg-gradient-to-br from-slate-50/95 to-slate-100/95 dark:from-slate-900/90 dark:to-slate-800/90",
    border: "border-slate-200 dark:border-slate-700",
    shadow: "shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50",
    titleColor: "slate",
    messageColor: "slate",
    accent: "bg-blue-500",
  },
  success: {
    bg: "bg-gradient-to-br from-lime-50/95 to-lime-100/95 dark:from-lime-950/80 dark:to-lime-900/80",
    border: "border-lime-200 dark:border-lime-800",
    shadow: "shadow-lg shadow-lime-200/50 dark:shadow-lime-900/30",
    titleColor: "slate",
    messageColor: "slate",
    accent: "bg-lime-500",
  },
  warning: {
    bg: "bg-gradient-to-br from-amber-50/95 to-orange-100/95 dark:from-amber-950/80 dark:to-orange-900/80",
    border: "border-amber-200 dark:border-amber-800",
    shadow: "shadow-lg shadow-amber-200/50 dark:shadow-amber-900/30",
    titleColor: "slate",
    messageColor: "slate",
    accent: "bg-amber-500",
  },
  error: {
    bg: "bg-gradient-to-br from-red-50/90 to-rose-100/90 dark:from-red-950/80 dark:to-rose-900/80",
    border: "border-red-200 dark:border-red-700",
    shadow: "shadow-lg shadow-red-200/50 dark:shadow-red-900/40",
    titleColor: "slate",
    messageColor: "slate",
    accent: "bg-red-500",
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
    enter: "translate-x-0 translate-y-0 scale-100",
    exit: "translate-x-full translate-y-0 scale-95",
    initial: "translate-x-full translate-y-0 scale-95",
  },
  "top-left": {
    enter: "translate-x-0 translate-y-0 scale-100",
    exit: "-translate-x-full translate-y-0 scale-95",
    initial: "-translate-x-full translate-y-0 scale-95",
  },
  "bottom-right": {
    enter: "translate-x-0 translate-y-0 scale-100",
    exit: "translate-x-full translate-y-0 scale-95",
    initial: "translate-x-full translate-y-0 scale-95",
  },
  "bottom-left": {
    enter: "translate-x-0 translate-y-0 scale-100",
    exit: "-translate-x-full translate-y-0 scale-95",
    initial: "-translate-x-full translate-y-0 scale-95",
  },
  "top-center": {
    enter: "translate-x-0 translate-y-0 scale-100",
    exit: "translate-x-0 -translate-y-full scale-95",
    initial: "translate-x-0 -translate-y-full scale-95",
  },
  "bottom-center": {
    enter: "translate-x-0 translate-y-0 scale-100",
    exit: "translate-x-0 translate-y-full scale-95",
    initial: "translate-x-0 translate-y-full scale-95",
  },
} as const;

/**
 * Progress bar color mapping for different priorities
 */
export const PRIORITY_PROGRESS_COLORS: Record<NotificationPriority, string> = {
  info: "bg-blue-500",
  success: "bg-lime-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
} as const;

/**
 * Base notification styles that don't change
 */
export const BASE_NOTIFICATION_STYLES = [
  "border",
  "rounded-xl",
  "p-5",
  "max-w-md",
  "min-w-80",
  "transition-all",
  "duration-500",
  "ease-out",
  "backdrop-blur-md",
  "relative",
  "overflow-hidden",
] as const;
