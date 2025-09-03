import { Typography } from "@/components/ui/design-system";
import { SectionWrapper } from "@/components/ui/layout";
import InitiativeTable from "./InitiativeTable";
import type { CombatantWithInitiative } from "@/utils/combatUtils";

interface PreCombatInitiativeSectionProps {
  combatants: CombatantWithInitiative[];
  onUpdateInitiative: (combatant: CombatantWithInitiative, newInitiative: number) => void;
}

export default function PreCombatInitiativeSection({
  combatants,
  onUpdateInitiative,
}: PreCombatInitiativeSectionProps) {
  if (combatants.length === 0) return null;

  return (
    <SectionWrapper
      title="Set Initiative (Optional)"
      collapsible
      collapsibleKey="pre-combat-initiative"
    >
      <div className="p-2">
        <div className="mb-3">
          <Typography variant="bodySmall" color="secondary">
            Set custom initiative values before starting combat, or
            leave at 0 to auto-roll when combat begins.
          </Typography>
        </div>
        <InitiativeTable
          combatants={combatants}
          currentTurn={-1}
          isCombatActive={false}
          onUpdateInitiative={onUpdateInitiative}
          onSetCurrentTurn={() => {}} // No-op for pre-combat
          onUpdateHp={() => {}} // No-op for pre-combat
        />
      </div>
    </SectionWrapper>
  );
}