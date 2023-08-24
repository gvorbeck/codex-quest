import { HitPointsRollerProps } from "./definitions";
import { Button, InputNumber, Space } from "antd";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { ClassNamesTwo } from "../../../../data/classes";

const roller = new DiceRoller();

export default function HitPointsRoller({
  characterData,
  setCharacterData,
  customHitDice,
}: HitPointsRollerProps) {
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  const handleHitPointValue = (value: number | null) => {
    if (value === null) return;
    value += +characterData.abilities.modifiers.constitution;
    if (value < 1) value = 1;
    setCharacterData({
      ...characterData,
      hp: { ...characterData.hp, points: value, max: value },
    });
  };

  const onClick = () => {
    const result = roller.roll(characterData.hp.dice);
    if (!(result instanceof Array)) handleHitPointValue(result.total);
  };

  return (
    <Space.Compact>
      <InputNumber
        max={11}
        min={1}
        defaultValue={0}
        onChange={handleHitPointValue}
        onFocus={handleFocus}
        type="number"
        value={characterData.hp.points}
      />
      <Button
        type="primary"
        onClick={onClick}
        disabled={
          customHitDice === "" &&
          !characterData.class
            .split(" ")
            .some((part) =>
              Object.values(ClassNamesTwo).includes(part as ClassNamesTwo)
            )
        }
      >{`Roll 1${characterData.hp.dice}${characterData.abilities.modifiers.constitution}`}</Button>
    </Space.Compact>
  );
}
