import { useMemo } from "react";
import type { Character } from "@/types";
import type { AuthUser } from "@/services/auth";
import type { CharacterValidationPipeline } from "@/validation/types";

interface UseStepNavigationProps {
  step: number;
  character: Character;
  user: AuthUser | null;
  validationPipeline: CharacterValidationPipeline;
}

export function useStepNavigation({
  step,
  character,
  user,
  validationPipeline,
}: UseStepNavigationProps) {
  const TOTAL_STEPS = 6; // Abilities, Race, Class, Hit Points, Equipment, Review
  const LAST_STEP_INDEX = TOTAL_STEPS - 1; // Review step is index 5 (0-based)

  const isLastStep = step === LAST_STEP_INDEX;

  const isNextDisabled = useMemo(() => {
    if (isLastStep) {
      // For the completion step, check if user is authenticated and character has a valid name
      const hasUser = !!user;
      const hasName = !!character.name?.trim();
      return !hasUser || !hasName;
    }

    return validationPipeline.isStepDisabled(step, character);
  }, [validationPipeline, step, character, user, isLastStep]);

  const validationMessage = useMemo(() => {
    if (isLastStep) {
      if (!user) {
        return "Please sign in to save your character";
      }
      if (!character.name?.trim()) {
        return "Please enter a character name to complete creation";
      }
      return null; // No validation message when ready to complete
    }

    const errors = validationPipeline.validateStep(step, character).errors;
    return errors.length > 0 ? errors[0] : "";
  }, [validationPipeline, step, character, user, isLastStep]);

  return {
    TOTAL_STEPS,
    LAST_STEP_INDEX,
    isLastStep,
    isNextDisabled,
    validationMessage,
  };
}
