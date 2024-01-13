import React from "react";
import { Button, InputNumber, Space } from "antd";
import { rollDice } from "@/support/characterSupport";

interface GoldRollerProps {
  gold: number;
  setGold: (gold: number) => void;
}

const GoldRoller: React.FC<
  GoldRollerProps & React.ComponentPropsWithRef<"div">
> = ({ className, gold, setGold }) => {
  const goldDiceFormula = "3d6*10";

  const handleGoldChange = (value: number | null) => {
    setGold(value || 0);
  };
  const handleButtonClick = () => {
    setGold(rollDice(goldDiceFormula));
  };

  return (
    <Space.Compact className={className}>
      <InputNumber value={gold} min={0} onChange={handleGoldChange} />
      <Button onClick={handleButtonClick}>
        {goldDiceFormula.replace("*", "x")}
      </Button>
    </Space.Compact>
  );
};

export default GoldRoller;
