import { useState, memo } from "react";
import { Card, Typography } from "@/components/ui/core/display";
import { Icon } from "@/components/ui";
import { InfoCardHeader } from "@/components/ui/composite";
import { SectionWrapper } from "@/components/ui/core/layout";
import { Callout } from "@/components/ui/core/feedback";
import type { Character } from "@/types";
import type { EquipmentPack } from "@/types/character";
import { useEquipmentPacks } from "@/hooks/equipment/useEquipmentPacks";
import EquipmentPackCard from "./EquipmentPackCard";

interface EquipmentPackSelectorProps {
  character: Character;
  onPackSelected: (pack: EquipmentPack) => void;
  isLoading?: boolean;
}

function EquipmentPackSelector({
  character,
  onPackSelected,
  isLoading = false
}: EquipmentPackSelectorProps) {
  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);

  const {
    recommendedPacks,
    hasAffordablePacks,
    cheapestPackCost,
    isPackRecommended,
    isPackAffordable,
  } = useEquipmentPacks(character);

  const handlePackSelect = (pack: EquipmentPack) => {
    setSelectedPackId(pack.id);
  };

  const handleConfirmSelection = (pack: EquipmentPack) => {
    onPackSelected(pack);
  };

  return (
    <SectionWrapper title="Equipment Packs" className="mb-8">
      <div className="p-6">
        <Card variant="info" className="mb-6">
        <InfoCardHeader
          icon={<Icon name="briefcase" size="md" aria-hidden={true} />}
          title="Quick Equipment Setup"
          className="mb-4"
        />
        <Typography variant="description" color="primary">
          Choose a pre-configured equipment pack to quickly gear up your character,
          or skip to select individual items.
        </Typography>
      </Card>

      <div className="space-y-4 mb-6">
        {recommendedPacks.map((pack) => (
          <EquipmentPackCard
            key={pack.id}
            pack={pack}
            isSelected={selectedPackId === pack.id}
            isRecommended={isPackRecommended(pack)}
            isAffordable={isPackAffordable(pack)}
            characterClasses={character.class}
            onSelect={handlePackSelect}
            onConfirm={handleConfirmSelection}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* No affordable packs message */}
      {recommendedPacks.length > 0 && !hasAffordablePacks && (
        <Callout
          variant="warning"
          title="Equipment packs require more gold"
          className="mb-6"
        >
          <Typography variant="bodySmall" color="secondary">
            You need at least {cheapestPackCost} gp
            for the cheapest recommended pack. Roll for more starting gold or
            select individual equipment below.
          </Typography>
        </Callout>
      )}

      {/* No recommended packs message */}
      {recommendedPacks.length === 0 && (
        <Callout
          variant="info"
          title="No equipment packs available"
          className="mb-6"
        >
          <Typography variant="bodySmall" color="secondary">
            No equipment packs are recommended for your character's class combination.
            Use the "Individual Items" tab to select equipment.
          </Typography>
        </Callout>
      )}

      </div>
    </SectionWrapper>
  );
}

export default memo(EquipmentPackSelector);