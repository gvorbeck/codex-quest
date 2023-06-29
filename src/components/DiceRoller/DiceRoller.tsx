import { Button } from "antd";
import { DiceRollerProps } from "./definitions";

export default function DiceRoller({
  className = "",
  onClick,
}: DiceRollerProps) {
  const handleDiceRollerClick = () => {
    console.log("🚀 ~ file: DiceRoller.tsx:5 ~ handleDiceRollerClick");
    onClick();
  };
  return (
    <div className={className}>
      <Button type="primary" onClick={handleDiceRollerClick}>
        Virtual Dice
      </Button>
    </div>
  );
}
