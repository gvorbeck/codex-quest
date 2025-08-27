import type { ReactNode } from "react";
import { useStepAnnouncements } from "@/hooks/useA11y";
import { memo } from "react";
import { Typography } from "@/components/ui/design-system";
import { Button, Icon } from "@/components/ui";

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
    >
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
          <ol className="space-y-3" aria-label="Progress steps">
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

              const stepClasses = [...stepBaseStyles, ...stepVariantStyles]
                .filter(Boolean)
                .join(" ");

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

              const numberClasses = [
                ...numberBaseStyles,
                ...numberVariantStyles,
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <li key={index}>
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
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <span aria-hidden="true">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold">{item.title}</div>
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
                </li>
              );
            })}
          </ol>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        {/* Mobile Step Indicator */}
        <div className="lg:hidden mb-6">
          <div className="bg-zinc-800 rounded-lg p-4 border-2 border-zinc-600 shadow-[0_3px_0_0_#3f3f46]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-zinc-100">
                Step {safeCurrentStep + 1} of {stepItems.length}
              </h3>
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
          </div>
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
            aria-label={`Go to previous step: ${
              safeCurrentStep > 0
                ? stepItems[safeCurrentStep - 1]?.title || "Previous step"
                : ""
            }`}
          >
            <Icon
              name="chevron-left"
              size="md"
              className="mr-2 flex-shrink-0"
              aria-hidden={true}
            />
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
            aria-label={`Go to next step: ${
              safeCurrentStep < stepItems.length - 1
                ? stepItems[safeCurrentStep + 1]?.title || "Next step"
                : "Complete"
            }`}
          >
            {safeCurrentStep === stepItems.length - 1 ? "Complete" : "Next"}
            {safeCurrentStep < stepItems.length - 1 && (
              <Icon
                name="chevron-right"
                size="md"
                className="ml-2 flex-shrink-0"
                aria-hidden={true}
              />
            )}
          </Button>
        </nav>

        {/* Step Content */}
        <section
          aria-labelledby="step-content-heading"
          role="tabpanel"
          aria-live="polite"
          className="mb-8"
        >
          <h2
            id="step-content-heading"
            className="text-2xl font-bold text-zinc-100 mb-4"
          >
            {currentStepItem?.title || "Step"}
          </h2>
          <div>{currentStepItem?.content}</div>
        </section>

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
      </main>
    </div>
  );
}

export default memo(Stepper);
