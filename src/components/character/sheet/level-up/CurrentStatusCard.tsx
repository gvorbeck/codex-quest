import Card from "@/components/ui/design-system/Card";
import Typography from "@/components/ui/design-system/Typography";
import { TextHeader } from "@/components/ui/display";
import { getPrimaryClassInfo } from "@/utils/characterHelpers";
import type { Character, Class } from "@/types/character";

interface CurrentStatusCardProps {
  character: Character;
  currentLevel: number;
  requiredXP: number | undefined;
  availableClasses: Class[];
}

export default function CurrentStatusCard({
  character,
  currentLevel,
  requiredXP,
  availableClasses,
}: CurrentStatusCardProps) {
  // Get primary class info using utility function
  const primaryClassInfo = getPrimaryClassInfo(character, availableClasses);

  const className = primaryClassInfo?.name || "Unknown";
  const hitDie = primaryClassInfo?.hitDie || "N/A";
  const isCustomClass = primaryClassInfo?.isCustom || false;
  return (
    <Card variant="standard" size="default">
      <TextHeader variant="h4" size="md">
        Current Status
      </TextHeader>
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
            {className}
          </Typography>
        </div>
        <div className="flex justify-between">
          <Typography variant="bodySmall" color="secondary">
            Next Level XP:
          </Typography>
          <Typography variant="bodySmall" weight="semibold">
            {isCustomClass
              ? "N/A (Custom)"
              : requiredXP
              ? requiredXP.toLocaleString()
              : "Max Level"}
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
            {hitDie}
          </Typography>
        </div>
      </div>
    </Card>
  );
}
