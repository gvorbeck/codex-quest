import { Button } from "@/components/ui/core/primitives";
import { Typography, Card } from "@/components/ui/core/display";

interface CombatControlsProps {
  isCombatActive: boolean;
  isLoading: boolean;
  currentCombatantsCount: number;
  currentCombatant?:
    | {
        name: string;
      }
    | undefined;
  round: number;
  allCombatantsHaveInitiative?: boolean;
  onStartCombat: () => void | Promise<void>;
  onNextTurn: () => void;
  onEndCombat: () => void;
}

export default function CombatControls({
  isCombatActive,
  isLoading,
  currentCombatantsCount,
  currentCombatant,
  round,
  allCombatantsHaveInitiative = true,
  onStartCombat,
  onNextTurn,
  onEndCombat,
}: CombatControlsProps) {
  return (
    <>
      <Card
        size="compact"
        variant="nested"
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          {!isCombatActive ? (
            <Button
              onClick={onStartCombat}
              disabled={
                isLoading ||
                currentCombatantsCount === 0 ||
                !allCombatantsHaveInitiative
              }
              variant="primary"
            >
              {isLoading ? "Initializing..." : "Start Combat"}
            </Button>
          ) : (
            <>
              <Button
                onClick={onNextTurn}
                variant="primary"
                disabled={!allCombatantsHaveInitiative}
              >
                Next Turn
              </Button>
              <Button onClick={onEndCombat} variant="secondary">
                End Combat
              </Button>
            </>
          )}
        </div>

        {isCombatActive && (
          <div className="text-right" role="status" aria-live="polite">
            <Typography variant="body" color="zinc" className="font-semibold">
              Round {round}
            </Typography>
            <Typography variant="bodySmall" color="secondary">
              {currentCombatant?.name}'s turn
            </Typography>
          </div>
        )}
      </Card>

      {isCombatActive && (
        <Typography variant="bodySmall" color="muted" className="mt-1">
          Shortcuts: Space (Next) • E (End)
        </Typography>
      )}
    </>
  );
}
