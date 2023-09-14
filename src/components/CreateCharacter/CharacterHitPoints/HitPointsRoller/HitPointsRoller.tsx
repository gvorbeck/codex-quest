import { useState, useEffect } from "react";
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
  const [hitPoints, setHitPoints] = useState(characterData.hp.points);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  const rollHitPoints = (score?: number) => {
    const result =
      score ||
      roller.roll(characterData.hp.dice).total +
        +characterData.abilities.modifiers.constitution;
    setHitPoints(result);
  };

  useEffect(() => {
    setCharacterData({
      ...characterData,
      hp: { ...characterData.hp, points: hitPoints, max: hitPoints },
    });
  }, [hitPoints]);

  return (
    <Space.Compact>
      <InputNumber
        defaultValue={0}
        min={1}
        onFocus={handleFocus}
        onChange={(value) => rollHitPoints(value || 1)}
        type="number"
        value={hitPoints}
      />
      <Button
        type="primary"
        onClick={() => rollHitPoints()}
        disabled={
          customHitDice === "" &&
          !characterData.class.some((part) =>
            Object.values(ClassNamesTwo).includes(part as ClassNamesTwo)
          )
        }
      >{`Roll 1${characterData.hp.dice}${characterData.abilities.modifiers.constitution}`}</Button>
    </Space.Compact>
  );
}
