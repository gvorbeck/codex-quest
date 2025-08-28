import Card from "@/components/ui/design-system/Card";
import Typography from "@/components/ui/design-system/Typography";
import type { Character, Class } from "@/types/character";
import type { HPGainResult } from "@/hooks/useHPGain";

interface HPGainPreviewProps {
  character: Character;
  primaryClass: Class;
  hpGainResult: HPGainResult;
  nextLevel: number;
}

export default function HPGainPreview({
  character,
  primaryClass,
  hpGainResult,
  nextLevel,
}: HPGainPreviewProps) {
  return (
    <Card variant="success" size="default">
      <Typography variant="sectionHeading" color="lime" className="mb-4">
        🎉 Ready to Level Up!
      </Typography>
      <div className="space-y-4">
        <Typography variant="body" color="primary">
          Your character is ready to advance to level {nextLevel}!
        </Typography>

        {/* HP Gain Preview */}
        <Card variant="nested" size="compact">
          <Typography variant="subHeading" color="amber" className="mb-2">
            Hit Points Gain
          </Typography>
          <div className="space-y-2">
            {hpGainResult.isFixed ? (
              // Fixed HP gain (levels 10+)
              <>
                <div className="flex justify-between items-center">
                  <Typography variant="bodySmall" color="secondary">
                    Fixed HP Gain:
                  </Typography>
                  <Typography variant="bodySmall" weight="semibold">
                    +{hpGainResult.total} HP
                  </Typography>
                </div>
                <Typography variant="caption" color="secondary">
                  {hpGainResult.breakdown}
                </Typography>
              </>
            ) : (
              // Rolled HP gain (levels 1-9)
              <>
                <div className="flex justify-between items-center">
                  <Typography variant="bodySmall" color="secondary">
                    Roll ({primaryClass.hitDie}):
                  </Typography>
                  <Typography variant="bodySmall" weight="semibold">
                    {hpGainResult.roll}
                  </Typography>
                </div>
                <div className="flex justify-between items-center">
                  <Typography variant="bodySmall" color="secondary">
                    Constitution Bonus:
                  </Typography>
                  <Typography variant="bodySmall" weight="semibold">
                    {hpGainResult.constitutionBonus !== null &&
                    hpGainResult.constitutionBonus >= 0
                      ? "+"
                      : ""}
                    {hpGainResult.constitutionBonus}
                  </Typography>
                </div>
              </>
            )}
            <div className="flex justify-between items-center border-t border-amber-700/30 pt-2">
              <Typography variant="bodySmall" color="amber" weight="semibold">
                Total HP Gain:
              </Typography>
              <Typography variant="bodySmall" color="amber" weight="bold">
                +{hpGainResult.total} HP
              </Typography>
            </div>
            <Typography variant="caption" color="secondary">
              New HP: {character.hp.max} →{" "}
              {character.hp.max + hpGainResult.total}
            </Typography>
          </div>
        </Card>

        <Typography variant="bodySmall" color="muted">
          Note: This will also heal your character to full HP.
        </Typography>
      </div>
    </Card>
  );
}
