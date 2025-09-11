import { Typography } from "@/components/ui/design-system";
import { Card } from "@/components/ui/design-system";
import { SectionWrapper } from "@/components/ui/layout";
import type { EncounterType } from "@/types/encounters";

interface EncounterRulesProps {
  encounterType: EncounterType;
}

export default function EncounterRules({ encounterType }: EncounterRulesProps) {
  return (
    <SectionWrapper title="Encounter Rules">
      <Card variant="nested" size="compact" className="space-y-2">
        <Typography variant="bodySmall" color="secondary">
          <strong>Encounter Check:</strong> Roll 1d6, encounter occurs on a
          roll of 1
        </Typography>
        {encounterType === "dungeon" && (
          <Typography variant="bodySmall" color="muted">
            <strong>Dungeon:</strong> Check every 3 turns or when
            circumstances warrant
          </Typography>
        )}
        {encounterType === "wilderness" && (
          <Typography variant="bodySmall" color="muted">
            <strong>Wilderness:</strong> Check every 4 hours (3 night
            checks, 3 day checks)
          </Typography>
        )}
        {encounterType === "city" && (
          <Typography variant="bodySmall" color="muted">
            <strong>City:</strong> Check as needed based on area and time
          </Typography>
        )}
      </Card>
    </SectionWrapper>
  );
}