import { useEffect, useState } from "react";
import { Stepper } from "../ui";
import { AbilityScoreStep } from "../features";
import type { Character } from "../../types/character";

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
  equipment: [],
};

function CharGen() {
  const [character, setCharacter] = useState(() => {
    // Lazy initializer to get initial state from localStorage
    const savedCharacter = localStorage.getItem("newCharacter");
    return savedCharacter ? JSON.parse(savedCharacter) : emptyCharacter;
  });
  const [step, setStep] = useState(0);

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
      content: <div>Choose your race</div>,
    },
    {
      title: "Class",
      content: <div>Choose your class</div>,
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
    localStorage.setItem("myCharacter", JSON.stringify(character));
  }, [character]); // Dependency array ensures effect runs when 'character' changes

  return (
    <div>
      <h1>Character Generation</h1>
      <Stepper stepItems={stepItems} step={step} setStep={setStep} />
    </div>
  );
}

export default CharGen;
