import { Abilities, CharData, CharDataAction } from "@/data/definitions";
import { rollDice } from "@/support/diceSupport";
import { calculateModifier } from "@/support/statSupport";
import { Button, InputNumber, Space } from "antd";

interface AbilityRollerProps {
  ability: keyof Abilities;
  character: CharData;
  newCharacter?: boolean;
  characterDispatch: React.Dispatch<CharDataAction>;
}

const AbilityRoller: React.FC<
  AbilityRollerProps & React.ComponentPropsWithRef<"div">
> = ({ className, character, characterDispatch, newCharacter, ability }) => {
  function handleChange(value: number | null) {
    if (value === null) return;
    characterDispatch({
      type: "SET_ABILITIES",
      payload: {
        scores: {
          ...character.abilities.scores,
          [ability]: value,
        },
        modifiers: {
          ...character.abilities.modifiers,
          [ability]: calculateModifier(value),
        },
        newCharacter: !!newCharacter,
      },
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
