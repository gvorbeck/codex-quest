import { Button } from "antd";

export default function DiceRoller({
  className = "",
  onClick,
}: React.ComponentPropsWithRef<"div">) {
  return (
    <div className={className}>
      <Button type="primary" onClick={onClick}>
        Virtual Dice
      </Button>
    </div>
  );
}
