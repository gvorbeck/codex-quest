/**
 * UI Component Types
 * Type definitions for UI components, styling, and design system elements
 */

import type { ButtonHTMLAttributes } from "react";

// Design system types - derived from uiDesignSystem constants
export type CurrencyAbbreviation = "pp" | "gp" | "ep" | "sp" | "cp";
export type AbilityBadgeVariant =
  | "primary"
  | "warning"
  | "danger"
  | "success"
  | "supplemental"
  | "status";

// Button types
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "destructive"
  | "accent";
export type ButtonSize = "sm" | "md" | "lg";

export interface BaseButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

// Tooltip types
export interface TooltipPosition {
  top: number;
  left: number;
}

export interface PositioningOptions {
  /** Minimum distance from screen edge */
  padding: number;
  /** Gap between tooltip and trigger element */
  gap: number;
  /** Preferred position relative to trigger */
  preferredPosition: "above" | "below";
}

export interface TooltipPositionResult {
  position: TooltipPosition;
  wasAdjusted?: boolean;
  placement?: "above" | "below";
  isBelow?: boolean;
  arrowOffset?: number;
}

// Validation types
export interface PropValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  context?: Record<string, unknown>;
}

// Loading state types
export interface UseLoadingStateOptions {
  initialState?: boolean;
}

export interface LoadingState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
  withLoading: <T>(asyncFn: () => Promise<T>) => Promise<T>;
}

// Notification types
export interface ShowNotificationOptions {
  title?: string;
  priority?: "info" | "success" | "warning" | "error";
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
  duration?: number;
  dismissible?: boolean;
}

export interface NotificationSystem {
  notifications: Array<{
    id: string;
    message: string | React.ReactNode;
    title?: string;
    priority?: "info" | "success" | "warning" | "error";
    position?:
      | "top-right"
      | "top-left"
      | "bottom-right"
      | "bottom-left"
      | "top-center"
      | "bottom-center";
    duration?: number;
    dismissible?: boolean;
  }>;
  showNotification: (
    message: string | React.ReactNode,
    options?: ShowNotificationOptions
  ) => string;
  showInfo: (
    message: string | React.ReactNode,
    options?: Omit<ShowNotificationOptions, "priority">
  ) => string;
  showSuccess: (
    message: string | React.ReactNode,
    options?: Omit<ShowNotificationOptions, "priority">
  ) => string;
  showWarning: (
    message: string | React.ReactNode,
    options?: Omit<ShowNotificationOptions, "priority">
  ) => string;
  showError: (
    message: string | React.ReactNode,
    options?: Omit<ShowNotificationOptions, "priority">
  ) => string;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
  pauseAll: () => void;
  resumeAll: () => void;
}
