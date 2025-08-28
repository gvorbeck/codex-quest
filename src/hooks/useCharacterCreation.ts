import { useContext } from "react";
import CharacterCreationContext from "@/contexts/CharacterCreationContext";

export function useCharacterCreation() {
  const context = useContext(CharacterCreationContext);
  if (!context) {
    throw new Error("useCharacterCreation must be used within a CharacterCreationProvider");
  }
  return context;
}

// Hook for step-specific operations
export function useCharacterCreationStep(stepNumber: number) {
  const context = useCharacterCreation();
  
  const isCurrentStep = context.currentStep === stepNumber;
  const isComplete = context.isStepComplete(stepNumber);
  
  return {
    ...context,
    isCurrentStep,
    isComplete,
    stepNumber,
  };
}
