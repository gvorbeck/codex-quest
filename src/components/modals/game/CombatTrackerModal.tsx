import { useState, useCallback, useMemo } from "react";
import { Modal } from "../base";
import { Typography } from "@/components/ui/design-system";
import { Button } from "@/components/ui/inputs";
import { LoadingState } from "@/components/ui/feedback";
import { StatCard, Icon } from "@/components/ui/display";
import { useLoadingState } from "@/hooks/useLoadingState";
import { useNotifications } from "@/hooks/useNotifications";
import { usePlayerCharacters } from "@/hooks/usePlayerCharacters";
import type { Game, GameCombatant } from "@/types/game";

interface CombatTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  game?: Game;
  onUpdateGame?: (updatedGame: Game) => void;
}

interface CombatantWithInitiative extends GameCombatant {
  initiative: number;
  isPlayer?: boolean;
}

export default function CombatTrackerModal({
  isOpen,
  onClose,
  game,
}: CombatTrackerModalProps) {
  const [combatants, setCombatants] = useState<CombatantWithInitiative[]>([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [round, setRound] = useState(1);
  const [isCombatActive, setIsCombatActive] = useState(false);

  // Hooks
  const { loading, withLoading } = useLoadingState();
  const { showSuccess, showError, showInfo } = useNotifications();
  const { playerCharacters, loading: charactersLoading } = usePlayerCharacters(
    game || ({} as Game)
  );

  // Combine player characters and NPCs into combat-ready list
  const allCombatants = useMemo(() => {
    if (!game) return [];

    const players: CombatantWithInitiative[] = playerCharacters.map((char) => {
      const basePlayer = {
        name: char.name,
        ac: (char["ac"] as number) || 10,
        initiative: 0,
        isPlayer: true as const,
      };

      const avatar = char["avatar"] as string | undefined;
      return avatar ? { ...basePlayer, avatar } : basePlayer;
    });

    const npcs: CombatantWithInitiative[] = (game.combatants || []).map(
      (combatant) => ({
        ...combatant,
        ac: combatant.ac || 11,
        initiative: 0,
        isPlayer: false,
      })
    );

    return [...players, ...npcs];
  }, [playerCharacters, game]);

  // Initialize combat with all combatants
  const initializeCombat = useCallback(async () => {
    if (!game || allCombatants.length === 0) {
      showError("No combatants available to start combat");
      return;
    }

    await withLoading(async () => {
      // Roll initiative for all combatants
      const combatantsWithInitiative = allCombatants.map((combatant) => ({
        ...combatant,
        initiative: Math.floor(Math.random() * 20) + 1, // Simple d20 roll
      }));

      // Sort by initiative (descending)
      const sortedCombatants = combatantsWithInitiative.sort(
        (a, b) => b.initiative - a.initiative
      );

      setCombatants(sortedCombatants);
      setCurrentTurn(0);
      setRound(1);
      setIsCombatActive(true);

      showSuccess(
        `Combat initialized! ${sortedCombatants.length} combatants ready.`,
        {
          title: "Combat Started",
        }
      );
    });
  }, [game, allCombatants, withLoading, showSuccess, showError]);

  // Roll initiative for a specific combatant
  const rollInitiativeFor = useCallback(
    (combatantIndex: number) => {
      const combatant = combatants[combatantIndex];
      if (!combatant) return;

      const newInitiative = Math.floor(Math.random() * 20) + 1;
      const updatedCombatants = [...combatants];
      updatedCombatants[combatantIndex] = {
        ...combatant,
        initiative: newInitiative,
      };

      // Re-sort by initiative
      const sortedCombatants = updatedCombatants.sort(
        (a, b) => b.initiative - a.initiative
      );
      setCombatants(sortedCombatants);

      showInfo(`${combatant.name} rolled ${newInitiative} for initiative`, {
        title: "Initiative Roll",
      });
    },
    [combatants, showInfo]
  );

  // Next turn
  const nextTurn = useCallback(() => {
    if (combatants.length === 0) return;

    const newTurn = currentTurn + 1;
    if (newTurn >= combatants.length) {
      setCurrentTurn(0);
      setRound((prev) => prev + 1);
      showInfo(`Round ${round + 1} begins!`, { title: "New Round" });
    } else {
      setCurrentTurn(newTurn);
    }

    const currentCombatant =
      combatants[newTurn >= combatants.length ? 0 : newTurn];
    showInfo(`${currentCombatant?.name}'s turn`, { title: "Turn Order" });
  }, [combatants, currentTurn, round, showInfo]);

  // End combat
  const endCombat = useCallback(() => {
    setCombatants([]);
    setCurrentTurn(0);
    setRound(1);
    setIsCombatActive(false);
    showSuccess("Combat ended", { title: "Combat Complete" });
  }, [showSuccess]);

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
      <div className="space-y-6">
        {/* Combat Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!isCombatActive ? (
              <Button
                onClick={initializeCombat}
                disabled={
                  loading || charactersLoading || allCombatants.length === 0
                }
                variant="primary"
              >
                {loading ? "Initializing..." : "Start Combat"}
              </Button>
            ) : (
              <>
                <Button onClick={nextTurn} variant="primary">
                  Next Turn
                </Button>
                <Button onClick={endCombat} variant="secondary">
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
                {combatants[currentTurn]?.name}'s turn
              </Typography>
            </div>
          )}
        </div>

        {/* Loading State */}
        {(loading || charactersLoading) && (
          <LoadingState message="Loading combat data..." />
        )}

        {/* No Combatants */}
        {!loading && !charactersLoading && allCombatants.length === 0 && (
          <div className="text-center py-8" role="status">
            <Typography variant="body" color="secondary">
              No players or combatants available for combat.
            </Typography>
            <Typography variant="bodySmall" color="muted" className="mt-2">
              Add players to the game or define combatants to begin combat.
            </Typography>
          </div>
        )}

        {/* Combatants List */}
        {!loading && !charactersLoading && combatants.length > 0 && (
          <div
            className="space-y-3"
            role="region"
            aria-labelledby="initiative-order"
          >
            <Typography variant="h6" id="initiative-order" color="zinc">
              Initiative Order
            </Typography>
            {combatants.map((combatant, index) => (
              <div
                key={`${combatant.name}-${index}`}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  index === currentTurn && isCombatActive
                    ? "border-amber-500 bg-amber-900/20"
                    : "border-zinc-600 bg-zinc-800/50"
                }`}
                role="listitem"
                aria-label={`${combatant.name}, ${
                  combatant.isPlayer ? "Player" : "NPC"
                }, AC ${combatant.ac}, Initiative ${combatant.initiative}${
                  index === currentTurn && isCombatActive
                    ? ", Current turn"
                    : ""
                }`}
                aria-current={
                  index === currentTurn && isCombatActive ? "true" : "false"
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {combatant.avatar &&
                      typeof combatant.avatar === "string" && (
                        <img
                          src={combatant.avatar}
                          alt={`${combatant.name} avatar`}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                    <div>
                      <Typography
                        variant="body"
                        color="zinc"
                        className="font-medium"
                      >
                        {combatant.name}
                        {combatant.isPlayer && (
                          <span
                            className="ml-2 text-xs text-amber-400 font-semibold"
                            aria-label="Player character"
                          >
                            PLAYER
                          </span>
                        )}
                        {index === currentTurn && isCombatActive && (
                          <span
                            className="ml-2 text-xs text-lime-400 font-semibold"
                            aria-label="Current turn"
                          >
                            ACTIVE
                          </span>
                        )}
                      </Typography>
                      <Typography
                        variant="bodySmall"
                        color="secondary"
                        aria-label={`Armor class ${combatant.ac}`}
                      >
                        AC {combatant.ac}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatCard
                      label="Initiative"
                      value={combatant.initiative.toString()}
                      size="sm"
                    />
                    <Button
                      onClick={() => rollInitiativeFor(index)}
                      variant="ghost"
                      size="sm"
                      disabled={!isCombatActive}
                      aria-label={`Re-roll initiative for ${combatant.name}`}
                    >
                      <Icon name="dice" size="sm" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Available Combatants (before combat starts) */}
        {!loading &&
          !charactersLoading &&
          !isCombatActive &&
          allCombatants.length > 0 && (
            <div
              className="space-y-3"
              role="region"
              aria-labelledby="available-combatants"
            >
              <Typography variant="h6" id="available-combatants" color="zinc">
                Available Combatants
              </Typography>
              {allCombatants.map((combatant, index) => (
                <div
                  key={`${combatant.name}-${index}`}
                  className="p-3 rounded-lg border border-zinc-600 bg-zinc-800/30"
                  role="listitem"
                  aria-label={`${combatant.name}, ${
                    combatant.isPlayer ? "Player" : "NPC"
                  }, AC ${combatant.ac}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {combatant.avatar &&
                        typeof combatant.avatar === "string" && (
                          <img
                            src={combatant.avatar}
                            alt={`${combatant.name} avatar`}
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                      <Typography variant="body" color="zinc">
                        {combatant.name}
                        {combatant.isPlayer && (
                          <span
                            className="ml-2 text-xs text-amber-400 font-semibold"
                            aria-label="Player character"
                          >
                            PLAYER
                          </span>
                        )}
                      </Typography>
                    </div>
                    <Typography
                      variant="bodySmall"
                      color="secondary"
                      aria-label={`Armor class ${combatant.ac}`}
                    >
                      AC {combatant.ac}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </Modal>
  );
}
