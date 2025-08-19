import type { ReactNode } from "react";

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
}

function Stepper({
  step = 0,
  setStep = () => {},
  stepItems,
  nextDisabled = false,
  prevDisabled = false,
  onNext,
  onPrevious,
}: StepperProps) {
  // Ensure currentStep is within bounds
  const safeCurrentStep = Math.max(0, Math.min(step, stepItems.length - 1));
  const currentStepItem = stepItems[safeCurrentStep];

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
    <div>
      <div>
        <h2>{currentStepItem.title}</h2>
        <div>{currentStepItem.content}</div>
      </div>

      <div>
        <button
          onClick={() => handleStepChange("previous")}
          disabled={prevDisabled || safeCurrentStep === 0}
        >
          Previous
        </button>

        <button
          onClick={() => handleStepChange("next")}
          disabled={nextDisabled || safeCurrentStep === stepItems.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Stepper;
