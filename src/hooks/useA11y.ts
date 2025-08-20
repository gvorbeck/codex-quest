import { useEffect, useRef } from "react";

/**
 * Hook for managing step navigation announcements
 */
export function useStepAnnouncements(
  currentStep: number,
  steps: { title: string }[]
) {
  const announcementRef = useRef<HTMLDivElement | null>(null);

  /**
   * Announce a message to screen readers
   */
  const announce = (
    message: string,
    priority: "polite" | "assertive" = "polite"
  ) => {
    if (!announcementRef.current) {
      // Create announcement element if it doesn't exist
      const element = document.createElement("div");
      element.setAttribute("aria-live", priority);
      element.setAttribute("aria-atomic", "true");
      element.className = "sr-only";
      element.id = "a11y-announcer";
      document.body.appendChild(element);
      announcementRef.current = element;
    }

    // Update the aria-live region
    announcementRef.current.setAttribute("aria-live", priority);
    announcementRef.current.textContent = message;

    // Clear the message after announcement
    setTimeout(() => {
      if (announcementRef.current) {
        announcementRef.current.textContent = "";
      }
    }, 1000);
  };

  /**
   * Cleanup announcement element on unmount
   */
  useEffect(() => {
    return () => {
      if (
        announcementRef.current &&
        document.body.contains(announcementRef.current)
      ) {
        document.body.removeChild(announcementRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (steps.length > 0 && currentStep >= 0 && currentStep < steps.length) {
      const currentStepTitle = steps[currentStep]?.title || "Unknown step";
      const stepInfo = `Step ${currentStep + 1} of ${
        steps.length
      }: ${currentStepTitle}`;
      announce(stepInfo, "polite");
    }
  }, [currentStep, steps]);

  return { announce };
}
