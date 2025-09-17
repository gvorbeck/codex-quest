import { useEffect, useCallback, useMemo } from "react";
import { useLocation } from "wouter";
import Stepper from "@/components/ui/composite/Stepper";
import { Breadcrumb } from "@/components/ui/composite";
import { PageWrapper } from "@/components/ui/core/layout";
import { Typography } from "@/components/ui/core/display";
import Callout from "@/components/ui/core/feedback/Callout";
import AbilityScoreStep from "@/components/features/character/creation/AbilityScoreStep";
import RaceStep from "@/components/features/character/creation/RaceStep";
import { ClassStep } from "@/components/features/character/creation/ClassStep";
import HitPointsStep from "@/components/features/character/creation/HitPointsStep";
import EquipmentStep from "@/components/features/character/creation/EquipmentStep";
import { ReviewStep } from "@/components/features/character/creation/ReviewStep";
import { useAuth, useCharacterMutations, useStepNavigation } from "@/hooks";
import { useCharacterStore } from "@/stores";
import {
  useCascadeValidation,
  createCharacterValidationPipeline,
} from "@/validation";
import { allRaces, allClasses } from "@/data";
import { logger, createEmptyCharacter } from "@/utils";

function CharGen() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Replace multiple useLocalStorage calls with Zustand store
  const {
    draftCharacter: character,
    currentStep: step,
    preferences: {
      includeSupplementalRace,
      includeSupplementalClass,
      useCombinationClass,
    },
    updateDraft: setCharacter,
    setStep,
    nextStep,
    updatePreferences,
  } = useCharacterStore();

  // Replace manual save logic with mutation
  const { saveCharacter, isSaving, saveError } = useCharacterMutations({
    onSaveSuccess: () => setLocation("/"),
  });

  // Ensure the character always has the complete structure by merging with empty character
  const emptyCharacter = createEmptyCharacter();
  const completeCharacter = useMemo(
    () => ({
      ...emptyCharacter,
      ...character,
      hp: character.hp || emptyCharacter.hp,
    }),
    [character, emptyCharacter]
  );

  // Create wrapper functions for preference updates to match old API
  const setIncludeSupplementalRace = useCallback(
    (value: boolean) => updatePreferences({ includeSupplementalRace: value }),
    [updatePreferences]
  );

  const setIncludeSupplementalClass = useCallback(
    (value: boolean) => updatePreferences({ includeSupplementalClass: value }),
    [updatePreferences]
  );

  const setUseCombinationClass = useCallback(
    (value: boolean) => updatePreferences({ useCombinationClass: value }),
    [updatePreferences]
  );

  // Memoize filtered data to prevent recreation of validation service
  const filteredRaces = useMemo(
    () =>
      allRaces.filter(
        (race) => includeSupplementalRace || !race.supplementalContent
      ),
    [includeSupplementalRace]
  );

  const filteredClasses = useMemo(
    () =>
      allClasses.filter(
        (cls) => includeSupplementalClass || !cls.supplementalContent
      ),
    [includeSupplementalClass]
  );

  // Create validation pipeline - now memoized properly
  const validationPipeline = useMemo(() => {
    return createCharacterValidationPipeline(filteredRaces, filteredClasses);
  }, [filteredRaces, filteredClasses]);

  // Initialize cascade validation hook with memoized data
  useCascadeValidation({
    character: completeCharacter,
    onCharacterChange: setCharacter,
    includeSupplementalRace,
    includeSupplementalClass,
    filteredRaces,
    filteredClasses,
  });

  // Reset combination class checkbox when race changes to one that doesn't support it
  useEffect(() => {
    if (useCombinationClass && character.race) {
      const selectedRace = allRaces.find((race) => race.id === character.race);
      const canUseCombinationClasses =
        selectedRace && ["elf", "dokkalfar"].includes(selectedRace.id);

      if (!canUseCombinationClasses) {
        updatePreferences({ useCombinationClass: false });
      }
    }
  }, [character.race, useCombinationClass, updatePreferences]);

  // Use step navigation hook for centralized step management
  const { isLastStep, isNextDisabled, validationMessage } = useStepNavigation({
    step,
    character: completeCharacter,
    user,
    validationPipeline,
  });

  // Handle completion of character creation
  const handleNext = useCallback(() => {
    if (isLastStep) {
      // This is the completion step
      if (!user) {
        logger.error("User not authenticated");
        return;
      }

      if (!completeCharacter.name?.trim()) {
        logger.error("Character name is required");
        return;
      }

      // Use TanStack Query mutation - handles optimistic updates and error handling
      // The mutation's onSuccess callback will clear the draft and navigate
      saveCharacter({
        userId: user.uid,
        character: completeCharacter,
      });
    } else {
      // Regular next step
      nextStep();
    }
  }, [user, completeCharacter, saveCharacter, nextStep, isLastStep]);

  // Helper function to create step components
  const createStepComponents = useCallback(
    () => [
      {
        title: "Abilities",
        content: (
          <AbilityScoreStep
            character={completeCharacter}
            onCharacterChange={setCharacter}
          />
        ),
      },
      {
        title: "Race",
        content: (
          <RaceStep
            character={completeCharacter}
            onCharacterChange={setCharacter}
            includeSupplemental={includeSupplementalRace}
            onIncludeSupplementalChange={setIncludeSupplementalRace}
          />
        ),
      },
      {
        title: "Class",
        content: (
          <ClassStep
            character={completeCharacter}
            onCharacterChange={setCharacter}
            includeSupplementalClass={includeSupplementalClass}
            onIncludeSupplementalClassChange={setIncludeSupplementalClass}
            useCombinationClass={useCombinationClass}
            onUseCombinationClassChange={setUseCombinationClass}
          />
        ),
      },
      {
        title: "Hit Points",
        content: (
          <HitPointsStep
            character={completeCharacter}
            onCharacterChange={setCharacter}
          />
        ),
      },
      {
        title: "Equipment",
        content: (
          <EquipmentStep
            character={completeCharacter}
            onCharacterChange={setCharacter}
          />
        ),
      },
      {
        title: "Review",
        content: (
          <ReviewStep
            character={completeCharacter}
            onCharacterChange={setCharacter}
          />
        ),
      },
    ],
    [
      completeCharacter,
      setCharacter,
      includeSupplementalRace,
      setIncludeSupplementalRace,
      includeSupplementalClass,
      setIncludeSupplementalClass,
      useCombinationClass,
      setUseCombinationClass,
    ]
  );

  const stepItems = createStepComponents();

  const breadcrumbItems = useMemo(
    () => [
      { label: "Home", href: "/" },
      { label: "Character Creation", current: true },
    ],
    []
  );

  if (import.meta.env.DEV) {
    logger.info(JSON.stringify(completeCharacter));
  }

  return (
    <PageWrapper>
      <article>
        <header className="mb-6">
          <Breadcrumb items={breadcrumbItems} className="mb-4" />
          <Typography variant="h2" as="h2">
            Character Creation
          </Typography>
        </header>

        <section aria-label="Character creation wizard">
          <Stepper
            stepItems={stepItems}
            step={step}
            setStep={setStep}
            nextDisabled={isNextDisabled || isSaving}
            onNext={handleNext}
            validationMessage={validationMessage || ""}
          />
        </section>

        {/* Show save error if it occurs */}
        {saveError && (
          <div className="mt-4">
            <Callout variant="error" title="Save Failed">
              {saveError.message ||
                "Failed to save character. Please try again."}
            </Callout>
          </div>
        )}
      </article>
    </PageWrapper>
  );
}

export default CharGen;
