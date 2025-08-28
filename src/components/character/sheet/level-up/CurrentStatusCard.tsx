import Card from "@/components/ui/design-system/Card";
import Typography from "@/components/ui/design-system/Typography";
import type { Character, Class } from "@/types/character";

interface CurrentStatusCardProps {
  character: Character;
  primaryClass: Class | null;
  currentLevel: number;
  requiredXP: number | undefined;
}

export default function CurrentStatusCard({
  character,
  primaryClass,
  currentLevel,
  requiredXP,
}: CurrentStatusCardProps) {
  return (
    <Card variant="standard" size="default">
      <Typography variant="sectionHeading" className="mb-4">
        Current Status
      </Typography>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex justify-between">
          <Typography variant="bodySmall" color="secondary">
            Current Level:
          </Typography>
          <Typography variant="bodySmall" weight="semibold">
            {currentLevel}
          </Typography>
        </div>
        <div className="flex justify-between">
          <Typography variant="bodySmall" color="secondary">
            Current XP:
          </Typography>
          <Typography variant="bodySmall" weight="semibold">
            {character.xp.toLocaleString()}
          </Typography>
        </div>
        <div className="flex justify-between">
          <Typography variant="bodySmall" color="secondary">
            Class:
          </Typography>
          <Typography variant="bodySmall" weight="semibold">
            {primaryClass?.name || "Unknown"}
          </Typography>
        </div>
        <div className="flex justify-between">
          <Typography variant="bodySmall" color="secondary">
            Next Level XP:
          </Typography>
          <Typography variant="bodySmall" weight="semibold">
            {requiredXP ? requiredXP.toLocaleString() : "Max Level"}
          </Typography>
        </div>
        <div className="flex justify-between">
          <Typography variant="bodySmall" color="secondary">
            Current HP:
          </Typography>
          <Typography variant="bodySmall" weight="semibold">
            {character.hp.current}/{character.hp.max}
          </Typography>
        </div>
        <div className="flex justify-between">
          <Typography variant="bodySmall" color="secondary">
            Hit Die:
          </Typography>
          <Typography variant="bodySmall" weight="semibold">
            {primaryClass?.hitDie || "N/A"}
          </Typography>
        </div>
      </div>
    </Card>
  );
}
