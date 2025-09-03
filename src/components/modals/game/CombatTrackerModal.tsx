import { useEffect } from "react";
import { Modal } from "../base";
import { Typography } from "@/components/ui/design-system";
import { LoadingState } from "@/components/ui/feedback";
import { SectionWrapper } from "@/components/ui/layout";
import { useLoadingState } from "@/hooks/useLoadingState";
import { useCombatLogic } from "@/hooks/useCombatLogic";
import { sortCombatantsByInitiative } from "@/utils/combatUtils";
import CombatControls from "./combat/CombatControls";
import InitiativeTable from "./combat/InitiativeTable";
import PreCombatInitiativeSection from "./combat/PreCombatInitiativeSection";
import CombatantsList from "./combat/CombatantsList";
import type { Game } from "@/types/game";

interface CombatTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  game?: Game;
  onUpdateGame?: (updatedGame: Game) => void;
}

// Error Fallback Component
function CombatErrorFallback({
  error,
}: {
  error: Error;
}) {
  return (
    <div className="text-center py-8">
      <Typography variant="h6" color="zinc" className="mb-4 text-red-400">
        Combat Tracker Error
      </Typography>
      <Typography variant="body" color="muted" className="mb-4">
        Something went wrong with the combat tracker. This is usually due to
        corrupted combat state.
      </Typography>
      <Typography variant="bodySmall" color="muted" className="mb-6">
        Error: {error.message}
      </Typography>
    </div>
  );
}

export default function CombatTrackerModal({
  isOpen,
  onClose,
  game,
  onUpdateGame,
}: CombatTrackerModalProps) {
  // All combat logic is now handled by the custom hook
  const {
    combatants,
    currentTurn,
    round,
    isCombatActive,
    currentCombatant,
    allCombatantsHaveInitiative,
    availablePlayers,
    currentCombatants,
    currentCombatantsWithInitiative,
    addPlayerToCombat,
    removeCombatant,
    initializeCombat,
    updatePreCombatInitiative,
    updateInitiative,
    updateCombatantHp,
    setCurrentTurn,
    nextTurn,
    endCombat,
  } = useCombatLogic(game, onUpdateGame);

  const { loading } = useLoadingState();

  // Keyboard shortcuts for common combat actions
  useEffect(() => {
    if (!isOpen || !isCombatActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Use Space and Arrow keys instead of Cmd/Ctrl shortcuts to avoid browser conflicts
      if (!event.ctrlKey && !event.metaKey && !event.altKey) {
        switch (event.key.toLowerCase()) {
          case " ": // Spacebar for next turn
            event.preventDefault();
            if (allCombatantsHaveInitiative) {
              nextTurn();
            }
            break;
          case "e": // E key for end combat
            event.preventDefault();
            endCombat();
            break;
          case "arrowright": // Right arrow for next turn (alternative)
            event.preventDefault();
            if (allCombatantsHaveInitiative) {
              nextTurn();
            }
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    isOpen,
    isCombatActive,
    allCombatantsHaveInitiative,
    nextTurn,
    endCombat,
  ]);

  if (!game) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Combat Tracker" size="lg">
        <div className="text-center py-8">
          <Typography variant="body" color="muted">
            No game data available for combat tracking.
          </Typography>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Combat Tracker - ${game.name}`}
      size="lg"
    >
      <div className="space-y-6 p-2">
        {/* Combat Controls */}
        <CombatControls
          isCombatActive={isCombatActive}
          isLoading={loading}
          currentCombatantsCount={currentCombatants.length}
          currentCombatant={
            currentCombatant ? { name: currentCombatant.name } : undefined
          }
          round={round}
          allCombatantsHaveInitiative={allCombatantsHaveInitiative}
          onStartCombat={initializeCombat}
          onNextTurn={nextTurn}
          onEndCombat={endCombat}
        />

        {/* Loading State */}
        {loading && <LoadingState message="Loading combat data..." />}

        {/* No Combatants */}
        {!loading && currentCombatants.length === 0 && (
          <div className="text-center py-8" role="status">
            <Typography variant="body" color="secondary">
              No combatants available for combat.
            </Typography>
            <Typography variant="bodySmall" color="muted" className="mt-2">
              Add monsters from the Bestiary or players from below to begin
              combat.
            </Typography>
          </div>
        )}

        {/* Initiative Order with Table */}
        {!loading && combatants.length > 0 && (
          <SectionWrapper title="Initiative Order">
            <div className="p-2">
              <InitiativeTable
                combatants={sortCombatantsByInitiative(combatants)}
                currentTurn={currentTurn}
                isCombatActive={isCombatActive}
                onUpdateInitiative={updateInitiative}
                onSetCurrentTurn={setCurrentTurn}
                onUpdateHp={updateCombatantHp}
              />
            </div>
          </SectionWrapper>
        )}

        {/* Pre-Combat Initiative Setting */}
        {!loading &&
          !isCombatActive &&
          currentCombatants.length > 0 &&
          combatants.length === 0 && (
            <PreCombatInitiativeSection
              combatants={currentCombatantsWithInitiative}
              onUpdateInitiative={updatePreCombatInitiative}
            />
          )}

        {/* Current Combatants (before combat starts) */}
        {!loading && !isCombatActive && currentCombatants.length > 0 && (
          <CombatantsList
            title="Combatants"
            combatants={currentCombatants}
            variant="combat"
            onAction={(action, index) => {
              if (action === "remove") {
                removeCombatant(index);
              }
            }}
          />
        )}

        {/* Available Players (before combat starts) */}
        {!loading && !isCombatActive && availablePlayers.length > 0 && (
          <CombatantsList
            title="Available Players"
            combatants={availablePlayers}
            variant="available"
            onAction={(action, index) => {
              if (action === "add") {
                const playerToAdd = availablePlayers[index];
                if (playerToAdd) {
                  addPlayerToCombat(playerToAdd);
                }
              }
            }}
          />
        )}
      </div>
    </Modal>
  );
}

// Export the error fallback component for external error boundary usage
export { CombatErrorFallback };