import { useEffect, useState } from "react";
import { Stepper } from "@/components/ui";
import { AbilityScoreStep, RaceStep, ClassStep } from "@/components/features";
import { hasValidAbilityScores } from "@/utils/characterValidation";
import type { Character } from "@/types/character";

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
  equipment: [],
};

function CharGen() {
  const [character, setCharacter] = useState(() => {
    // Lazy initializer to get initial state from localStorage
    const savedCharacter = localStorage.getItem("newCharacter");
    return savedCharacter ? JSON.parse(savedCharacter) : emptyCharacter;
  });
  const [step, setStep] = useState(0);
  const [includeSupplementalRace, setIncludeSupplementalRace] = useState(() => {
    // Lazy initializer to get initial state from localStorage
    const savedSupplemental = localStorage.getItem("includeSupplemental");
    return savedSupplemental ? JSON.parse(savedSupplemental) : false;
  });
  const [includeSupplementalClass, setIncludeSupplementalClass] = useState(
    () => {
      // Lazy initializer to get initial state from localStorage
      const savedSupplementalClass = localStorage.getItem(
        "includeSupplementalClass"
      );
      return savedSupplementalClass
        ? JSON.parse(savedSupplementalClass)
        : false;
    }
  );
  const [useCombinationClass, setUseCombinationClass] = useState(() => {
    // Lazy initializer to get initial state from localStorage
    const savedUseCombinationClass = localStorage.getItem(
      "useCombinationClass"
    );
    return savedUseCombinationClass
      ? JSON.parse(savedUseCombinationClass)
      : false;
  });

  // Determine if the Next button should be disabled based on current step and validation
  const isNextDisabled = () => {
    switch (step) {
      case 0: // Abilities step
        return !hasValidAbilityScores(character);
      case 1: // Race step
        return !character.race;
      case 2: // Class step
        return !character.class && !character.combinationClass;
      default:
        return false;
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

  useEffect(() => {
    // Save data to localStorage whenever 'character' changes
    localStorage.setItem("newCharacter", JSON.stringify(character));
    console.log("Character saved to localStorage:", character);
  }, [character]); // Dependency array ensures effect runs when 'character' changes

  useEffect(() => {
    // Save supplemental content setting to localStorage whenever it changes
    localStorage.setItem(
      "includeSupplemental",
      JSON.stringify(includeSupplementalRace)
    );
  }, [includeSupplementalRace]);

  useEffect(() => {
    // Save supplemental class content setting to localStorage whenever it changes
    localStorage.setItem(
      "includeSupplementalClass",
      JSON.stringify(includeSupplementalClass)
    );
  }, [includeSupplementalClass]);

  useEffect(() => {
    // Save combination class toggle setting to localStorage whenever it changes
    localStorage.setItem(
      "useCombinationClass",
      JSON.stringify(useCombinationClass)
    );
  }, [useCombinationClass]);

  return (
    <div>
      <h1>Character Generation</h1>
      <Stepper
        stepItems={stepItems}
        step={step}
        setStep={setStep}
        nextDisabled={isNextDisabled()}
      />
    </div>
  );
}

export default CharGen;
