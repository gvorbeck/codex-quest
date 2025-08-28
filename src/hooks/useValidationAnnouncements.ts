import { useEffect, useRef } from "react";
import { useA11yAnnouncements } from "./useA11y";

/**
 * Hook for announcing validation errors to screen readers
 * Helps users understand what needs to be corrected
 */
export function useValidationAnnouncements() {
  const { announce } = useA11yAnnouncements();
  const previousErrorsRef = useRef<string[]>([]);

  const announceValidationErrors = (errors: string[], context = "") => {
    if (errors.length === 0) {
      // Clear previous errors if all are resolved
      if (previousErrorsRef.current.length > 0) {
        announce(
          context ? `${context} errors resolved` : "Validation errors resolved",
          "polite"
        );
      }
      previousErrorsRef.current = [];
      return;
    }

    // Only announce new or changed errors to avoid spam
    const hasNewErrors = errors.some(
      (error) => !previousErrorsRef.current.includes(error)
    );
    const hasFewerErrors = previousErrorsRef.current.length > errors.length;

    if (hasNewErrors || hasFewerErrors) {
      const errorCount = errors.length;
      const contextPrefix = context ? `${context}: ` : "";

      if (errorCount === 1) {
        announce(`${contextPrefix}${errors[0]}`, "assertive");
      } else {
        announce(
          `${contextPrefix}${errorCount} validation errors. First error: ${errors[0]}`,
          "assertive"
        );
      }

      previousErrorsRef.current = [...errors];
    }
  };

  const announceValidationWarnings = (warnings: string[], context = "") => {
    if (warnings.length === 0) return;

    const contextPrefix = context ? `${context}: ` : "";
    if (warnings.length === 1) {
      announce(`${contextPrefix}Warning: ${warnings[0]}`, "polite");
    } else {
      announce(
        `${contextPrefix}${warnings.length} warnings. ${warnings[0]}`,
        "polite"
      );
    }
  };

  /**
   * Announce step completion status
   */
  const announceStepStatus = (
    stepName: string,
    isComplete: boolean,
    errors?: string[]
  ) => {
    if (isComplete) {
      announce(`${stepName} completed successfully`, "polite");
    } else if (errors && errors.length > 0) {
      const errorCount = errors.length;
      const message =
        errorCount === 1
          ? `${stepName} has 1 error that must be resolved`
          : `${stepName} has ${errorCount} errors that must be resolved`;
      announce(message, "assertive");
    }
  };

  /**
   * Announce progress through character creation
   */
  const announceProgress = (completedSteps: number, totalSteps: number) => {
    const percentage = Math.round((completedSteps / totalSteps) * 100);
    announce(
      `Character creation ${percentage}% complete. ${completedSteps} of ${totalSteps} steps finished.`,
      "polite"
    );
  };

  /**
   * Announce character creation completion
   */
  const announceCharacterComplete = (characterName?: string) => {
    const message = characterName
      ? `Character ${characterName} created successfully!`
      : "Character created successfully!";
    announce(message, "polite");
  };

  // Clear announcements on unmount
  useEffect(() => {
    return () => {
      previousErrorsRef.current = [];
    };
  }, []);

  return {
    announceValidationErrors,
    announceValidationWarnings,
    announceStepStatus,
    announceProgress,
    announceCharacterComplete,
  };
}
