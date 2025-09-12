import { Card } from "@/components/ui/design-system";
import { SectionHeader, Icon } from "@/components/ui/display";

interface SpellcrafterBonusesProps {
  bonuses: {
    researchRollBonus: number;
    timeReduction: number;
    costReduction: number;
  };
}

export const SpellcrafterBonuses = ({ bonuses }: SpellcrafterBonusesProps) => {
  return (
    <div className="mb-6">
      <SectionHeader title="Spellcrafter Bonuses" size="md" className="mb-3" />
      <Card className="p-4">
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <Icon name="star" size="sm" />
            +{bonuses.researchRollBonus}% research roll bonus
          </div>
          {bonuses.timeReduction > 0 && (
            <div className="flex items-center gap-2">
              <Icon name="lightning" size="sm" />
              {bonuses.timeReduction}% time reduction (6th level)
            </div>
          )}
          {bonuses.costReduction > 0 && (
            <div className="flex items-center gap-2">
              <Icon name="coin" size="sm" />
              {bonuses.costReduction}% cost reduction (9th level)
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};