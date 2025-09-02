import { useCallback, useMemo, useEffect } from "react";
import { Modal } from "../base";
import { Typography } from "@/components/ui/design-system";
import { Button } from "@/components/ui/inputs";
import { LoadingState } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/display";
import { SectionWrapper } from "@/components/ui/layout";
import { useLoadingState } from "@/hooks/useLoadingState";
import { useNotifications } from "@/hooks/useNotifications";
import { usePlayerCharacters } from "@/hooks/usePlayerCharacters";
import { useLocalStorage } from "@/hooks";
import { calculateArmorClass } from "@/utils/characterCalculations";
import CombatControls from "./combat/CombatControls";
import InitiativeTable from "./combat/InitiativeTable";
import type { Game, GameCombatant } from "@/types/game";

// Combat-specific character data interface
interface CombatCharacterData {
  id: string;
  name: string;
  ac?: number;
  armorClass?: number;
  avatar?: string;
  equipment?: Array<{
    name: string;
    wearing?: boolean;
    AC?: number;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

interface CombatTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  game?: Game;
  onUpdateGame?: (updatedGame: Game) => void;
}

interface CombatantWithInitiative extends GameCombatant {
  initiative: number;
  isPlayer?: boolean;
  _sortId?: number; // For stable sorting
}

// Constants for magic numbers
const DICE_SIDES = 20;
const MIN_ROLL = 1;

// Combat state interface for persistence
interface CombatState {
  combatants: CombatantWithInitiative[];
  currentTurn: number;
  round: number;
  isActive: boolean;
}

// Error Fallback Component
function CombatErrorFallback({
  error,
  resetError,
}: {
  error: Error;
  resetError: () => void;
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
      <Button onClick={resetError} variant="primary">
        Reset Combat Tracker
      </Button>
    </div>
  );
}

export default function CombatTrackerModal({
  isOpen,
  onClose,
  game,
  onUpdateGame,
}: CombatTrackerModalProps) {
  // Persistent combat state
  const [combatState, setCombatState] = useLocalStorage<CombatState>(
    `combat-tracker-${game?.id || "temp"}`,
    {
      combatants: [],
      currentTurn: 0,
      round: 1,
      isActive: false,
    }
  );

  // Extract state for easier access
  const {
    combatants,
    currentTurn,
    round,
    isActive: isCombatActive,
  } = combatState;

  // Helper to update combat state
  const updateCombatState = useCallback(
    (updates: Partial<CombatState>) => {
      const newState = { ...combatState, ...updates };
      setCombatState(newState);
    },
    [combatState, setCombatState]
  );

  // Hooks
  const { loading, withLoading } = useLoadingState();
  const { showSuccess, showError, showInfo } = useNotifications();
  const { playerCharacters, loading: charactersLoading } = usePlayerCharacters(
    game || ({} as Game)
  );

  // Get available players (not yet added to combat)
  const availablePlayers = useMemo(() => {
    const playersInCombat = new Set(
      (game?.combatants || [])
        .filter((combatant) => combatant["isPlayer"])
        .map((combatant) => combatant.name)
    );

    return playerCharacters
      .filter((char) => !playersInCombat.has(char.name))
      .map((char) => {
        const combatChar = char as CombatCharacterData;
        const avatar = combatChar.avatar;

        // First try direct AC properties that might be pre-calculated
        let playerAC = combatChar.ac || combatChar.armorClass;

        // If no direct AC, try to calculate from equipment
        if (!playerAC || typeof playerAC !== "number") {
          playerAC = calculateArmorClass(combatChar);
        }

        // Ensure we have a valid number
        const finalAC = typeof playerAC === "number" ? playerAC : 10;

        return {
          name: char.name,
          ac: finalAC,
          initiative: 0,
          isPlayer: true as const,
          avatar,
        };
      });
  }, [playerCharacters, game]);

  // Get current combatants (monsters and players added to combat)
  const currentCombatants = useMemo(() => {
    if (!game) return [];

    return (game.combatants || []).map((combatant) => {
      // If this is a player, try to get their actual AC from character data
      if (combatant["isPlayer"]) {
        const playerChar = playerCharacters.find(
          (char) => char.name === combatant.name
        );
        if (playerChar) {
          const combatChar = playerChar as CombatCharacterData;

          // First try direct AC properties that might be pre-calculated
          let playerAC = combatChar.ac || combatChar.armorClass;

          // If no direct AC, try to calculate from equipment
          if (!playerAC || typeof playerAC !== "number") {
            playerAC = calculateArmorClass(combatChar);
          }

          // Ensure we have a valid number
          const finalAC =
            typeof playerAC === "number" ? playerAC : combatant.ac || 11;

          return {
            ...combatant,
            ac: finalAC,
            initiative: 0,
            isPlayer: true,
          };
        }
      }

      return {
        ...combatant,
        ac: combatant.ac || 11,
        initiative: 0,
        isPlayer: Boolean(combatant["isPlayer"]),
      };
    });
  }, [game, playerCharacters]);

  // Add player to combat
  const addPlayerToCombat = useCallback(
    (player: CombatantWithInitiative) => {
      if (!game || !onUpdateGame) return;

      const newCombatant: GameCombatant = {
        name: player.name,
        ac: player.ac,
        initiative: 0,
        ...(player.avatar && { avatar: player.avatar }),
        isPlayer: true,
      };

      const updatedCombatants = [...(game.combatants || []), newCombatant];
      const updatedGame = {
        ...game,
        combatants: updatedCombatants,
      };

      onUpdateGame(updatedGame);
      showSuccess(`${player.name} added to combat`, {
        title: "Player Added",
      });
    },
    [game, onUpdateGame, showSuccess]
  );

  // Remove combatant from combat
  const removeCombatant = useCallback(
    (combatantIndex: number) => {
      if (!game || !onUpdateGame) return;

      const combatantToRemove = currentCombatants[combatantIndex];
      if (!combatantToRemove) return;

      const updatedCombatants = (game.combatants || []).filter(
        (_, index) => index !== combatantIndex
      );
      const updatedGame = {
        ...game,
        combatants: updatedCombatants,
      };

      onUpdateGame(updatedGame);
      showSuccess(`${combatantToRemove.name} removed from combat`, {
        title: "Combatant Removed",
      });
    },
    [game, onUpdateGame, currentCombatants, showSuccess]
  );

  // Initialize combat with all combatants
  const initializeCombat = useCallback(async () => {
    if (!game || currentCombatants.length === 0) {
      showError("No combatants available to start combat");
      return;
    }

    await withLoading(async () => {
      // Roll initiative for all combatants
      const combatantsWithInitiative = currentCombatants.map((combatant) => ({
        ...combatant,
        initiative: Math.floor(Math.random() * DICE_SIDES) + MIN_ROLL,
        _sortId: Date.now() + Math.random(), // Stable sort identifier
      }));

      // Sort by initiative (descending)
      const sortedCombatants = combatantsWithInitiative.sort((a, b) => {
        if (b.initiative === a.initiative) {
          return (b._sortId || 0) - (a._sortId || 0);
        }
        return b.initiative - a.initiative;
      });

      updateCombatState({
        combatants: sortedCombatants,
        currentTurn: 0,
        round: 1,
        isActive: true,
      });

      showSuccess(
        `Combat initialized! ${sortedCombatants.length} combatants ready.`,
        {
          title: "Combat Started",
        }
      );
    });
  }, [
    game,
    currentCombatants,
    withLoading,
    showSuccess,
    showError,
    updateCombatState,
  ]);

  // Roll initiative for a specific combatant
  const rollInitiativeFor = useCallback(
    (combatantIndex: number) => {
      const combatant = combatants[combatantIndex];
      if (!combatant) return;

      const newInitiative = Math.floor(Math.random() * DICE_SIDES) + MIN_ROLL;
      const updatedCombatants = [...combatants];
      updatedCombatants[combatantIndex] = {
        ...combatant,
        initiative: newInitiative,
        _sortId: Date.now() + Math.random(), // New sort ID for stable sorting
      };

      // Re-sort by initiative with stable sorting
      const sortedCombatants = updatedCombatants.sort((a, b) => {
        if (b.initiative === a.initiative) {
          return (b._sortId || 0) - (a._sortId || 0);
        }
        return b.initiative - a.initiative;
      });

      updateCombatState({ combatants: sortedCombatants });

      showInfo(`${combatant.name} rolled ${newInitiative} for initiative`, {
        title: "Initiative Roll",
      });
    },
    [combatants, showInfo, updateCombatState]
  );

  // Combatant Card Component for non-combat sections
  const CombatantCard = useCallback(
    ({
      combatant,
      index,
      variant,
      onAction,
      isActive = false,
    }: {
      combatant: CombatantWithInitiative;
      index: number;
      variant: "combat" | "available";
      onAction?: (action: string, index: number) => void;
      isActive?: boolean;
    }) => (
      <div
        className={`p-3 rounded-lg border transition-all duration-200 ${
          isActive
            ? "border-amber-500 bg-amber-900/20"
            : "border-zinc-600 bg-zinc-800/30 hover:border-zinc-500"
        }`}
        role="listitem"
        aria-label={`${combatant.name}, ${
          combatant.isPlayer ? "Player" : "Monster"
        }, AC ${combatant.ac}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {combatant.avatar && typeof combatant.avatar === "string" && (
              <img
                src={combatant.avatar}
                alt={`${combatant.name} avatar`}
                className="w-6 h-6 rounded-full"
              />
            )}
            <div>
              <Typography variant="body" color="zinc">
                {combatant.name}
                {combatant.isPlayer && (
                  <span className="ml-2 text-xs text-amber-400 font-semibold">
                    PLAYER
                  </span>
                )}
              </Typography>
              <Typography variant="bodySmall" color="secondary">
                AC {combatant.ac}
              </Typography>
            </div>
          </div>
          {variant === "combat" ? (
            <Button
              onClick={() => onAction?.("remove", index)}
              variant="destructive"
              size="sm"
              aria-label={`Remove ${combatant.name} from combat`}
            >
              <Icon name="trash" size="sm" />
            </Button>
          ) : (
            <Button
              onClick={() => onAction?.("add", index)}
              variant="primary"
              size="sm"
              aria-label={`Add ${combatant.name} to combat`}
            >
              Add to Combat
            </Button>
          )}
        </div>
      </div>
    ),
    []
  );

  // Next turn
  const nextTurn = useCallback(() => {
    if (combatants.length === 0) return;

    const newTurn = currentTurn + 1;
    if (newTurn >= combatants.length) {
      updateCombatState({
        currentTurn: 0,
        round: round + 1,
      });
      showInfo(`Round ${round + 1} begins!`, { title: "New Round" });
    } else {
      updateCombatState({ currentTurn: newTurn });
    }

    const currentCombatant =
      combatants[newTurn >= combatants.length ? 0 : newTurn];
    showInfo(`${currentCombatant?.name}'s turn`, { title: "Turn Order" });
  }, [combatants, currentTurn, round, showInfo, updateCombatState]);

  // End combat
  const endCombat = useCallback(() => {
    updateCombatState({
      combatants: [],
      currentTurn: 0,
      round: 1,
      isActive: false,
    });
    showSuccess("Combat ended", { title: "Combat Complete" });
  }, [showSuccess, updateCombatState]);

  // Performance optimizations - memoized computations
  const sortedCombatants = useMemo(() => {
    return [...combatants].sort((a, b) => {
      if (b.initiative === a.initiative) {
        return (b._sortId || 0) - (a._sortId || 0);
      }
      return b.initiative - a.initiative;
    });
  }, [combatants]);

  const currentCombatant = useMemo(() => {
    return sortedCombatants[currentTurn];
  }, [sortedCombatants, currentTurn]);

  // Loading state consolidation
  const isLoading = loading || charactersLoading;

  // Keyboard shortcuts for common combat actions
  useEffect(() => {
    if (!isOpen || !isCombatActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Use Space and Arrow keys instead of Cmd/Ctrl shortcuts to avoid browser conflicts
      if (!event.ctrlKey && !event.metaKey && !event.altKey) {
        switch (event.key.toLowerCase()) {
          case " ": // Spacebar for next turn
            event.preventDefault();
            nextTurn();
            break;
          case "r": // R key for reroll current combatant's initiative
            event.preventDefault();
            if (combatants[currentTurn]) {
              rollInitiativeFor(currentTurn);
            }
            break;
          case "e": // E key for end combat
            event.preventDefault();
            endCombat();
            break;
          case "arrowright": // Right arrow for next turn (alternative)
            event.preventDefault();
            nextTurn();
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    isOpen,
    isCombatActive,
    combatants,
    currentTurn,
    nextTurn,
    rollInitiativeFor,
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
          isLoading={isLoading}
          currentCombatantsCount={currentCombatants.length}
          currentCombatant={
            currentCombatant ? { name: currentCombatant.name } : undefined
          }
          round={round}
          onStartCombat={initializeCombat}
          onNextTurn={nextTurn}
          onEndCombat={endCombat}
        />

        {/* Loading State */}
        {isLoading && <LoadingState message="Loading combat data..." />}

        {/* No Combatants */}
        {!isLoading && currentCombatants.length === 0 && (
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
        {!isLoading && combatants.length > 0 && (
          <SectionWrapper
            title="Initiative Order"
            collapsible
            collapsibleKey="combat-initiative"
          >
            <div className="p-3">
              <InitiativeTable
                combatants={combatants}
                currentTurn={currentTurn}
                isCombatActive={isCombatActive}
                onRerollInitiative={rollInitiativeFor}
                onSetCurrentTurn={(index) =>
                  updateCombatState({ currentTurn: index })
                }
              />
              {isCombatActive && currentCombatant && (
                <div className="mt-4 p-3 bg-amber-900/20 border border-amber-500 rounded-lg">
                  <Typography
                    variant="body"
                    color="amber"
                    className="font-semibold"
                  >
                    Current Turn: {currentCombatant.name} (Round {round})
                  </Typography>
                  <Typography
                    variant="bodySmall"
                    color="amber"
                    className="mt-1"
                  >
                    Initiative: {currentCombatant.initiative} • AC:{" "}
                    {currentCombatant.ac}
                  </Typography>
                </div>
              )}
            </div>
          </SectionWrapper>
        )}

        {/* Current Combatants (before combat starts) */}
        {!isLoading && !isCombatActive && currentCombatants.length > 0 && (
          <SectionWrapper
            title="Combatants"
            collapsible
            collapsibleKey="current-combatants"
          >
            <div className="space-y-3 p-3">
              {currentCombatants.map((combatant, index) => (
                <CombatantCard
                  key={`${combatant.name}-${index}`}
                  combatant={combatant}
                  index={index}
                  variant="combat"
                  onAction={(action, idx) => {
                    if (action === "remove") {
                      removeCombatant(idx);
                    }
                  }}
                />
              ))}
            </div>
          </SectionWrapper>
        )}

        {/* Available Players (before combat starts) */}
        {!isLoading && !isCombatActive && availablePlayers.length > 0 && (
          <SectionWrapper
            title="Available Players"
            collapsible
            collapsibleKey="available-players"
          >
            <div className="space-y-3 p-3">
              {availablePlayers.map((player, index) => (
                <CombatantCard
                  key={`${player.name}-${index}`}
                  combatant={
                    {
                      ...player,
                      avatar: player.avatar || undefined,
                    } as CombatantWithInitiative
                  }
                  index={index}
                  variant="available"
                  onAction={(action, idx) => {
                    if (action === "add") {
                      const playerToAdd = availablePlayers[idx];
                      if (playerToAdd) {
                        addPlayerToCombat({
                          name: playerToAdd.name,
                          ac: playerToAdd.ac,
                          initiative: playerToAdd.initiative,
                          isPlayer: playerToAdd.isPlayer,
                          ...(playerToAdd.avatar && {
                            avatar: playerToAdd.avatar,
                          }),
                        });
                      }
                    }
                  }}
                />
              ))}
            </div>
          </SectionWrapper>
        )}
      </div>
    </Modal>
  );
}

// Export the error fallback component for external error boundary usage
export { CombatErrorFallback };
