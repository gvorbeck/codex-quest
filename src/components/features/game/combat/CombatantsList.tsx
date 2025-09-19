import { SectionWrapper } from "@/components/ui/core/layout";
import CombatantCard from "./CombatantCard";
import type { CombatantWithInitiative } from "@/types";

interface CombatantsListProps {
  title: string;
  combatants: CombatantWithInitiative[];
  variant: "combat" | "available";
  onAction: (action: string, index: number) => void;
}

export default function CombatantsList({
  title,
  combatants,
  variant,
  onAction,
}: CombatantsListProps) {
  if (combatants.length === 0) return null;

  return (
    <SectionWrapper title={title}>
      <div className="space-y-3 p-3">
        {combatants.map((combatant, index) => (
          <CombatantCard
            key={`combatant-${combatant.name}-${combatant.ac || 'no-ac'}-${index}`}
            combatant={combatant}
            index={index}
            variant={variant}
            onAction={onAction}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
