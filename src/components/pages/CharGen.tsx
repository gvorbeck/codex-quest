import { useEffect, useState } from "react";
import { Stepper } from "@/components/ui";
import { AbilityScoreStep, RaceStep, ClassStep } from "@/components/features";
import { useCascadeValidation, useLocalStorage } from "@/hooks";
import type { Character } from "@/types/character";
import { hasValidAbilityScores } from "@/utils/characterValidation";
import { STORAGE_KEYS } from "@/constants/storage";

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
};

function CharGen() {
  // Use custom localStorage hooks for persistent state management
  const [character, setCharacter] = useLocalStorage<Character>(
    STORAGE_KEYS.NEW_CHARACTER,
    emptyCharacter
  );

  const [step, setStep] = useState(0);

  const [includeSupplementalRace, setIncludeSupplementalRace] =
    useLocalStorage<boolean>(STORAGE_KEYS.INCLUDE_SUPPLEMENTAL_RACE, false);

  const [includeSupplementalClass, setIncludeSupplementalClass] =
    useLocalStorage<boolean>(STORAGE_KEYS.INCLUDE_SUPPLEMENTAL_CLASS, false);

  const [useCombinationClass, setUseCombinationClass] =
    useLocalStorage<boolean>(STORAGE_KEYS.USE_COMBINATION_CLASS, false);

  // Initialize cascade validation hook
  useCascadeValidation({
    character,
    onCharacterChange: setCharacter,
    includeSupplementalRace,
    includeSupplementalClass,
  });

  // Determine if the Next button should be disabled based on current step and validation
  const isNextDisabled = () => {
    switch (step) {
      case 0: // Abilities step
        return !hasValidAbilityScores(character);
      case 1: // Race step
        return !character.race;
      case 2: // Class step
        return character.class.length === 0;
      default:
        return false;
    }
  };

  // Get validation message for current step
  const getValidationMessage = () => {
    switch (step) {
      case 0: // Abilities step
        return !hasValidAbilityScores(character)
          ? "Please roll or set all ability scores before proceeding."
          : "";
      case 1: // Race step
        return !character.race
          ? "Please select a race for your character."
          : "";
      case 2: // Class step
        return character.class.length === 0
          ? "Please select a class for your character."
          : "";
      default:
        return "";
    }
  };

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
          validationMessage={getValidationMessage()}
        />
      </section>
    </article>
  );
}

export default CharGen;
