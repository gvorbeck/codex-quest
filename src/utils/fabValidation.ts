import type { ReactNode } from "react";
import { logger } from "@/utils/logger";

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
  if (import.meta.env.MODE !== "development") return;

  const prefix = `[${componentName}]`;

  if (results.errors.length > 0) {
    logger.error(`${prefix} Validation Errors:`, results.errors);
  }

  if (results.warnings.length > 0) {
    logger.warn(`${prefix} Validation Warnings:`, results.warnings);
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
