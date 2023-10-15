import { Space, InputNumber, Button } from "antd";
import { AbilityRecord } from "../../../../data/definitions";

type AbilityRollerProps = {
  rollDice: () => any;
  abilityValue: number;
  getModifier: (score: number) => string;
  updateCharacterData: (
    scores: Record<string, number>,
    modifiers: Record<string, string>
  ) => void;
  record: AbilityRecord;
};

export default function AbilityRoller({
  rollDice,
  abilityValue,
  getModifier,
  updateCharacterData,
  record,
}: AbilityRollerProps) {
  const rollAbilityScore = (ability: string, score?: number) => {
    const newScore = score || rollDice();
    const modifier = getModifier(newScore);
    updateCharacterData({ [ability]: newScore }, { [ability]: modifier });
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
        onChange={onChange}
        onFocus={handleFocus}
        type="number"
        value={abilityValue}
        className="w-[50px] [&_input]:pl-2"
      />
      <Button
        type="primary"
        onClick={() => rollAbilityScore(record.ability.toLowerCase())}
        className="px-2"
      >
        Roll 3d6
      </Button>
    </Space.Compact>
  );
}
