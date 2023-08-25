import { GoldRollerProps } from "./definitions";
import { Button, InputNumber, Space } from "antd";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";

const roller = new DiceRoller();

export default function GoldRoller({
  characterData,
  setCharacterData,
  goldInputValue,
  setGoldInputValue,
}: GoldRollerProps) {
  // Update inputValue when typing in the InputNumber field
  const handleGoldInputChange = (value: number | null) => {
    setGoldInputValue(value || 0);
    setCharacterData({ ...characterData, gold: value || 0 });
  };

  return (
    <Space.Compact className="sm:col-span-2">
      <InputNumber
        min={30}
        max={180}
        defaultValue={0}
        value={Number(goldInputValue.toFixed(2))}
        onFocus={(event) => event.target.select()}
        onChange={handleGoldInputChange}
      />
      <Button
        aria-label="Roll for starting gold"
        type="primary"
        onClick={() => handleGoldInputChange(roller.roll("3d6*10").total)}
      >
        Roll 3d6x10
      </Button>
    </Space.Compact>
  );
}
