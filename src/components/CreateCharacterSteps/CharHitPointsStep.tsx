import { useEffect } from "react";
import { Button, InputNumber, Space } from "antd";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";

type CharHitPointsStepProps = {
  hitPoints: number;
  setHitPoints: (hitPoints: number) => void;
  race: string;
  playerClass: string;
  constitutionModifier: string;
  hitDice: string;
  setHitDice: (hitDice: string) => void;
};

// TODO: HIT POINTS FOR COMBINATION CLASS!!!!!!

export default function CharHitPointsStep({
  hitPoints,
  setHitPoints,
  race,
  playerClass,
  constitutionModifier,
  hitDice,
  setHitDice,
}: CharHitPointsStepProps) {
  const roller = new DiceRoller();

  useEffect(() => {
    let dice: string;

    if (playerClass === "Cleric") {
      dice = "d6";
    } else if (playerClass === "Fighter") {
      dice = "d8";
      if (race === "Elf" || race === "Halfling") {
        dice = "d6";
      }
    } else if (playerClass === "Magic-User") {
      dice = "d4";
    } else {
      // Thief
      dice = "d4";
    }

    setHitDice(dice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClick = () => {
    const result = roller.roll(hitDice);
    if (!(result instanceof Array)) handleHitPointValue(result.total);
  };

  const handleHitPointValue = (value: number | null) => {
    if (value === null) return;
    value += parseInt(constitutionModifier);
    if (value < 1) value = 1;
    setHitPoints(value);
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
        value={hitPoints}
      />
      <Button
        type="primary"
        onClick={onClick}
      >{`Roll 1${hitDice}${constitutionModifier}`}</Button>
    </Space.Compact>
  );
}
