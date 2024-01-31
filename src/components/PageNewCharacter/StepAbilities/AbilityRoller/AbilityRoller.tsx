import { Space, InputNumber, Button } from "antd";
import { AbilityRecord, CharData } from "@/data/definitions";
import { rollDice } from "@/support/diceSupport";
import { getModifier } from "@/support/statSupport";
import { updateCharacter } from "@/support/pageNewCharacterSupport";

type AbilityRollerProps = {
  abilityValue: number;
  character: CharData;
  setCharacter: (character: CharData) => void;
  record: AbilityRecord;
  newCharacter?: boolean;
};

export default function AbilityRoller({
  abilityValue,
  record,
  character,
  setCharacter,
  newCharacter,
}: AbilityRollerProps) {
  const rollAbilityScore = (ability: string, score?: number) => {
    const newScore = score || rollDice("3d6");
    const modifier = getModifier(newScore);
    updateCharacter(
      { [ability]: newScore },
      { [ability]: modifier },
      character,
      setCharacter,
      newCharacter,
    );
  };

  const onChange = (value: number | null) => {
    if (value === null) return;
    if (value < 3) value = 3;
    if (value > 18) value = 18;
    rollAbilityScore(record.ability.toLowerCase(), value);
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  return (
    <Space.Compact>
      <InputNumber
        id={record.ability.toLowerCase()}
        max={18}
        min={3}
        defaultValue={0}
        onChange={(event) => onChange(event)}
        onFocus={handleFocus}
        type="number"
        value={abilityValue}
        className="w-[50px] [&_input]:pl-2"
      />
      <Button
        type="primary"
        onClick={() => rollAbilityScore(record.ability.toLowerCase())}
        className="px-2 shadow-none"
      >
        Roll 3d6
      </Button>
    </Space.Compact>
  );
}
