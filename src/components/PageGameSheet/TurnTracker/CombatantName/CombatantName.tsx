import { CombatantType } from "@/data/definitions";
import { useTurnTracker } from "@/hooks/useTurnTacker";
import { Flex, Image, Input, Typography } from "antd";
import classNames from "classnames";
import React from "react";

interface CombatantNameProps {
  combatant: CombatantType;
  combatants: CombatantType[];
  setCombatants: (combatants: CombatantType[]) => void;
  editingCombatant: string | null;
}

const CombatantName: React.FC<
  CombatantNameProps & React.ComponentPropsWithRef<"div">
> = ({ className, combatant, combatants, setCombatants, editingCombatant }) => {
  const { setEditingCombatant, handleRenameConfirm } = useTurnTracker(
    combatants,
    setCombatants,
  );
  const combatantNameClassNames = classNames(
    "flex-grow truncate text-elipsis text-clip",
    className,
  );
  return (
    <Flex gap={8} align="center" className={combatantNameClassNames}>
      {combatant.avatar && (
        <Image
          src={combatant.avatar}
          alt={combatant.name}
          preview={false}
          width={32}
          height={32}
          className="rounded-full border-2 border-seaBuckthorn border-solid shadow-md"
        />
      )}
      {editingCombatant === combatant.name ? (
        <Input
          defaultValue={combatant.name}
          onPressEnter={(e) => {
            handleRenameConfirm(
              combatant,
              (e.target as HTMLInputElement).value,
            );
          }}
          size="small"
          className="mr-1"
          onBlur={() => setEditingCombatant(null)}
          autoFocus
        />
      ) : (
        <Typography.Text className="leading-8">
          {combatant.name}
        </Typography.Text>
      )}
    </Flex>
  );
};

export default CombatantName;
