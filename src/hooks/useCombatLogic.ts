import { useCallback, useMemo, useEffect } from "react";
import {
  usePlayerCharacters,
  useNotifications,
  useLocalStorage,
} from "@/hooks";
import type {
  CombatantWithInitiative,
  Game,
  GameCombatant,
  CombatCharacterData,
} from "@/types";
import {
  calculateArmorClass,
  clearCorruptedCombatData,
  normalizeCombatantHP,
  rollInitiative,
  sortCombatantsByInitiative,
} from "@/utils";

// Combat state interface for persistence
interface CombatState {
  combatants: CombatantWithInitiative[];
  currentTurn: number;
  round: number;
  isActive: boolean;
}

export function useCombatLogic(
  game?: Game,
  onUpdateGame?: (updatedGame: Game) => void
) {
  const { showSuccess, showError, showInfo } = useNotifications();
  const { playerCharacters } = usePlayerCharacters(game || ({} as Game));

  // Clear corrupted data on mount
  useEffect(() => {
    if (game?.id) {
      clearCorruptedCombatData(game.id);
    }
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

  // Store for pre-combat initiative values
  const [preCombatInitiatives, setPreCombatInitiatives] = useLocalStorage<
    Record<string, number>
  >(`pre-combat-initiatives-${game?.id || "temp"}`, {});

  // Extract state for easier access
  const {
    combatants,
    currentTurn,
    round,
    isActive: isCombatActive,
  } = combatState;

  // Get available players (not yet added to combat)
  const availablePlayers = useMemo(() => {
    if (!game) return [];

    const playersInCombat = new Set(
      (game.combatants || [])
        .filter((combatant) => combatant["isPlayer"])
        .map((combatant) => combatant.name)
    );

    return playerCharacters
      .filter((char) => !playersInCombat.has(char.name))
      .map((char) => {
        const combatChar = char as CombatCharacterData;

        return {
          name: char.name,
          ac: calculateArmorClass(combatChar),
          initiative: 0,
          isPlayer: true,
          _sortId: Date.now() + Math.random(),
          dexModifier: combatChar.abilities?.dexterity?.modifier ?? 0,
          hp: normalizeCombatantHP(combatChar),
          avatar: combatChar.avatar,
        } as CombatantWithInitiative;
      });
  }, [playerCharacters, game]);

  // Get current combatants (monsters and players added to combat)
  const currentCombatants = useMemo(() => {
    if (!game) return [];

    return (game.combatants || []).map((combatant) => {
      // If this is a player, try to get their actual data from character data
      if (combatant["isPlayer"]) {
        const playerChar = playerCharacters.find(
          (char) => char.name === combatant.name
        );
        if (playerChar) {
          const combatChar = playerChar as CombatCharacterData;

          return {
            name: combatant.name,
            ac: calculateArmorClass(combatChar),
            initiative: 0,
            isPlayer: true,
            _sortId: Date.now() + Math.random(),
            dexModifier: combatChar.abilities?.dexterity?.modifier ?? 0,
            hp: normalizeCombatantHP(combatChar),
            avatar: combatChar.avatar,
          } as CombatantWithInitiative;
        }
      }

      return {
        name: combatant.name,
        ac: combatant.ac || 11,
        initiative: 0,
        isPlayer: Boolean(combatant["isPlayer"]),
        _sortId: Date.now() + Math.random(),
        dexModifier: 0, // Default for monsters unless specified
        hp: { current: 10, max: 10 }, // Default HP for monsters
        avatar: combatant.avatar,
      } as CombatantWithInitiative;
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
          return b._sortId - a._sortId;
        }
        return b.initiative - a.initiative;
      });
  }, [currentCombatants, preCombatInitiatives]);

  // Current combatant in turn order
  const currentCombatant = useMemo(() => {
    const sorted = sortCombatantsByInitiative(combatants);
    return sorted[currentTurn];
  }, [combatants, currentTurn]);

  // Check if all combatants have initiative values > 0
  const allCombatantsHaveInitiative = useMemo(() => {
    if (isCombatActive) {
      // During combat, check the active combatants
      return (
        combatants.length > 0 &&
        combatants.every((combatant) => combatant.initiative > 0)
      );
    } else {
      // Before combat, check if all current combatants have pre-combat initiative set
      return (
        currentCombatants.length > 0 &&
        currentCombatants.every((combatant) => {
          const preCombatInitiative = preCombatInitiatives[combatant.name] || 0;
          return preCombatInitiative > 0;
        })
      );
    }
  }, [combatants, currentCombatants, preCombatInitiatives, isCombatActive]);

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

      // Remove the combatant's initiative value from pre-combat storage
      const updatedPreCombatInitiatives = { ...preCombatInitiatives };
      delete updatedPreCombatInitiatives[combatantToRemove.name];
      setPreCombatInitiatives(updatedPreCombatInitiatives);

      onUpdateGame(updatedGame);
      showSuccess(`${combatantToRemove.name} removed from combat`, {
        title: "Combatant Removed",
      });
    },
    [
      game,
      onUpdateGame,
      currentCombatants,
      preCombatInitiatives,
      setPreCombatInitiatives,
      showSuccess,
    ]
  );

  // Initialize combat with all combatants
  const initializeCombat = useCallback(() => {
    if (!game || currentCombatants.length === 0) {
      showError("No combatants available to start combat");
      return;
    }

    // Use pre-combat initiative values if available, otherwise roll initiative
    const combatantsWithInitiative = currentCombatants.map((combatant) => {
      const preCombatInitiative = preCombatInitiatives[combatant.name] || 0;
      return {
        ...combatant,
        initiative:
          preCombatInitiative > 0 ? preCombatInitiative : rollInitiative(),
        _sortId: Date.now() + Math.random(), // Stable sort identifier
      };
    });

    // Sort by initiative (descending)
    const sortedCombatants = sortCombatantsByInitiative(
      combatantsWithInitiative
    );

    setCombatState({
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
  }, [
    game,
    currentCombatants,
    preCombatInitiatives,
    showSuccess,
    showError,
    setCombatState,
  ]);

  // Roll initiative for a specific combatant
  const rollInitiativeFor = useCallback(
    (combatantIndex: number) => {
      const combatant = combatants[combatantIndex];
      if (!combatant) return;

      const newInitiative = rollInitiative();
      const updatedCombatants = [...combatants];
      updatedCombatants[combatantIndex] = {
        ...combatant,
        initiative: newInitiative,
        _sortId: Date.now() + Math.random(), // New sort ID for stable sorting
      };

      // Re-sort by initiative with stable sorting
      const sortedCombatants = sortCombatantsByInitiative(updatedCombatants);

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

  // Update pre-combat initiative for multiple combatants at once
  const updateMultiplePreCombatInitiatives = useCallback(
    (
      updates: Array<{ combatant: CombatantWithInitiative; initiative: number }>
    ) => {
      const newInitiatives = { ...preCombatInitiatives };
      updates.forEach(({ combatant, initiative }) => {
        newInitiatives[combatant.name] = initiative;
      });
      setPreCombatInitiatives(newInitiatives);
    },
    [preCombatInitiatives, setPreCombatInitiatives]
  );

  // Update initiative during combat
  const updateInitiative = useCallback(
    (targetCombatant: CombatantWithInitiative, newInitiative: number) => {
      const targetIndex = combatants.findIndex((c) => {
        const sortIdMatch =
          targetCombatant._sortId &&
          c._sortId &&
          c._sortId === targetCombatant._sortId;
        const zeroInitiativeMatch =
          c.initiative === 0 && c.name === targetCombatant.name;
        const exactMatch =
          c.name === targetCombatant.name &&
          c.initiative === targetCombatant.initiative;

        return sortIdMatch || zeroInitiativeMatch || exactMatch;
      });

      if (targetIndex === -1) return;

      const foundCombatant = combatants[targetIndex];
      if (!foundCombatant) return;

      const updatedCombatant: CombatantWithInitiative = {
        ...foundCombatant,
        initiative: newInitiative,
        // Give new _sortId like the working monsters button does
        _sortId: Date.now() + Math.random(),
      };

      const updatedCombatants = [...combatants];
      updatedCombatants[targetIndex] = updatedCombatant;

      // For players during combat, also update pre-combat storage for persistence
      if (targetCombatant.isPlayer) {
        setPreCombatInitiatives({
          ...preCombatInitiatives,
          [targetCombatant.name]: newInitiative,
        });
      }

      setCombatState({
        ...combatState,
        combatants: updatedCombatants,
      });
    },
    [
      combatants,
      combatState,
      setCombatState,
      preCombatInitiatives,
      setPreCombatInitiatives,
    ]
  );

  // Roll initiative for all monsters during combat
  const rollInitiativeForMonsters = useCallback(() => {
    const monsters = combatants.filter((c) => !c.isPlayer);
    if (monsters.length === 0) return;

    const updatedCombatants = combatants.map((combatant) => {
      if (!combatant.isPlayer) {
        return {
          ...combatant,
          initiative: rollInitiative(),
          _sortId: Date.now() + Math.random(),
        };
      }
      return combatant;
    });

    setCombatState({
      ...combatState,
      combatants: updatedCombatants,
    });

    showInfo(`Rolled initiative for ${monsters.length} monsters`, {
      title: "Initiative Rolled",
    });
  }, [combatants, combatState, setCombatState, showInfo]);

  // Update HP for a specific combatant
  const updateCombatantHp = useCallback(
    (targetCombatant: CombatantWithInitiative, newHp: number) => {
      const updatedCombatants = combatants.map((combatant) => {
        const isMatch =
          combatant._sortId === targetCombatant._sortId ||
          (combatant.name === targetCombatant.name &&
            combatant.initiative === targetCombatant.initiative);

        if (isMatch) {
          return {
            ...combatant,
            hp: { ...combatant.hp, current: Math.max(0, newHp) },
          };
        }
        return combatant;
      });

      setCombatState({
        ...combatState,
        combatants: updatedCombatants,
      });
    },
    [combatants, combatState, setCombatState]
  );

  // Set current turn
  const setCurrentTurn = useCallback(
    (index: number) => {
      setCombatState({
        ...combatState,
        currentTurn: index,
      });
    },
    [combatState, setCombatState]
  );

  // Next turn
  const nextTurn = useCallback(() => {
    if (combatants.length === 0) return;

    const newTurn = currentTurn + 1;
    if (newTurn >= combatants.length) {
      // Clear all initiative values for the new round
      const combatantsWithClearedInitiative = combatants.map((combatant) => ({
        ...combatant,
        initiative: 0,
        _sortId: Date.now() + Math.random(), // New sort ID for re-sorting
      }));

      setCombatState({
        ...combatState,
        combatants: combatantsWithClearedInitiative,
        currentTurn: 0,
        round: round + 1,
      });
      showInfo(
        `Round ${round + 1} begins! Roll initiative for all combatants.`,
        { title: "New Round" }
      );
    } else {
      setCombatState({
        ...combatState,
        currentTurn: newTurn,
      });

      const currentCombatantInTurn = combatants[newTurn];
      showInfo(`${currentCombatantInTurn?.name}'s turn`, {
        title: "Turn Order",
      });
    }
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

  return {
    // State
    combatState,
    combatants,
    currentTurn,
    round,
    isCombatActive,
    currentCombatant,
    allCombatantsHaveInitiative,
    availablePlayers,
    currentCombatants,
    currentCombatantsWithInitiative,

    // Actions
    addPlayerToCombat,
    removeCombatant,
    initializeCombat,
    rollInitiativeFor,
    rollInitiativeForMonsters,
    updatePreCombatInitiative,
    updateMultiplePreCombatInitiatives,
    updateInitiative,
    updateCombatantHp,
    setCurrentTurn,
    nextTurn,
    endCombat,
  };
}
