import { Button } from "@/components/ui/core/primitives";
import { Typography, Card } from "@/components/ui/core/display";
import { Icon } from "@/components/ui/core/display";
import { SectionWrapper } from "@/components/ui/core/layout";
import { DESIGN_TOKENS } from "@/constants";

interface EncounterResultsProps {
  encounterOccurs: boolean | null;
  currentEncounter: string | null;
  onAddToCombat: (() => void) | undefined;
  isGenerating: boolean;
}

export default function EncounterResults({
  encounterOccurs,
  currentEncounter,
  onAddToCombat,
  isGenerating,
}: EncounterResultsProps) {
  if (isGenerating || encounterOccurs === null) {
    return null;
  }

  return (
    <SectionWrapper title="Encounter Result">
      <Card
        variant="nested"
        size="compact"
        className="text-center space-y-3"
        role="region"
        aria-live="polite"
        aria-label="Encounter generation result"
      >
        {encounterOccurs ? (
          <>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Icon
                name="exclamation-triangle"
                size="md"
                className={DESIGN_TOKENS.colors.text.accent}
                aria-hidden={true}
              />
              <Typography variant="h6" color="primary" weight="bold">
                Encounter Occurs!
              </Typography>
            </div>
            {currentEncounter && (
              <div className="bg-amber-400/10 border border-amber-400/30 rounded-lg p-4">
                <Typography
                  variant="h5"
                  color="primary"
                  weight="bold"
                  className="text-amber-300"
                  role="heading"
                  aria-level={3}
                >
                  {currentEncounter}
                </Typography>
                <Typography variant="bodySmall" color="muted" className="mt-2">
                  * indicates a creature with special abilities or immunities
                </Typography>
                {onAddToCombat && (
                  <Button
                    onClick={onAddToCombat}
                    variant="primary"
                    size="md"
                    className="mt-3 w-full bg-red-600 hover:bg-red-700"
                    aria-label={`Add ${currentEncounter} to combat tracker`}
                  >
                    Add to Combat Tracker
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Icon
              name="check-circle"
              size="md"
              className={DESIGN_TOKENS.colors.text.modifier}
              aria-hidden={true}
            />
            <Typography variant="h6" color="secondary">
              No Encounter
            </Typography>
          </div>
        )}
      </Card>
    </SectionWrapper>
  );
}
