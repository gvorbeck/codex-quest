import { Card, Typography } from "@/components/ui/design-system";
import { Button } from "@/components/ui/inputs";
import { Icon, SectionHeader } from "@/components/ui";
import { useDiceRoll } from "@/hooks/useDiceRoll";

interface TurnUndeadSectionProps {
  className?: string;
}

export default function TurnUndeadSection({ className = "" }: TurnUndeadSectionProps) {
  const { rollAbility } = useDiceRoll();

  const handleTurnUndeadRoll = () => {
    rollAbility("Turn Undead", 0);
  };

  return (
    <section aria-labelledby="turn-undead-heading" className={className}>
      <SectionHeader
        title={
          <span className="flex items-center gap-2" id="turn-undead-heading">
            Turn Undead
          </span>
        }
        dotColor="bg-purple-400"
        extra={
          <Button
            size="sm"
            variant="secondary"
            onClick={handleTurnUndeadRoll}
          >
            <Icon name="dice" size="sm" />
            Roll d20
          </Button>
        }
        className="mb-4"
      />

      <Typography
        variant="caption"
        className="text-zinc-500 text-xs block mb-4"
      >
        Faith-based ability • Can retry if successful, but cannot retry for one full turn if failed
      </Typography>

      <Card variant="standard" className="p-4">
        <Typography variant="body" className="text-zinc-300">
          Clerics can Turn the undead, that is, drive away undead
          monsters by means of faith alone. The Cleric brandishes
          their holy symbol and calls upon the power of their divine
          patron. The player rolls 1d20 and tells the GM the result.
        </Typography>
      </Card>
    </section>
  );
}