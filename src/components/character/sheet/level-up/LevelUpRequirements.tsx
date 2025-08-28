import Card from "@/components/ui/design-system/Card";
import Typography from "@/components/ui/design-system/Typography";
import type { Character } from "@/types/character";

interface LevelUpRequirementsProps {
  character: Character;
  requiredXP: number | undefined;
  nextLevel: number;
}

export default function LevelUpRequirements({
  character,
  requiredXP,
  nextLevel,
}: LevelUpRequirementsProps) {
  return (
    <Card variant="standard" size="default">
      <Typography variant="sectionHeading" className="mb-4">
        Level Up Requirements
      </Typography>
      <Typography variant="body" color="secondary">
        {requiredXP
          ? `You need ${(
              requiredXP - character.xp
            ).toLocaleString()} more XP to reach level ${nextLevel}.`
          : "You have reached the maximum level for this class."}
      </Typography>
    </Card>
  );
}
