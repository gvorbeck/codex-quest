import { useEffect, useState, useCallback, useMemo } from "react";
import { Stepper } from "@/components/ui";
import {
  AbilityScoreStep,
  RaceStep,
  ClassStep,
  HitPointsStep,
} from "@/components/features";
import { useCascadeValidation, useLocalStorage, useValidation } from "@/hooks";
import type { Character } from "@/types/character";
import {
  hasValidAbilityScores,
  hasValidHitPoints,
  hasRequiredStartingSpells,
} from "@/utils/characterValidation";
import { STORAGE_KEYS } from "@/constants/storage";
import {
  raceSelectionSchema,
  classSelectionSchema,
} from "@/utils/validationSchemas";
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
  hp: {
    current: 0,
    max: 0,
  },
};

function CharGen() {
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

  // Enhanced validation for individual fields
  const raceValidation = useValidation(character.race, raceSelectionSchema);
  const classValidation = useValidation(character.class, classSelectionSchema);

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

  // Enhanced validation functions with detailed feedback
  const isNextDisabled = useCallback(() => {
    switch (step) {
      case 0: // Abilities step
        return !hasValidAbilityScores(character);
      case 1: // Race step
        return !raceValidation.isValid;
      case 2: // Class step
        return (
          !classValidation.isValid ||
          !hasRequiredStartingSpells(character, allClasses)
        );
      case 3: // Hit Points step
        return !hasValidHitPoints(character);
      default:
        return false;
    }
  }, [step, character, raceValidation.isValid, classValidation.isValid]);

  const getValidationMessage = useCallback(() => {
    switch (step) {
      case 0: // Abilities step
        return !hasValidAbilityScores(character)
          ? "Please roll or set all ability scores before proceeding."
          : "";
      case 1: // Race step
        return raceValidation.errors.length > 0 ? raceValidation.errors[0] : "";
      case 2: // Class step
        if (classValidation.errors.length > 0) {
          return classValidation.errors[0];
        }
        if (!hasRequiredStartingSpells(character, allClasses)) {
          // Check if it's specifically a Magic-User that needs spells
          const isMagicUser = character.class.includes("magic-user");
          if (isMagicUser) {
            return "Magic-Users must select one first level spell (Read Magic is automatically known).";
          }
          return "Please select required starting spells for your class.";
        }
        return "";
      case 3: // Hit Points step
        return !hasValidHitPoints(character)
          ? "Please roll or set your hit points before proceeding."
          : "";
      default:
        return "";
    }
  }, [step, character, raceValidation.errors, classValidation.errors]);

  const stepItems = [
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
      content: <div>Choose your equipment</div>,
    },
    {
      title: "Review",
      content: <div>Review your character</div>,
    },
  ];

  // Keep the character logging for development
  useEffect(() => {
    console.log("Character saved to localStorage:", character);
  }, [character]);

  return (
    <article>
      <header>
        <h2>Character Creation</h2>
        <p>
          Follow the steps below to create your BFRPG character. Your progress
          is automatically saved.
        </p>
      </header>

      <section aria-label="Character creation wizard">
        <Stepper
          stepItems={stepItems}
          step={step}
          setStep={setStep}
          nextDisabled={isNextDisabled()}
          validationMessage={getValidationMessage() || ""}
        />
      </section>
    </article>
  );
}

export default CharGen;
