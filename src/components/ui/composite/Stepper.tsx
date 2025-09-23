import type { ReactNode } from "react";
import { useStepAnnouncements } from "@/hooks";
import { useValidationAnnouncements } from "@/hooks";
import { memo, useEffect, useCallback } from "react";
import { Typography, Card } from "@/components/ui/core/display";
import { Button, Icon } from "@/components/ui";
import { TextHeader } from "./TextHeader";
import { cn } from "@/utils";
import List, { StepListItem } from "./List";

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

  // Announce validation errors to screen readers
  const { announceValidationErrors } = useValidationAnnouncements();

  // Announce validation messages when they change
  useEffect(() => {
    if (validationMessage) {
      announceValidationErrors(
        [validationMessage],
        `Step ${safeCurrentStep + 1}`
      );
    }
  }, [validationMessage, safeCurrentStep, announceValidationErrors]);

  const handleStepChange = useCallback(
    (direction: "next" | "previous") => {
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
    },
    [onNext, onPrevious, safeCurrentStep, setStep]
  );

  // Add keyboard navigation for step controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle keys when focus is within the stepper
      if (
        !event.target ||
        !(event.target as Element).closest('[role="region"]')
      ) {
        return;
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        if (safeCurrentStep > 0 && !prevDisabled) {
          handleStepChange("previous");
        }
      } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        if (safeCurrentStep < stepItems.length - 1 && !nextDisabled) {
          handleStepChange("next");
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    safeCurrentStep,
    stepItems.length,
    nextDisabled,
    prevDisabled,
    handleStepChange,
  ]);

  const handleStepClick = (index: number) => {
    if (index <= safeCurrentStep) {
      setStep(index);
    }
  };

  if (!stepItems || stepItems.length === 0) {
    return <div>No steps available</div>;
  }

  return (
    <div
      className="flex flex-col lg:flex-row gap-8"
      role="region"
      aria-labelledby="stepper-heading"
      aria-describedby="stepper-instructions"
    >
      {/* Hidden instructions for keyboard navigation */}
      <div id="stepper-instructions" className="sr-only">
        Use arrow keys to navigate between steps when focused within this area.
        Tab to navigate between interactive elements.
      </div>
      {/* Screen reader announcement */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Step {safeCurrentStep + 1} of {stepItems.length}:{" "}
        {currentStepItem?.title || "Unknown step"}
      </div>

      {/* Step Navigation - Hidden on mobile, visible on large screens */}
      <aside className="hidden lg:block lg:w-80 lg:flex-shrink-0">
        <nav
          role="navigation"
          aria-label="Step navigation"
          className="sticky top-8"
        >
          <Typography variant="sectionHeading">Steps</Typography>
          <List variant="steps" spacing="loose" aria-label="Progress steps">
            {stepItems.map((item, index) => {
              const isActive = index === safeCurrentStep;
              const isCompleted = index < safeCurrentStep;
              const isAccessible = index <= safeCurrentStep;

              // Step button styles with 3D effects
              const stepBaseStyles = [
                "w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-150",
                "text-left font-medium",
                "focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-900",
              ];

              const stepVariantStyles = isActive
                ? [
                    "bg-amber-400 text-zinc-900 border-amber-500",
                    "shadow-[0_4px_0_0_#b45309]", // amber-700 shadow
                  ]
                : isCompleted
                ? [
                    "bg-lime-500 text-zinc-900 border-lime-600",
                    "shadow-[0_3px_0_0_#65a30d]", // lime-700 shadow
                    "hover:bg-lime-400 hover:shadow-[0_4px_0_0_#65a30d]",
                    "cursor-pointer",
                  ]
                : [
                    "bg-zinc-700 text-zinc-300 border-zinc-600",
                    "shadow-[0_3px_0_0_#3f3f46]", // zinc-700 shadow
                    isAccessible
                      ? "hover:bg-zinc-600 hover:shadow-[0_4px_0_0_#3f3f46] cursor-pointer"
                      : "opacity-50 cursor-not-allowed",
                  ];

              const stepClasses = cn(...stepBaseStyles, ...stepVariantStyles);

              // Step number styles with 3D effects
              const numberBaseStyles = [
                "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-150",
                "font-bold text-sm flex-shrink-0",
              ];

              const numberVariantStyles = isActive
                ? ["bg-zinc-900 text-amber-400 border-zinc-900"]
                : isCompleted
                ? ["bg-zinc-900 text-lime-500 border-zinc-900"]
                : ["bg-zinc-600 text-zinc-300 border-zinc-600"];

              const numberClasses = cn(
                ...numberBaseStyles,
                ...numberVariantStyles
              );

              return (
                <StepListItem key={index}>
                  <button
                    onClick={() => handleStepClick(index)}
                    disabled={!isAccessible}
                    className={stepClasses}
                    aria-current={isActive ? "step" : undefined}
                    aria-label={`Step ${index + 1}: ${item.title}${
                      isCompleted ? " (completed)" : ""
                    }`}
                  >
                    <div className={numberClasses}>
                      {isCompleted ? (
                        <Icon name="check" size="md" aria-hidden={true} />
                      ) : (
                        <span aria-hidden="true">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <TextHeader variant="h6" size="sm" underlined={false}>
                        {item.title}
                      </TextHeader>
                      {isActive && (
                        <div className="text-sm opacity-75 mt-1">
                          Current step
                        </div>
                      )}
                      {isCompleted && (
                        <div className="text-sm opacity-75 mt-1">Completed</div>
                      )}
                    </div>
                  </button>
                </StepListItem>
              );
            })}
          </List>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        {/* Mobile Step Indicator */}
        <div className="lg:hidden mb-6">
          <Card variant="standard">
            <div className="flex items-center justify-between mb-3">
              <Typography
                variant="sectionHeading"
                color="zinc"
                as="h3"
                className="mb-0"
              >
                Step {safeCurrentStep + 1} of {stepItems.length}
              </Typography>
              <div className="text-sm text-zinc-400">
                {Math.round(((safeCurrentStep + 1) / stepItems.length) * 100)}%
              </div>
            </div>
            <div className="w-full bg-zinc-700 rounded-full h-2 shadow-inner">
              <div
                className="bg-amber-400 h-2 rounded-full transition-all duration-300 shadow-[0_1px_0_0_#b45309]"
                style={{
                  width: `${((safeCurrentStep + 1) / stepItems.length) * 100}%`,
                }}
              />
            </div>
          </Card>
        </div>

        {/* Step Controls */}
        <nav
          role="navigation"
          aria-label="Step controls"
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <Button
            onClick={() => handleStepChange("previous")}
            disabled={prevDisabled || safeCurrentStep === 0}
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto whitespace-nowrap"
            icon="chevron-left"
            iconSize="md"
            iconClassName="mr-2 flex-shrink-0"
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
            disabled={
              nextDisabled ||
              (safeCurrentStep === stepItems.length - 1 && !onNext)
            }
            variant="primary"
            size="lg"
            className="w-full sm:w-auto sm:ml-auto whitespace-nowrap"
            {...(safeCurrentStep < stepItems.length - 1 && {
              icon: "chevron-right",
              iconSize: "md",
              iconClassName: "ml-2 flex-shrink-0"
            })}
            aria-label={`Go to next step: ${
              safeCurrentStep < stepItems.length - 1
                ? stepItems[safeCurrentStep + 1]?.title || "Next step"
                : "Complete"
            }`}
          >
            {safeCurrentStep === stepItems.length - 1 ? "Complete" : "Next"}
          </Button>
        </nav>

        {/* Validation Message */}
        {validationMessage && (
          <div className="mb-6">
            <div
              role="alert"
              aria-live="polite"
              className="bg-red-950/20 border-2 border-red-600 text-red-100 p-4 rounded-lg shadow-[0_3px_0_0_#b91c1c]"
            >
              <div className="flex items-start gap-3">
                <Icon
                  name="exclamation-triangle"
                  size="md"
                  className="flex-shrink-0 mt-0.5"
                  aria-hidden={true}
                />
                <div>{validationMessage}</div>
              </div>
            </div>
          </div>
        )}

        {/* Step Content */}
        <section
          aria-labelledby="step-content-heading"
          role="tabpanel"
          aria-live="polite"
          className="mb-8"
        >
          <Typography
            variant="h2"
            as="h2"
            id="step-content-heading"
            weight="bold"
            color="zinc"
            className="mb-4"
          >
            {currentStepItem?.title || "Step"}
          </Typography>
          <div>{currentStepItem?.content}</div>
        </section>
      </main>
    </div>
  );
}

export default memo(Stepper);
