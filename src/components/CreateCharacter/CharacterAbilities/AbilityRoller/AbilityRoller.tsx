import { AbilityRollerProps } from "./definitions";
import { Space, InputNumber, Button } from "antd";

export default function AbilityRoller({
  rollDice,
  abilityValue,
  getModifier,
  updateCharacterData,
  record,
}: AbilityRollerProps) {
  const rollAbilityScore = (ability: string) => {
    const score = rollDice();
    const modifier = getModifier(score);
    updateCharacterData({ [ability]: score }, { [ability]: modifier });
  };

  const onChange = (value: number | null) => {
    if (value === null) return;
    if (value < 3) value = 3;
    if (value > 18) value = 18;
    rollAbilityScore(record.ability.toLowerCase());
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
        className="w-[40px]"
      />
      <Button
        type="primary"
        onClick={() => rollAbilityScore(record.ability.toLowerCase())}
      >
        Roll 3d6
      </Button>
    </Space.Compact>
  );
}