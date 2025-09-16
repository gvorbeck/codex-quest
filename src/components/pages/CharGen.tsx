import { useEffect, useState, useCallback, useMemo } from "react";
import Stepper from "@/components/ui/display/Stepper";
import { Breadcrumb } from "@/components/ui/display";
import { PageWrapper } from "@/components/ui/layout";
import { Typography } from "@/components/ui/design-system";
import AbilityScoreStep from "@/components/character/creation/AbilityScoreStep";
import RaceStep from "@/components/character/creation/RaceStep";
import { ClassStep } from "@/components/character/creation/ClassStep";
import HitPointsStep from "@/components/character/creation/HitPointsStep";
import EquipmentStep from "@/components/character/creation/EquipmentStep";
import { ReviewStep } from "@/components/character/creation/ReviewStep";
import { useLocalStorage, useAuth } from "@/hooks";
import { useCharacterNavigation } from "@/hooks/useEntityNavigation";
import { useStepNavigation } from "@/hooks/useStepNavigation";
import type { Character } from "@/types/character";
import {
  useCascadeValidation,
  createCharacterValidationPipeline,
} from "@/validation";
import { saveCharacter } from "@/services/characters";
import { STORAGE_KEYS } from "@/constants/storage";
import { allRaces } from "@/data/races";
import { allClasses } from "@/data/classes";
import { logger } from "@/utils/logger";
import { createEmptyCharacter } from "@/utils/characterHelpers";

const emptyCharacter: Character = createEmptyCharacter();

function CharGen() {
  const { user } = useAuth();
  const { navigateToEntity } = useCharacterNavigation();

  // Use custom localStorage hooks for persistent state management
  const [storedCharacter, setStoredCharacter] = useLocalStorage<Character>(
    STORAGE_KEYS.NEW_CHARACTER,
    emptyCharacter
  );

  // Ensure the character always has the complete structure by merging with emptyCharacter
  const character = useMemo(
    () => ({
      ...emptyCharacter,
      ...storedCharacter,
      hp: storedCharacter.hp || emptyCharacter.hp,
    }),
    [storedCharacter]
  );

  const setCharacter = useCallback(
    (newCharacter: Character) => {
      setStoredCharacter(newCharacter);
    },
    [setStoredCharacter]
  );

  const [step, setStep] = useState(0);

  const [includeSupplementalRace, setIncludeSupplementalRace] =
    useLocalStorage<boolean>(STORAGE_KEYS.INCLUDE_SUPPLEMENTAL_RACE, false);

  const [includeSupplementalClass, setIncludeSupplementalClass] =
    useLocalStorage<boolean>(STORAGE_KEYS.INCLUDE_SUPPLEMENTAL_CLASS, false);

  const [useCombinationClass, setUseCombinationClass] =
    useLocalStorage<boolean>(STORAGE_KEYS.USE_COMBINATION_CLASS, false);

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
    character,
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
        setUseCombinationClass(false);
      }
    }
  }, [character.race, useCombinationClass, setUseCombinationClass]);

  // Use step navigation hook for centralized step management
  const {
    isLastStep,
    isNextDisabled,
    validationMessage,
  } = useStepNavigation({
    step,
    character,
    user,
    validationPipeline,
  });

  // Handle completion of character creation
  const handleNext = useCallback(async () => {
    if (isLastStep) {
      // This is the completion step
      if (!user) {
        logger.error("User not authenticated");
        return;
      }

      if (!character.name?.trim()) {
        logger.error("Character name is required");
        return;
      }

      try {
        const characterId = await saveCharacter(user.uid, character);

        // Clean up localStorage when character is successfully saved
        localStorage.removeItem(STORAGE_KEYS.CUSTOM_CLASS_MAGIC_TOGGLE);

        // Navigate to the newly created character sheet and clean up storage
        navigateToEntity(user.uid, characterId);
      } catch (error) {
        logger.error("Failed to save character:", error);
        // TODO: Show error toast/notification
      }
    } else {
      // Regular next step
      setStep(step + 1);
    }
  }, [step, user, character, navigateToEntity, isLastStep]);

  // Helper function to create step components
  const createStepComponents = useCallback(() => [
    {
      title: "Abilities",
      content: (
        <AbilityScoreStep
          character={character}
          onCharacterChange={setCharacter}
        />
      ),
    },
    {
      title: "Race",
      content: (
        <RaceStep
          character={character}
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
          character={character}
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
        <HitPointsStep character={character} onCharacterChange={setCharacter} />
      ),
    },
    {
      title: "Equipment",
      content: (
        <EquipmentStep character={character} onCharacterChange={setCharacter} />
      ),
    },
    {
      title: "Review",
      content: (
        <ReviewStep character={character} onCharacterChange={setCharacter} />
      ),
    },
  ], [
    character,
    setCharacter,
    includeSupplementalRace,
    setIncludeSupplementalRace,
    includeSupplementalClass,
    setIncludeSupplementalClass,
    useCombinationClass,
    setUseCombinationClass,
  ]);

  const stepItems = createStepComponents();

  const breadcrumbItems = useMemo(
    () => [
      { label: "Home", href: "/" },
      { label: "Character Creation", current: true },
    ],
    []
  );

  if (import.meta.env.DEV) {
    logger.info(JSON.stringify(character));
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
            nextDisabled={isNextDisabled}
            onNext={handleNext}
            validationMessage={validationMessage || ""}
          />
        </section>
      </article>
    </PageWrapper>
  );
}

export default CharGen;
