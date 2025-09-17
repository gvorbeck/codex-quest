import { Typography } from "@/components/ui/core/display";
import { SectionWrapper } from "@/components/ui/core/layout";
import { Button } from "@/components/ui/core/primitives";
import InitiativeTable from "./InitiativeTable";
import type { CombatantWithInitiative } from "@/types";
import { rollInitiative } from "@/utils";

interface PreCombatInitiativeSectionProps {
  combatants: CombatantWithInitiative[];
  onUpdateInitiative: (
    combatant: CombatantWithInitiative,
    newInitiative: number
  ) => void;
  onUpdateMultipleInitiatives?: (
    updates: Array<{ combatant: CombatantWithInitiative; initiative: number }>
  ) => void;
  onDeleteCombatant?: (
    combatant: CombatantWithInitiative,
    index: number
  ) => void;
}

export default function PreCombatInitiativeSection({
  combatants,
  onUpdateInitiative,
  onUpdateMultipleInitiatives,
  onDeleteCombatant,
}: PreCombatInitiativeSectionProps) {
  if (combatants.length === 0) return null;

  return (
    <SectionWrapper
      title="Set Initiative"
      collapsible
      collapsibleKey="pre-combat-initiative"
    >
      <div className="p-2">
        <div className="mb-3">
          <Typography variant="bodySmall" color="secondary" className="mb-3">
            Set custom initiative values before starting combat, or leave at 0
            to auto-roll when combat begins.
          </Typography>

          {combatants.some((c) => !c.isPlayer) && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                const monsters = combatants.filter((c) => !c.isPlayer);

                if (onUpdateMultipleInitiatives) {
                  // Use batch update if available
                  const updates = monsters.map((combatant) => ({
                    combatant,
                    initiative: rollInitiative(),
                  }));
                  onUpdateMultipleInitiatives(updates);
                } else {
                  // Fallback to individual updates
                  monsters.forEach((combatant) => {
                    const newInitiative = rollInitiative();
                    onUpdateInitiative(combatant, newInitiative);
                  });
                }
              }}
              variant="secondary"
              size="sm"
              className="mb-3"
            >
              Roll Initiative for Monsters
            </Button>
          )}
        </div>

        <InitiativeTable
          combatants={combatants}
          currentTurn={-1}
          isCombatActive={false}
          onUpdateInitiative={onUpdateInitiative}
          onSetCurrentTurn={() => {}} // No-op for pre-combat
          onUpdateHp={() => {}} // No-op for pre-combat
          showHp={false}
          {...(onDeleteCombatant && { onDeleteCombatant })}
        />
      </div>
    </SectionWrapper>
  );
}
