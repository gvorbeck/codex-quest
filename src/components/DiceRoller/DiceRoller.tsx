import { Button } from "antd";
import { DiceRollerProps } from "./definitions";

export default function DiceRoller({
  className = "",
  onClick,
}: DiceRollerProps) {
  return (
    <div className={className}>
      <Button type="primary" onClick={onClick}>
        Virtual Dice
      </Button>
    </div>
  );
}
