import { useRef, useCallback, useEffect } from "react";

interface FocusManagementOptions {
  /** Whether to trap focus within the element when active */
  trapFocus?: boolean;
  /** Whether to restore focus to the trigger when closed */
  restoreFocus?: boolean;
  /** Whether focus management is currently active */
  isActive?: boolean;
}

/**
 * Custom hook for managing focus in interactive components like FAB groups
 * Provides focus trapping and restoration capabilities for accessibility
 */
export const useFocusManagement = ({
  trapFocus = true,
  restoreFocus = true,
  isActive = false,
}: FocusManagementOptions = {}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const focusableElementsRef = useRef<HTMLElement[]>([]);

  // Store the trigger element when focus management becomes active
  const storeTriggerElement = useCallback(() => {
    if (isActive && document.activeElement instanceof HTMLElement) {
      triggerRef.current = document.activeElement;
    }
  }, [isActive]);

  // Get all focusable elements within the container
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];

    const focusableSelectors = [
      "button:not([disabled])",
      "a[href]",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ].join(", ");

    const elements = Array.from(
      containerRef.current.querySelectorAll(focusableSelectors)
    ) as HTMLElement[];

    return elements.filter(
      (element) =>
        !element.hasAttribute("disabled") &&
        element.tabIndex !== -1 &&
        element.offsetWidth > 0 &&
        element.offsetHeight > 0
    );
  }, []);

  // Handle Tab key navigation within the focus trap
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!trapFocus || !isActive) return;

      if (event.key === "Tab") {
        const focusableElements = getFocusableElements();
        focusableElementsRef.current = focusableElements;

        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const currentElement = document.activeElement as HTMLElement;

        if (event.shiftKey) {
          // Shift + Tab: move to previous element
          if (currentElement === firstElement && lastElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: move to next element
          if (currentElement === lastElement && firstElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [trapFocus, isActive, getFocusableElements]
  );

  // Focus the first focusable element when activated
  const focusFirstElement = useCallback(() => {
    if (!isActive) return;

    const focusableElements = getFocusableElements();
    const firstElement = focusableElements[0];
    if (firstElement) {
      firstElement.focus();
    }
  }, [isActive, getFocusableElements]);

  // Restore focus to the trigger element when deactivated
  const restoreFocusToTrigger = useCallback(() => {
    if (restoreFocus && triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [restoreFocus]);

  // Set up event listeners and focus management
  useEffect(() => {
    if (isActive) {
      storeTriggerElement();

      // Small delay to ensure DOM updates are complete
      const timer = setTimeout(() => {
        focusFirstElement();
      }, 50);

      if (trapFocus) {
        document.addEventListener("keydown", handleKeyDown);
      }

      return () => {
        clearTimeout(timer);
        if (trapFocus) {
          document.removeEventListener("keydown", handleKeyDown);
        }
      };
    } else {
      // Component is being deactivated
      restoreFocusToTrigger();
    }

    // Return undefined for the else case to satisfy TypeScript
    return undefined;
  }, [
    isActive,
    storeTriggerElement,
    focusFirstElement,
    restoreFocusToTrigger,
    trapFocus,
    handleKeyDown,
  ]);

  // Provide a getter function instead of directly accessing ref during render
  const getCachedFocusableElements = useCallback(() => {
    return focusableElementsRef.current;
  }, []);

  return {
    containerRef,
    getFocusableElements: getCachedFocusableElements,
    focusFirstElement,
    restoreFocusToTrigger,
  };
};
