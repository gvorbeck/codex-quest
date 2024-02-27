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
  index: number;
}

const CombatantName: React.FC<
  CombatantNameProps & React.ComponentPropsWithRef<"div">
> = ({
  className,
  combatant,
  combatants,
  setCombatants,
  editingCombatant,
  index,
}) => {
  const { setEditingCombatant } = useTurnTracker(combatants, setCombatants);
  const combatantNameClassNames = classNames(
    "flex-grow truncate text-elipsis text-clip",
    className,
  );
  const handleRenameConfirm = (newName: string) => {
    const newCombatants = [...combatants];
    newCombatants.splice(index, 1, { ...combatant, name: newName });
    setCombatants(newCombatants);
    setEditingCombatant(null);
  };
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
            handleRenameConfirm((e.target as HTMLInputElement).value);
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
