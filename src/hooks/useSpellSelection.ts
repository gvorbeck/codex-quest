import { useState, useEffect, useCallback, useMemo } from "react";
import { logger } from "@/utils/logger";
import { useLoadingState } from "@/hooks/useLoadingState";
import { loadSpellsForClass } from "@/services/dataLoader";
import { isCustomClass, getCustomClass } from "@/utils/characterHelpers";
import type { Class, Spell, Character } from "@/types/character";

export interface SpellGainInfo {
  level: number;
  newSpells: number[];
  totalSpellsGained: number;
  spellsByLevel: Array<{ spellLevel: number; count: number; spells: Spell[] }>;
}

interface UseSpellSelectionProps {
  primaryClass: Class | null;
  hasRequiredXP: boolean;
  currentLevel: number;
  nextLevel: number;
  character?: Character;
}

export function useSpellSelection({
  primaryClass,
  hasRequiredXP,
  currentLevel,
  nextLevel,
  character,
}: UseSpellSelectionProps) {
  const [availableSpells, setAvailableSpells] = useState<Spell[]>([]);
  const [selectedSpells, setSelectedSpells] = useState<Record<string, string>>(
    {}
  );
  const [selectedSpellCount, setSelectedSpellCount] = useState(0);
  const { loading: isLoadingSpells, withLoading: withSpellLoading } =
    useLoadingState();
  const [error, setError] = useState<string | null>(null);

  // Calculate spell gains for leveling up
  const spellGainInfo: SpellGainInfo | null = useMemo(() => {
    if (!hasRequiredXP) return null;

    // Handle custom classes
    if (
      character &&
      character.class[0] &&
      isCustomClass(character.class[0]) &&
      character.customClasses
    ) {
      const primaryClassId = character.class[0];
      const customClass = getCustomClass(character, primaryClassId);

      if (customClass?.usesSpells) {
        // For custom spellcasting classes, allow selection of 1 spell per level up
        return {
          level: nextLevel,
          newSpells: [1], // Allow one 1st level spell
          totalSpellsGained: 1,
          spellsByLevel: [],
        };
      }
      return null;
    }

    // Handle standard classes
    if (!primaryClass?.spellcasting) return null;

    const currentSpells =
      primaryClass.spellcasting.spellsPerLevel[currentLevel] || [];
    const nextLevelSpells =
      primaryClass.spellcasting.spellsPerLevel[nextLevel] || [];

    const newSpells: number[] = [];
    let totalSpellsGained = 0;

    // Compare spell slots between current and next level
    for (
      let spellLevel = 0;
      spellLevel < nextLevelSpells.length;
      spellLevel++
    ) {
      const currentCount = currentSpells[spellLevel] || 0;
      const nextCount = nextLevelSpells[spellLevel] || 0;
      const newCount = nextCount - currentCount;

      if (newCount > 0) {
        newSpells[spellLevel] = newCount;
        totalSpellsGained += newCount;
      }
    }

    return totalSpellsGained > 0
      ? {
          level: nextLevel,
          newSpells,
          totalSpellsGained,
          spellsByLevel: [],
        }
      : null;
  }, [primaryClass, currentLevel, nextLevel, hasRequiredXP, character]);

  // Filter spells by level and class
  const filterSpellsByLevel = useCallback(
    (spells: Spell[], classKey: string, targetLevel: number) => {
      return spells.filter(
        (spell) => spell.level[classKey as keyof Spell["level"]] === targetLevel
      );
    },
    []
  );

  // Load available spells when spell gain is detected
  useEffect(() => {
    const loadSpells = async () => {
      if (!spellGainInfo) return;

      setError(null);

      try {
        await withSpellLoading(async () => {
          let classId = primaryClass?.id;

          // For custom classes, use a default spell list (magic-user spells)
          if (
            character &&
            character.class[0] &&
            isCustomClass(character.class[0]) &&
            character.customClasses
          ) {
            const primaryClassId = character.class[0];
            const customClass = getCustomClass(character, primaryClassId);

            if (customClass?.usesSpells) {
              classId = "magic-user"; // Default to magic-user spell list for custom classes
            }
          }

          if (classId) {
            // Use optimized dataLoader service instead of dynamic import
            const allSpells = await loadSpellsForClass(classId);
            setAvailableSpells(allSpells);
            setSelectedSpells({});
            setSelectedSpellCount(0);
          }
        });
      } catch (err) {
        const errorMessage = "Failed to load spells. Please try again.";
        setError(errorMessage);
        logger.error("Spell loading error:", err);
        setAvailableSpells([]);
      }
    };

    loadSpells();
  }, [spellGainInfo, primaryClass, character, withSpellLoading]);

  // Organize spells by level for UI rendering
  const organizedSpells = useMemo(() => {
    if (!spellGainInfo || availableSpells.length === 0) return [];

    let classSpellKey = primaryClass?.id || "magic-user";

    // For custom classes, use magic-user as the spell key
    if (
      character &&
      character.class[0] &&
      isCustomClass(character.class[0]) &&
      character.customClasses
    ) {
      classSpellKey = "magic-user";
    }

    const spellsByLevel: Array<{
      spellLevel: number;
      count: number;
      spells: Spell[];
    }> = [];

    spellGainInfo.newSpells.forEach((count, index) => {
      if (count > 0) {
        const spellLevel = index + 1;
        const spellsForLevel = filterSpellsByLevel(
          availableSpells,
          classSpellKey,
          spellLevel
        );

        if (spellsForLevel.length > 0) {
          spellsByLevel.push({
            spellLevel,
            count,
            spells: spellsForLevel,
          });
        }
      }
    });

    return spellsByLevel;
  }, [
    spellGainInfo,
    primaryClass,
    availableSpells,
    filterSpellsByLevel,
    character,
  ]);

  // Handle spell selection with count tracking
  const handleSpellSelection = useCallback(
    (selectionKey: string, spellName: string) => {
      setSelectedSpells((prev) => {
        const wasEmpty = !prev[selectionKey] || prev[selectionKey] === "";
        const isEmpty = !spellName || spellName === "";

        if (wasEmpty && !isEmpty) {
          setSelectedSpellCount((count) => count + 1);
        } else if (!wasEmpty && isEmpty) {
          setSelectedSpellCount((count) => count - 1);
        }

        return { ...prev, [selectionKey]: spellName };
      });
    },
    []
  );

  // Sync selectedSpellCount with actual selected spells to prevent state drift
  useEffect(() => {
    const actualCount = Object.values(selectedSpells).filter(
      (name) => name !== ""
    ).length;
    setSelectedSpellCount(actualCount);
  }, [selectedSpells]);

  // Check if all required spells are selected
  const allSpellsSelected = useMemo(() => {
    if (!spellGainInfo) return true;
    return selectedSpellCount === spellGainInfo.totalSpellsGained;
  }, [spellGainInfo, selectedSpellCount]);

  // Get selected spell objects for character update
  const getSelectedSpellObjects = useCallback(() => {
    return Object.values(selectedSpells)
      .filter((name) => name !== "")
      .map((name) => availableSpells.find((spell) => spell.name === name)!)
      .filter(Boolean);
  }, [selectedSpells, availableSpells]);

  return {
    spellGainInfo,
    organizedSpells,
    selectedSpells,
    selectedSpellCount,
    isLoadingSpells,
    error,
    allSpellsSelected,
    handleSpellSelection,
    getSelectedSpellObjects,
    clearError: () => setError(null),
  };
}
