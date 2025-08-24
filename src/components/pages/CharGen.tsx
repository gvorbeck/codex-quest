import { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation } from "wouter";
import { Stepper, Breadcrumb } from "@/components/ui/display";
import { PageWrapper } from "@/components/ui/layout";
import {
  AbilityScoreStep,
  RaceStep,
  HitPointsStep,
  EquipmentStep,
  ClassStep,
  ReviewStep,
} from "@/components/character/creation";
import { useCascadeValidation, useLocalStorage, useAuth } from "@/hooks";
import type { Character } from "@/types/character";
import { CharacterValidationService } from "@/services/characterValidation";
import { saveCharacter } from "@/services/characters";
import { STORAGE_KEYS } from "@/constants/storage";
import { allRaces } from "@/data/races";
import { allClasses } from "@/data/classes";

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
  const [, setLocation] = useLocation();
  const { user } = useAuth();

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

  // Create validation service instance
  const validationService = useMemo(() => {
    const filteredRaces = allRaces.filter(
      (race) => includeSupplementalRace || !race.supplementalContent
    );
    const filteredClasses = allClasses.filter(
      (cls) => includeSupplementalClass || !cls.supplementalContent
    );
    return new CharacterValidationService(filteredRaces, filteredClasses);
  }, [includeSupplementalRace, includeSupplementalClass]);

  // Initialize cascade validation hook
  useCascadeValidation({
    character,
    onCharacterChange: setCharacter,
    includeSupplementalRace,
    includeSupplementalClass,
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
        console.error("User not authenticated");
        return;
      }

      if (!character.name?.trim()) {
        console.error("Character name is required");
        return;
      }

      try {
        await saveCharacter(user.uid, character);

        // Clear localStorage
        localStorage.removeItem(STORAGE_KEYS.NEW_CHARACTER);

        // Navigate to home
        setLocation("/");
      } catch (error) {
        console.error("Failed to save character:", error);
        // TODO: Show error toast/notification
      }
    } else {
      // Regular next step
      setStep(step + 1);
    }
  }, [step, user, character, setLocation]);

  // Memoize validation functions to prevent unnecessary re-computation
  const isNextDisabled = useMemo(() => {
    const isLastStep = step === LAST_STEP_INDEX;

    if (isLastStep) {
      // For the completion step, check if user is authenticated and character has a valid name
      const hasUser = !!user;
      const hasName = !!character.name?.trim();
      const disabled = !hasUser || !hasName;

      console.log("Complete button validation:", {
        step,
        LAST_STEP_INDEX,
        isLastStep,
        hasUser,
        hasName,
        characterName: character.name,
        disabled,
      });

      return disabled;
    }

    return validationService.isStepDisabled(step, character);
  }, [validationService, step, character, user]);

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

    return validationService.getStepValidationMessage(step, character);
  }, [validationService, step, character, user]);

  const stepItems = useMemo(() => {
    const items = [
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
          <HitPointsStep
            character={character}
            onCharacterChange={setCharacter}
          />
        ),
      },
      {
        title: "Equipment",
        content: (
          <EquipmentStep
            character={character}
            onCharacterChange={setCharacter}
          />
        ),
      },
      {
        title: "Review",
        content: (
          <ReviewStep character={character} onCharacterChange={setCharacter} />
        ),
      },
    ];

    console.log("Step items created:", {
      totalSteps: items.length,
      stepTitles: items.map((item) => item.title),
      currentStep: step,
    });

    return items;
  }, [
    character,
    setCharacter,
    includeSupplementalRace,
    setIncludeSupplementalRace,
    includeSupplementalClass,
    setIncludeSupplementalClass,
    useCombinationClass,
    setUseCombinationClass,
    step,
  ]);

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
          <h2>Character Creation</h2>
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
