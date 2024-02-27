import { CombatantType } from "@/data/definitions";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Flex, Tooltip } from "antd";
import React from "react";

interface TurnControlsProps {
  turn: number;
  setTurn: (turn: number) => void;
  combatants: CombatantType[];
}

const TurnControls: React.FC<
  TurnControlsProps & React.ComponentPropsWithRef<"div">
> = ({ className, turn, setTurn, combatants }) => {
  const advanceTurn = (reverse: boolean) => {
    if (reverse) {
      if (turn < combatants.length - 1) {
        setTurn(turn + 1);
      } else {
        setTurn(0);
      }
    } else {
      if (turn > 0) {
        setTurn(turn - 1);
      } else {
        setTurn(combatants.length - 1);
      }
    }
  };
  return (
    <Flex gap={16} justify="space-between" align="center" className={className}>
      <Tooltip title="Rewind Turn">
        <Button
          onClick={() => advanceTurn(false)}
          disabled={!combatants.length}
          icon={<LeftOutlined />}
        />
      </Tooltip>
      <Tooltip title="Advance Turn">
        <Button
          onClick={() => advanceTurn(true)}
          disabled={!combatants.length}
          icon={<RightOutlined />}
          type="primary"
        />
      </Tooltip>
    </Flex>
  );
};

export default TurnControls;
