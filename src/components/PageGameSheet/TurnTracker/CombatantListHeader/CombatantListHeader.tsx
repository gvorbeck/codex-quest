import DiceSvg from "@/assets/svg/DiceSvg";
import { CombatantType } from "@/data/definitions";
import { ClearOutlined } from "@ant-design/icons";
import Icon, {
  CustomIconComponentProps,
} from "@ant-design/icons/lib/components/Icon";
import { Button, Flex, Tooltip, Typography } from "antd";
import React from "react";

interface CombatantListHeaderProps {
  combatants: CombatantType[];
  setCombatants: (combatants: CombatantType[]) => void;
}

const DiceIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={DiceSvg} {...props} />
);

const CombatantListHeader: React.FC<
  CombatantListHeaderProps & React.ComponentPropsWithRef<"div">
> = ({ className, combatants, setCombatants }) => {
  const handleBatchMonsterInitiative = () => {
    setCombatants(
      combatants
        .map((combatant) => {
          if (combatant.type === "monster") {
            return {
              ...combatant,
              initiative: Math.floor(Math.random() * 6 + 1),
            };
          }
          return combatant;
        })
        .sort((a, b) => b.initiative - a.initiative),
    );
  };
  return (
    <Flex justify="space-between" gap={16} align="center" className={className}>
      <Typography.Text>Combatants</Typography.Text>
      <Flex gap={16}>
        <Tooltip title="Roll Monster Initiative">
          <Button
            icon={<DiceIcon />}
            type="text"
            disabled={!combatants.length}
            className="[&:disabled_svg]:fill-stone"
            onClick={handleBatchMonsterInitiative}
          />
        </Tooltip>
        <Tooltip title="Clear combatants">
          <Button
            icon={<ClearOutlined />}
            type="text"
            disabled={!combatants.length}
            onClick={() => setCombatants([])}
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export default CombatantListHeader;
