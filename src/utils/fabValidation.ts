import type { ReactNode } from "react";
import React from "react";

/**
 * Runtime prop validation utilities for FloatingActionButton components
 * Provides development-time warnings and fallback handling
 */

export interface PropValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
}

/**
 * Validates FAB Group props at runtime
 */
export const validateFABGroupProps = (props: {
  actions?: Array<{ key: string; label: string; [key: string]: unknown }>;
  mainAction?: { key: string; label: string; [key: string]: unknown };
  position?: string;
  expandDirection?: string;
}): PropValidationResult => {
  const result: PropValidationResult = {
    isValid: true,
    warnings: [],
    errors: [],
  };

  const { actions = [], mainAction, position, expandDirection } = props;

  // Validate actions array
  if (actions.length === 0 && !mainAction) {
    result.errors.push(
      "FABGroup requires either actions array or mainAction to be provided"
    );
    result.isValid = false;
  }

  // Validate action structure
  actions.forEach((action, index) => {
    if (!action.key) {
      result.errors.push(
        `Action at index ${index} is missing required 'key' property`
      );
      result.isValid = false;
    }

    if (!action.label) {
      result.errors.push(
        `Action at index ${index} is missing required 'label' property`
      );
      result.isValid = false;
    }

    // Check for duplicate keys
    const duplicateIndex = actions.findIndex(
      (otherAction, otherIndex) =>
        otherIndex !== index && otherAction.key === action.key
    );
    if (duplicateIndex !== -1) {
      result.warnings.push(
        `Duplicate key '${action.key}' found at indices ${index} and ${duplicateIndex}`
      );
    }
  });

  // Validate main action
  if (mainAction) {
    if (!mainAction.key) {
      result.warnings.push("MainAction is missing 'key' property");
    }
    if (!mainAction.label) {
      result.warnings.push("MainAction is missing 'label' property");
    }
  }

  // Validate position
  const validPositions = [
    "bottom-right",
    "bottom-left",
    "top-right",
    "top-left",
  ];
  if (position && !validPositions.includes(position)) {
    result.warnings.push(
      `Invalid position '${position}'. Valid options: ${validPositions.join(
        ", "
      )}`
    );
  }

  // Validate expand direction
  const validDirections = ["up", "down", "left", "right"];
  if (expandDirection && !validDirections.includes(expandDirection)) {
    result.warnings.push(
      `Invalid expandDirection '${expandDirection}'. Valid options: ${validDirections.join(
        ", "
      )}`
    );
  }

  return result;
};

/**
 * Validates individual FAB props
 */
export const validateFABProps = (props: {
  variant?: string;
  size?: string;
  children?: ReactNode;
  tooltip?: string;
  "aria-label"?: string;
}): PropValidationResult => {
  const result: PropValidationResult = {
    isValid: true,
    warnings: [],
    errors: [],
  };

  const { variant, size, children, tooltip, "aria-label": ariaLabel } = props;

  // Validate required children
  if (!children) {
    result.errors.push("FloatingActionButton requires children content");
    result.isValid = false;
  }

  // Validate variant
  const validVariants = [
    "primary",
    "secondary",
    "ghost",
    "destructive",
    "accent",
  ];
  if (variant && !validVariants.includes(variant)) {
    result.warnings.push(
      `Invalid variant '${variant}'. Valid options: ${validVariants.join(", ")}`
    );
  }

  // Validate size
  const validSizes = ["sm", "md", "lg"];
  if (size && !validSizes.includes(size)) {
    result.warnings.push(
      `Invalid size '${size}'. Valid options: ${validSizes.join(", ")}`
    );
  }

  // Accessibility validation
  if (!ariaLabel && !tooltip) {
    result.warnings.push(
      "FloatingActionButton should have either 'aria-label' or 'tooltip' for accessibility"
    );
  }

  return result;
};

/**
 * Development-time logger for prop validation results
 */
export const logValidationResults = (
  componentName: string,
  results: PropValidationResult
): void => {
  // Only log in development mode
  if (process.env["NODE_ENV"] !== "development") return;

  const prefix = `[${componentName}]`;

  if (results.errors.length > 0) {
    console.error(`${prefix} Validation Errors:`, results.errors);
  }

  if (results.warnings.length > 0) {
    console.warn(`${prefix} Validation Warnings:`, results.warnings);
  }
};

/**
 * Creates safe fallback props when validation fails
 */
export const createFallbackProps = <T extends Record<string, unknown>>(
  props: T,
  fallbacks: Partial<T>
): T => {
  const result = { ...props };

  Object.entries(fallbacks).forEach(([key, fallbackValue]) => {
    if (result[key] === undefined || result[key] === null) {
      (result as Record<string, unknown>)[key] = fallbackValue;
    }
  });

  return result;
};

/**
 * Animation state management for performance optimization
 */
export interface AnimationState {
  isAnimating: boolean;
  animationPhase: "entering" | "entered" | "exiting" | "exited";
  shouldRender: boolean;
}

export const useAnimationState = (
  isVisible: boolean,
  duration: number = 200
): AnimationState => {
  const [state, setState] = React.useState<AnimationState>({
    isAnimating: false,
    animationPhase: "exited",
    shouldRender: false,
  });

  React.useEffect(() => {
    if (isVisible && state.animationPhase === "exited") {
      setState({
        isAnimating: true,
        animationPhase: "entering",
        shouldRender: true,
      });

      const timer = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          isAnimating: false,
          animationPhase: "entered",
        }));
      }, duration);

      return () => clearTimeout(timer);
    } else if (!isVisible && state.animationPhase === "entered") {
      setState({
        isAnimating: true,
        animationPhase: "exiting",
        shouldRender: true,
      });

      const timer = setTimeout(() => {
        setState({
          isAnimating: false,
          animationPhase: "exited",
          shouldRender: false,
        });
      }, duration);

      return () => clearTimeout(timer);
    }

    // Return undefined for the else case to satisfy TypeScript
    return undefined;
  }, [isVisible, duration, state.animationPhase]);

  return state;
};
