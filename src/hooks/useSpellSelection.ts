import { useState, useEffect, useCallback, useMemo } from "react";
import { logger } from "@/utils/logger";
import type { Class, Spell } from "@/types/character";

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
}

export function useSpellSelection({
  primaryClass,
  hasRequiredXP,
  currentLevel,
  nextLevel,
}: UseSpellSelectionProps) {
  const [availableSpells, setAvailableSpells] = useState<Spell[]>([]);
  const [selectedSpells, setSelectedSpells] = useState<Record<string, string>>(
    {}
  );
  const [selectedSpellCount, setSelectedSpellCount] = useState(0);
  const [isLoadingSpells, setIsLoadingSpells] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate spell gains for leveling up
  const spellGainInfo: SpellGainInfo | null = useMemo(() => {
    if (!primaryClass?.spellcasting || !hasRequiredXP) return null;

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
  }, [primaryClass, currentLevel, nextLevel, hasRequiredXP]);

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
      if (!spellGainInfo || !primaryClass) return;

      setIsLoadingSpells(true);
      setError(null);

      try {
        const spellsModule = await import("@/data/spells.json");
        const allSpells: Spell[] = spellsModule.default;
        setAvailableSpells(allSpells);
        setSelectedSpells({});
        setSelectedSpellCount(0);
      } catch (err) {
        const errorMessage = "Failed to load spells. Please try again.";
        setError(errorMessage);
        logger.error("Spell loading error:", err);
        setAvailableSpells([]);
      } finally {
        setIsLoadingSpells(false);
      }
    };

    loadSpells();
  }, [spellGainInfo, primaryClass]);

  // Organize spells by level for UI rendering
  const organizedSpells = useMemo(() => {
    if (!spellGainInfo || !primaryClass || availableSpells.length === 0)
      return [];

    const classSpellKey = primaryClass.id;
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
  }, [spellGainInfo, primaryClass, availableSpells, filterSpellsByLevel]);

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
