import { useEffect, useState, useCallback, useMemo } from "react";
import Stepper from "@/components/ui/display/Stepper";
import { Breadcrumb } from "@/components/ui/display";
import { PageWrapper } from "@/components/ui/layout";
import { Typography } from "@/components/ui/design-system";
import {
  AbilityScoreStep,
  RaceStep,
  HitPointsStep,
  EquipmentStep,
  ClassStep,
  ReviewStep,
} from "@/components/character/creation";
import { useLocalStorage, useAuth } from "@/hooks";
import { useCharacterNavigation } from "@/hooks/useEntityNavigation";
import type { Character } from "@/types/character";
import { useCascadeValidation, createCharacterValidationPipeline } from "@/validation";
import { saveCharacter } from "@/services/characters";
import { STORAGE_KEYS } from "@/constants/storage";
import { allRaces } from "@/data/races";
import { allClasses } from "@/data/classes";
import { logger } from "@/utils/logger";

const emptyCharacter: Character = {
  name: "",
  abilities: {
    strength: {
      value: 0,
      modifier: 0,
    },
    dexterity: {
      value: 0,
      modifier: 0,
    },
    constitution: {
      value: 0,
      modifier: 0,
    },
    intelligence: {
      value: 0,
      modifier: 0,
    },
    wisdom: {
      value: 0,
      modifier: 0,
    },
    charisma: {
      value: 0,
      modifier: 0,
    },
  },
  race: "",
  class: [],
  equipment: [],
  currency: {
    gold: 0,
  },
  hp: {
    current: 0,
    max: 0,
  },
  level: 1,
  xp: 0,
  settings: {
    version: 2, // Current version for migration
  },
};

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

  // Constants for step management
  const TOTAL_STEPS = 6; // Abilities, Race, Class, Hit Points, Equipment, Review
  const LAST_STEP_INDEX = TOTAL_STEPS - 1; // Review step is index 5 (0-based)

  // Handle completion of character creation
  const handleNext = useCallback(async () => {
    const isLastStep = step === LAST_STEP_INDEX;

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
  }, [step, user, character, navigateToEntity, LAST_STEP_INDEX]);

  // Memoize validation functions to prevent unnecessary re-computation
  const isNextDisabled = useMemo(() => {
    const isLastStep = step === LAST_STEP_INDEX;

    if (isLastStep) {
      // For the completion step, check if user is authenticated and character has a valid name
      const hasUser = !!user;
      const hasName = !!character.name?.trim();
      const disabled = !hasUser || !hasName;

      return disabled;
    }

    return validationPipeline.isStepDisabled(step, character);
  }, [validationPipeline, step, character, user, LAST_STEP_INDEX]);

  const getValidationMessage = useMemo(() => {
    const isLastStep = step === LAST_STEP_INDEX;

    if (isLastStep) {
      if (!user) {
        return "Please sign in to save your character";
      }
      if (!character.name?.trim()) {
        return "Please enter a character name to complete creation";
      }
      return null; // No validation message when ready to complete
    }

    return validationPipeline.validateStep(step, character).errors[0] || "";
  }, [validationPipeline, step, character, user, LAST_STEP_INDEX]);

  // Memoize individual step components to prevent unnecessary re-renders
  const abilityStep = useMemo(
    () => (
      <AbilityScoreStep
        character={character}
        onCharacterChange={setCharacter}
      />
    ),
    [character, setCharacter]
  );

  const raceStep = useMemo(
    () => (
      <RaceStep
        character={character}
        onCharacterChange={setCharacter}
        includeSupplemental={includeSupplementalRace}
        onIncludeSupplementalChange={setIncludeSupplementalRace}
      />
    ),
    [character, setCharacter, includeSupplementalRace, setIncludeSupplementalRace]
  );

  const classStep = useMemo(
    () => (
      <ClassStep
        character={character}
        onCharacterChange={setCharacter}
        includeSupplementalClass={includeSupplementalClass}
        onIncludeSupplementalClassChange={setIncludeSupplementalClass}
        useCombinationClass={useCombinationClass}
        onUseCombinationClassChange={setUseCombinationClass}
      />
    ),
    [
      character,
      setCharacter,
      includeSupplementalClass,
      setIncludeSupplementalClass,
      useCombinationClass,
      setUseCombinationClass,
    ]
  );

  const hitPointsStep = useMemo(
    () => (
      <HitPointsStep
        character={character}
        onCharacterChange={setCharacter}
      />
    ),
    [character, setCharacter]
  );

  const equipmentStep = useMemo(
    () => (
      <EquipmentStep
        character={character}
        onCharacterChange={setCharacter}
      />
    ),
    [character, setCharacter]
  );

  const reviewStep = useMemo(
    () => (
      <ReviewStep character={character} onCharacterChange={setCharacter} />
    ),
    [character, setCharacter]
  );

  const stepItems = useMemo(() => {
    return [
      {
        title: "Abilities",
        content: abilityStep,
      },
      {
        title: "Race",
        content: raceStep,
      },
      {
        title: "Class",
        content: classStep,
      },
      {
        title: "Hit Points",
        content: hitPointsStep,
      },
      {
        title: "Equipment",
        content: equipmentStep,
      },
      {
        title: "Review",
        content: reviewStep,
      },
    ];
  }, [abilityStep, raceStep, classStep, hitPointsStep, equipmentStep, reviewStep]);

  const breadcrumbItems = useMemo(
    () => [
      { label: "Home", href: "/" },
      { label: "Character Creation", current: true },
    ],
    []
  );

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
            validationMessage={getValidationMessage || ""}
          />
        </section>
      </article>
    </PageWrapper>
  );
}

export default CharGen;
