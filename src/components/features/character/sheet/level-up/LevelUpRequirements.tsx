import Card from "@/components/ui/core/display/Card";
import Typography from "@/components/ui/core/display/Typography";
import { TextHeader } from "@/components/ui/composite/TextHeader";
import { isCustomClass } from "@/utils";
import type { Character } from "@/types";

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
  // Check if this is a custom class using utility function
  const isCustomClassCharacter = character.class
    ? isCustomClass(character.class)
    : false;

  return (
    <Card variant="standard" size="default">
      <TextHeader variant="h4" size="md">
        Level Up Requirements
      </TextHeader>
      <Typography variant="body" color="secondary">
        {isCustomClassCharacter
          ? `Custom class characters can level up at any time. You are ready to advance to level ${nextLevel}.`
          : requiredXP
          ? `You need ${(
              requiredXP - character.xp
            ).toLocaleString()} more XP to reach level ${nextLevel}.`
          : "You have reached the maximum level for this class."}
      </Typography>
    </Card>
  );
}
