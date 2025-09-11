import { useState, useEffect } from "react";
import { logger } from "@/utils/logger";
import { loadSpellsForClass } from "@/services/dataLoader";
import type { Character, Spell } from "@/types/character";

interface UseClericSpellsResult {
  availableSpells: Record<number, Spell[]>;
  loadingSpells: boolean;
}

export function useClericSpells(
  character: Character | undefined,
  spellSystemType: string,
  spellSlots: Record<number, number>
): UseClericSpellsResult {
  const [availableSpells, setAvailableSpells] = useState<Record<number, Spell[]>>({});
  const [loadingSpells, setLoadingSpells] = useState(false);

  useEffect(() => {
    if (
      !character ||
      spellSystemType !== "cleric" ||
      !Object.keys(spellSlots).length
    ) {
      setAvailableSpells({});
      setLoadingSpells(false);
      return;
    }

    const loadSpellsForSlots = async () => {
      setLoadingSpells(true);
      try {
        const spellsByLevel: Record<number, Spell[]> = {};
        const clericClassId = character.class.find((classId) =>
          ["cleric", "druid", "paladin"].includes(classId)
        );

        if (clericClassId) {
          // Load spells for each spell level the character has slots for
          for (const levelStr of Object.keys(spellSlots)) {
            const level = parseInt(levelStr);
            const spellsForLevel = await loadSpellsForClass(
              clericClassId,
              level
            );
            spellsByLevel[level] = spellsForLevel;
          }
        }

        setAvailableSpells(spellsByLevel);
      } catch (error) {
        logger.error("Error loading spells for cleric:", error);
      } finally {
        setLoadingSpells(false);
      }
    };

    loadSpellsForSlots();
  }, [character, spellSystemType, spellSlots]);

  return {
    availableSpells,
    loadingSpells,
  };
}