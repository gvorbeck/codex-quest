import { useEffect, useState, useCallback, useMemo } from "react";
import { Stepper } from "@/components/ui";
import {
  AbilityScoreStep,
  RaceStep,
  ClassStep,
  HitPointsStep,
  EquipmentStep,
  ReviewStep,
} from "@/components/features";
import { useCascadeValidation, useLocalStorage } from "@/hooks";
import type { Character } from "@/types/character";
import { CharacterValidationService } from "@/services/characterValidation";
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
  gold: 0,
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

  // Enhanced validation functions with detailed feedback
  const isNextDisabled = useCallback(() => {
    return validationService.isStepDisabled(step, character);
  }, [validationService, step, character]);

  const getValidationMessage = useCallback(() => {
    return validationService.getStepValidationMessage(step, character);
  }, [validationService, step, character]);

  const stepItems = useMemo(() => [
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
