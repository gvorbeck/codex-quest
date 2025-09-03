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
  abilities?: {
    dexterity?: {
      value: number;
      modifier: number;
    };
  };
  hp?: { current?: number; max?: number } | number;
  currentHp?: number;
  maxHp?: number;
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
  dexterity?: number | undefined; // DEX score for initiative calculation
  abilities?:
    | {
        dexterity?:
          | {
              value: number;
              modifier: number;
            }
          | undefined;
      }
    | undefined;
  currentHp?: number | undefined;
  maxHp?: number | undefined;
  hp?: { current?: number; max?: number } | number | undefined;
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
  // Clear any corrupted localStorage data on mount
  useEffect(() => {
    const keys = [
      `combat-tracker-${game?.id || "temp"}`,
      `pre-combat-initiatives-${game?.id || "temp"}`,
    ];

    keys.forEach((key) => {
      try {
        const item = localStorage.getItem(key);
        if (item && item.includes("undefined")) {
          console.log(`Clearing corrupted localStorage key: ${key}`);
          localStorage.removeItem(key);
        }
      } catch {
        console.log(`Clearing invalid localStorage key: ${key}`);
        localStorage.removeItem(key);
      }
    });
  }, [game?.id]);

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

  // Helper to update combat state - DISABLED to prevent conflicts
  const updateCombatState = useCallback((updates: Partial<CombatState>) => {
    console.log(
      `CombatTrackerModal.updateCombatState: DISABLED - use setCombatState directly`,
      updates
    );
    // DO NOT UPDATE - this was causing conflicts
    return;
  }, []);

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
          abilities: combatChar.abilities
            ? {
                dexterity: combatChar.abilities.dexterity,
              }
            : undefined,
          dexterity: combatChar.abilities?.dexterity?.value,
          hp: combatChar.hp,
          currentHp: combatChar.currentHp,
          maxHp: combatChar.maxHp,
        };
      });
  }, [playerCharacters, game]);

  // Store for pre-combat initiative values
  const [preCombatInitiatives, setPreCombatInitiatives] = useLocalStorage<
    Record<string, number>
  >(`pre-combat-initiatives-${game?.id || "temp"}`, {});

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
            abilities: combatChar.abilities
              ? {
                  dexterity: combatChar.abilities.dexterity,
                }
              : undefined,
            dexterity: combatChar.abilities?.dexterity?.value,
            hp: combatChar.hp,
            currentHp: combatChar.currentHp,
            maxHp: combatChar.maxHp,
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

  // Current combatants with stored pre-combat initiative values
  const currentCombatantsWithInitiative = useMemo(() => {
    return currentCombatants
      .map((combatant) => ({
        ...combatant,
        initiative: preCombatInitiatives[combatant.name] || 0,
        _sortId: Date.now() + Math.random(),
      }))
      .sort((a, b) => {
        if (b.initiative === a.initiative) {
          return (b._sortId || 0) - (a._sortId || 0);
        }
        return b.initiative - a.initiative;
      });
  }, [currentCombatants, preCombatInitiatives]);

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
        ...(player.abilities && { abilities: player.abilities }),
        ...(player.dexterity && { dexterity: player.dexterity }),
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
      // Use pre-combat initiative values if available, otherwise roll initiative
      const combatantsWithInitiative = currentCombatants.map((combatant) => {
        const preCombatInitiative = preCombatInitiatives[combatant.name] || 0;
        return {
          ...combatant,
          initiative:
            preCombatInitiative > 0
              ? preCombatInitiative
              : Math.floor(Math.random() * DICE_SIDES) + MIN_ROLL,
          _sortId: Date.now() + Math.random(), // Stable sort identifier
        };
      });

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
    preCombatInitiatives,
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

      setCombatState({
        ...combatState,
        combatants: sortedCombatants,
      });

      showInfo(`${combatant.name} rolled ${newInitiative} for initiative`, {
        title: "Initiative Roll",
      });
    },
    [combatants, combatState, showInfo, setCombatState]
  );

  // Performance optimizations - memoized computations
  const sortedCombatants = useMemo(() => {
    return [...combatants].sort((a, b) => {
      if (b.initiative === a.initiative) {
        return (b._sortId || 0) - (a._sortId || 0);
      }
      return b.initiative - a.initiative;
    });
  }, [combatants]);

  // Update pre-combat initiative for a specific combatant
  const updatePreCombatInitiative = useCallback(
    (combatant: CombatantWithInitiative, newInitiative: number) => {
      setPreCombatInitiatives({
        ...preCombatInitiatives,
        [combatant.name]: newInitiative,
      });
    },
    [preCombatInitiatives, setPreCombatInitiatives]
  );

  // Update HP for a specific combatant
  const updateCombatantHp = useCallback(
    (targetCombatant: CombatantWithInitiative, newHp: number) => {
      // Create updated combatants array by mapping over the existing array
      const updatedCombatants = combatants.map((combatant) => {
        // Match by _sortId if available (most reliable), otherwise by name and initiative
        const isMatch =
          (combatant._sortId &&
            targetCombatant._sortId &&
            combatant._sortId === targetCombatant._sortId) ||
          (combatant.name === targetCombatant.name &&
            combatant.initiative === targetCombatant.initiative);

        if (isMatch) {
          return {
            ...combatant,
            currentHp: newHp,
            hp:
              typeof combatant.hp === "object"
                ? { ...combatant.hp, current: newHp }
                : newHp,
          };
        }
        return combatant;
      });

      updateCombatState({ combatants: updatedCombatants });
    },
    [combatants, updateCombatState]
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
      setCombatState({
        ...combatState,
        currentTurn: 0,
        round: round + 1,
      });
      showInfo(`Round ${round + 1} begins!`, { title: "New Round" });
    } else {
      setCombatState({
        ...combatState,
        currentTurn: newTurn,
      });
    }

    const currentCombatant =
      combatants[newTurn >= combatants.length ? 0 : newTurn];
    showInfo(`${currentCombatant?.name}'s turn`, { title: "Turn Order" });
  }, [combatants, combatState, currentTurn, round, showInfo, setCombatState]);

  // End combat
  const endCombat = useCallback(() => {
    setCombatState({
      combatants: [],
      currentTurn: 0,
      round: 1,
      isActive: false,
    });
    showSuccess("Combat ended", { title: "Combat Complete" });
  }, [showSuccess, setCombatState]);

  const currentCombatant = useMemo(() => {
    return sortedCombatants[currentTurn];
  }, [sortedCombatants, currentTurn]);

  // Check if all combatants have initiative values > 0
  const allCombatantsHaveInitiative = useMemo(() => {
    return (
      combatants.length > 0 &&
      combatants.every((combatant) => combatant.initiative > 0)
    );
  }, [combatants]);

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
            if (allCombatantsHaveInitiative) {
              nextTurn();
            }
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
    combatants,
    currentTurn,
    allCombatantsHaveInitiative,
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
          allCombatantsHaveInitiative={allCombatantsHaveInitiative}
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
          <SectionWrapper title="Initiative Order">
            <div className="p-2">
              <InitiativeTable
                combatants={sortedCombatants}
                currentTurn={currentTurn}
                isCombatActive={isCombatActive}
                onUpdateInitiative={(targetCombatant, newInitiative) => {
                  console.log(`=== INITIATIVE UPDATE START ===`);
                  console.log(
                    `Target: ${targetCombatant.name} -> ${newInitiative}`
                  );
                  console.log(
                    `Current combatants:`,
                    combatants.map((c) => `${c.name}(${c.initiative})`)
                  );
                  console.log(
                    `InitiativeTable callback: ${targetCombatant.name} -> ${newInitiative}`
                  );

                  // Find the combatant in the original unsorted array and update it
                  const targetIndex = combatants.findIndex(
                    (c) => c.name === targetCombatant.name
                  );
                  if (targetIndex === -1) {
                    console.error(
                      `Could not find ${targetCombatant.name} in combatants array`
                    );
                    return;
                  }

                  const foundCombatant = combatants[targetIndex];
                  if (!foundCombatant) {
                    console.error(
                      `Combatant at index ${targetIndex} is undefined`
                    );
                    return;
                  }

                  // Create a clean updated combatant with all required properties
                  const updatedCombatant: CombatantWithInitiative = {
                    name: foundCombatant.name,
                    ac: foundCombatant.ac,
                    initiative: newInitiative,
                    isPlayer: foundCombatant.isPlayer ?? false,
                    _sortId: Date.now() + Math.random(),
                    // Only include optional properties if they exist
                    ...(foundCombatant.avatar && {
                      avatar: foundCombatant.avatar,
                    }),
                    ...(foundCombatant.dexterity && {
                      dexterity: foundCombatant.dexterity,
                    }),
                    ...(foundCombatant.abilities && {
                      abilities: foundCombatant.abilities,
                    }),
                    ...(foundCombatant.currentHp !== undefined && {
                      currentHp: foundCombatant.currentHp,
                    }),
                    ...(foundCombatant.maxHp !== undefined && {
                      maxHp: foundCombatant.maxHp,
                    }),
                    ...(foundCombatant.hp && { hp: foundCombatant.hp }),
                  };

                  const updatedCombatants = [...combatants];
                  updatedCombatants[targetIndex] = updatedCombatant;

                  console.log(
                    `Directly updating combat state for ${targetCombatant.name}`
                  );
                  console.log("Updated combatant:", updatedCombatant);

                  // Create a clean combat state with no undefined values
                  const newCombatState: CombatState = {
                    combatants: updatedCombatants,
                    currentTurn: combatState.currentTurn,
                    round: combatState.round,
                    isActive: combatState.isActive,
                  };

                  console.log("New combat state before setCombatState:", newCombatState);
                  setCombatState(newCombatState);
                  
                  // Force a sync check after state update
                  setTimeout(() => {
                    const storedState = localStorage.getItem(`combat-tracker-${game?.id || "temp"}`);
                    console.log("State after setCombatState - localStorage check:", storedState ? JSON.parse(storedState) : null);
                  }, 100);
                  
                  console.log(`=== INITIATIVE UPDATE END ===`);
                }}
                onSetCurrentTurn={(index) => {
                  console.log(`Setting current turn to ${index}`);
                  setCombatState({
                    ...combatState,
                    currentTurn: index,
                  });
                }}
                onUpdateHp={updateCombatantHp}
              />
            </div>
          </SectionWrapper>
        )}

        {/* Pre-Combat Initiative Setting */}
        {!isLoading &&
          !isCombatActive &&
          currentCombatants.length > 0 &&
          combatants.length === 0 && (
            <SectionWrapper
              title="Set Initiative (Optional)"
              collapsible
              collapsibleKey="pre-combat-initiative"
            >
              <div className="p-2">
                <div className="mb-3">
                  <Typography variant="bodySmall" color="secondary">
                    Set custom initiative values before starting combat, or
                    leave at 0 to auto-roll when combat begins.
                  </Typography>
                </div>
                <InitiativeTable
                  combatants={currentCombatantsWithInitiative}
                  currentTurn={-1}
                  isCombatActive={false}
                  onUpdateInitiative={updatePreCombatInitiative}
                  onSetCurrentTurn={() => {}} // No-op for pre-combat
                  onUpdateHp={() => {}} // No-op for pre-combat
                />
              </div>
            </SectionWrapper>
          )}

        {/* Current Combatants (before combat starts) */}
        {!isLoading && !isCombatActive && currentCombatants.length > 0 && (
          <SectionWrapper title="Combatants">
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
          <SectionWrapper title="Available Players">
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
