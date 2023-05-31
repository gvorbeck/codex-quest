import { useEffect } from "react";
import { Button, InputNumber, Space } from "antd";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { CharHitPointsStepProps } from "../types";

export default function CharHitPointsStep({
  characterData,
  setCharacterData,
  comboClass,
}: CharHitPointsStepProps) {
  const roller = new DiceRoller();

  useEffect(() => {
    let dice: string;

    if (comboClass) {
      if (characterData.class.includes("Thief")) {
        dice = "d4";
      } else {
        dice = "d6";
      }
    } else {
      if (characterData.class === "Cleric") {
        dice = "d6";
      } else if (characterData.class === "Fighter") {
        dice = "d8";
        if (characterData.race === "Elf" || characterData.race === "Halfling") {
          dice = "d6";
        }
      } else if (characterData.class === "Magic-User") {
        dice = "d4";
      } else {
        // Thief
        dice = "d4";
      }
    }

    // setHitDice(dice);
    setCharacterData({
      ...characterData,
      hp: { dice, points: characterData.hp.points },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClick = () => {
    const result = roller.roll(characterData.hp.dice);
    if (!(result instanceof Array)) handleHitPointValue(result.total);
  };

  const handleHitPointValue = (value: number | null) => {
    if (value === null) return;
    value += +characterData.abilities.modifiers.constitution;
    if (value < 1) value = 1;
    setCharacterData({
      ...characterData,
      hp: { points: value, dice: characterData.hp.dice },
    });
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
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
      >{`Roll 1${characterData.hp.dice}${characterData.abilities.modifiers.constitution}`}</Button>
    </Space.Compact>
  );
}
