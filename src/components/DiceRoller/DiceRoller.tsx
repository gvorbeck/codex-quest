import { Button } from "antd";
import DieIcon from "../../assets/images/isometric-die.png";
import { DiceRollerProps } from "./definitions";

export default function DiceRoller({ className = "" }: DiceRollerProps) {
  const handleDiceRollerClick = () => {
    console.log("🚀 ~ file: DiceRoller.tsx:1 ~ andleDiceRollerClick");
  };
  return (
    <div className={className}>
      <Button type="primary" onClick={handleDiceRollerClick}>
        Virtual Dice
      </Button>
    </div>
  );
}
