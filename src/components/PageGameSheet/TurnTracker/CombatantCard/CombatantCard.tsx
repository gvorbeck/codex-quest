import { Button, Card, Flex, Tooltip } from "antd";
import { clsx } from "clsx";
import React from "react";
import CombatantName from "../CombatantName/CombatantName";
import { EditOutlined } from "@ant-design/icons";
import CombatantControls from "../CombatantControls/CombatantControls";
import TagList from "../TagList/TagList";
import { useRoundTracker } from "@/hooks/useRoundTracker";
import { CombatantType } from "@/data/definitions";

interface CombatantCardProps {
  combatant: CombatantType;
  combatants: CombatantType[];
  setCombatants: (combatants: CombatantType[]) => void;
  index: number;
}

const CombatantCard: React.FC<
  CombatantCardProps & React.ComponentPropsWithRef<"div">
> = ({ className, combatant, combatants, setCombatants, index }) => {
  const { editingCombatant, setEditingCombatant, handleClose } =
    useRoundTracker(combatants, setCombatants);
  const combatantCardClassNames = clsx("w-full", className);
  return (
    <Flex
      gap={8}
      justify="space-between"
      className={combatantCardClassNames}
      vertical
    >
      <Card
        title={
          <CombatantName
            combatant={combatant}
            combatants={combatants}
            setCombatants={setCombatants}
            editingCombatant={editingCombatant}
            index={index}
          />
        }
        extra={
          combatant.type === "monster" && (
            <Tooltip title="Rename monster">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => setEditingCombatant(combatant.name)}
              />
            </Tooltip>
          )
        }
        size="small"
        className="shadow-md"
      >
        <Flex gap={8} vertical>
          {!!combatant.tags.length && (
            <TagList combatant={combatant} handleClose={handleClose} />
          )}
          <CombatantControls
            combatant={combatant}
            combatants={combatants}
            setCombatants={setCombatants}
            index={index}
          />
        </Flex>
      </Card>
    </Flex>
  );
};

export default CombatantCard;
