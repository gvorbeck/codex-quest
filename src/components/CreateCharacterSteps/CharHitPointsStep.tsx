import { Button, InputNumber, Space } from "antd";

type CharHitPointsStepProps = {
  hitPoints: number;
  setHitPoints: (hitPoints: number) => void;
  race: string;
  playerClass: string;
  constitutionModifier: string;
  hitDice: string;
  setHitDice: (hitDice: string) => void;
};

// Halflings and Elves can only roll d6 for hit dice.
// Other races don't affect this.
// Cleric: d6
// Fighter: d8
// Magic-User: d4
// Thief: d4
// Constitution modifier add/subtracted from hit dice roll total
// Minimum is 1

export default function CharHitPointsStep({
  hitPoints,
  setHitPoints,
  race,
  playerClass,
  constitutionModifier,
  hitDice,
  setHitDice,
}: CharHitPointsStepProps) {
  return (
    <Space.Compact>
      <InputNumber />
      <Button type="primary" onClick={() => console.log("boop")}>
        Roll 3d6
      </Button>
    </Space.Compact>
  );
}
