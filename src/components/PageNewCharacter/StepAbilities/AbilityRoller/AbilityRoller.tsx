import { Abilities, CharData } from "@/data/definitions";
import { calculateModifier, rollDice } from "@/support/diceSupport";
import { Button, InputNumber, Space } from "antd";

interface AbilityRollerProps {
  ability: keyof Abilities;
  character: CharData;
  newCharacter?: boolean;
  setCharacter: React.Dispatch<React.SetStateAction<CharData>>;
}

const AbilityRoller: React.FC<
  AbilityRollerProps & React.ComponentPropsWithRef<"div">
> = ({ className, character, setCharacter, newCharacter, ability }) => {
  function handleChange(value: number | null) {
    if (value === null) return;
    setCharacter((prevCharacter) => {
      return {
        ...prevCharacter,
        abilities: {
          scores: {
            ...prevCharacter.abilities.scores,
            [ability]: value,
          },
          modifiers: {
            ...prevCharacter.abilities.modifiers,
            [ability]: calculateModifier(value),
          },
        },
        race: newCharacter ? "" : prevCharacter.race,
        class: newCharacter ? [] : [...prevCharacter.class],
        hp: newCharacter
          ? { dice: "", points: 0, max: 0, desc: "" }
          : { ...prevCharacter.hp },
      };
    });
  }

  function handleClick() {
    const rolledScore = rollDice("3d6");
    handleChange(rolledScore);
  }

  return (
    <Space.Compact className={className}>
      <InputNumber
        max={18}
        min={3}
        value={character.abilities.scores[ability] as number}
        onChange={handleChange}
        type="number"
        className="pb-0.5"
      />
      {newCharacter && (
        <Button type="primary" onClick={handleClick}>
          Roll 3d6
        </Button>
      )}
    </Space.Compact>
  );
};

export default AbilityRoller;
