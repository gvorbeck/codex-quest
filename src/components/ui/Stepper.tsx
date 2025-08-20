import type { ReactNode } from "react";
import { useStepAnnouncements } from "../../hooks/useA11y";
import { memo } from "react";
import Button from "./Button";

interface StepItem {
  title: string;
  content: string | ReactNode;
}

interface StepperProps {
  step?: number;
  setStep?: (step: number) => void;
  stepItems: StepItem[];
  nextDisabled?: boolean;
  prevDisabled?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  validationMessage?: string;
}

function Stepper({
  step = 0,
  setStep = () => {},
  stepItems,
  nextDisabled = false,
  prevDisabled = false,
  onNext,
  onPrevious,
  validationMessage,
}: StepperProps) {
  // Ensure currentStep is within bounds
  const safeCurrentStep = Math.max(0, Math.min(step, stepItems.length - 1));
  const currentStepItem = stepItems[safeCurrentStep];

  // Announce step changes to screen readers
  useStepAnnouncements(safeCurrentStep, stepItems);

  const handleStepChange = (direction: "next" | "previous") => {
    if (direction === "next") {
      if (onNext) {
        onNext();
      } else {
        setStep(safeCurrentStep + 1);
      }
    } else {
      if (onPrevious) {
        onPrevious();
      } else {
        setStep(safeCurrentStep - 1);
      }
    }
  };

  if (!stepItems || stepItems.length === 0) {
    return <div>No steps available</div>;
  }

  return (
    <div role="region" aria-labelledby="stepper-heading">
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Step {safeCurrentStep + 1} of {stepItems.length}:{" "}
        {currentStepItem?.title || "Unknown step"}
      </div>

      <nav role="navigation" aria-label="Step navigation">
        <ol aria-label="Progress steps">
          {stepItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => setStep(index)}
                disabled={index > safeCurrentStep}
                aria-current={index === safeCurrentStep ? "step" : undefined}
                aria-label={`Step ${index + 1}: ${item.title}`}
              >
                <span aria-hidden="true">{index + 1}</span>
                <span>{item.title}</span>
                {index < safeCurrentStep && (
                  <span aria-label="completed" role="img">
                    ✓
                  </span>
                )}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <section
        aria-labelledby="step-content-heading"
        role="tabpanel"
        aria-live="polite"
      >
        <h3 id="step-content-heading">{currentStepItem?.title || "Step"}</h3>
        <div>{currentStepItem?.content}</div>
      </section>

      <nav role="navigation" aria-label="Step controls">
        {validationMessage && (
          <div
            role="alert"
            aria-live="polite"
          >
            {validationMessage}
          </div>
        )}

        <Button
          onClick={() => handleStepChange("previous")}
          disabled={prevDisabled || safeCurrentStep === 0}
          aria-label={`Go to previous step: ${
            safeCurrentStep > 0
              ? stepItems[safeCurrentStep - 1]?.title || "Previous step"
              : ""
          }`}
        >
          Previous
        </Button>

        <Button
          onClick={() => handleStepChange("next")}
          disabled={nextDisabled || safeCurrentStep === stepItems.length - 1}
          aria-label={`Go to next step: ${
            safeCurrentStep < stepItems.length - 1
              ? stepItems[safeCurrentStep + 1]?.title || "Next step"
              : "Complete"
          }`}
        >
          {safeCurrentStep === stepItems.length - 1 ? "Complete" : "Next"}
        </Button>
      </nav>
    </div>
  );
}

export default memo(Stepper);
