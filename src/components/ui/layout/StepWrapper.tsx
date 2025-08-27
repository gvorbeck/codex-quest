import type { ReactNode } from "react";
import { memo } from "react";
import { Typography } from "@/components/ui/design-system";

interface StepWrapperProps {
  /** The main title of the step */
  title: string;
  /** Description text explaining what this step does */
  description: string;
  /** The main content of the step */
  children: ReactNode;
  /** Optional validation message to display */
  validationMessage?: string;
  /** Optional status message for screen readers */
  statusMessage?: string;
  /** Additional props for the section element */
  sectionProps?: React.HTMLAttributes<HTMLElement>;
}

/**
 * Wrapper component for character creation steps that provides consistent
 * structure, accessibility features, and styling
 */
function StepWrapperComponent({
  title,
  description,
  children,
  validationMessage,
  statusMessage,
  sectionProps,
}: StepWrapperProps) {
  return (
    <section {...sectionProps}>
      <header>
        <Typography variant="h4">{title}</Typography>
        <p>{description}</p>
      </header>

      {children}

      {/* Validation feedback */}
      {validationMessage && (
        <div role="alert" aria-live="polite">
          {validationMessage}
        </div>
      )}

      {/* Status announcements for screen readers */}
      {statusMessage && (
        <div
          role="status"
          aria-live="polite"
          aria-label="Step completion status"
        >
          <p>{statusMessage}</p>
        </div>
      )}
    </section>
  );
}

export default memo(StepWrapperComponent);
