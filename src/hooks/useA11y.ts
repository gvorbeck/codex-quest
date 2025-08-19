import { useEffect, useRef } from 'react';

/**
 * Hook for managing accessibility features like announcements and focus management
 */
export function useA11y() {
  const announcementRef = useRef<HTMLDivElement | null>(null);

  /**
   * Announce a message to screen readers
   */
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announcementRef.current) {
      // Create announcement element if it doesn't exist
      const element = document.createElement('div');
      element.setAttribute('aria-live', priority);
      element.setAttribute('aria-atomic', 'true');
      element.className = 'sr-only';
      element.id = 'a11y-announcer';
      document.body.appendChild(element);
      announcementRef.current = element;
    }

    // Update the aria-live region
    announcementRef.current.setAttribute('aria-live', priority);
    announcementRef.current.textContent = message;

    // Clear the message after announcement
    setTimeout(() => {
      if (announcementRef.current) {
        announcementRef.current.textContent = '';
      }
    }, 1000);
  };

  /**
   * Focus an element by ID with fallback to selector
   */
  const focusElement = (selector: string, delay = 100) => {
    setTimeout(() => {
      const element = document.querySelector(selector) as HTMLElement;
      if (element && typeof element.focus === 'function') {
        element.focus();
      }
    }, delay);
  };

  /**
   * Cleanup announcement element on unmount
   */
  useEffect(() => {
    return () => {
      if (announcementRef.current && document.body.contains(announcementRef.current)) {
        document.body.removeChild(announcementRef.current);
      }
    };
  }, []);

  return {
    announce,
    focusElement
  };
}

/**
 * Hook for managing step navigation announcements
 */
export function useStepAnnouncements(currentStep: number, steps: { title: string }[]) {
  const { announce } = useA11y();

  useEffect(() => {
    if (steps.length > 0 && currentStep >= 0 && currentStep < steps.length) {
      const stepInfo = `Step ${currentStep + 1} of ${steps.length}: ${steps[currentStep].title}`;
      announce(stepInfo, 'polite');
    }
  }, [currentStep, steps, announce]);

  return { announce };
}
