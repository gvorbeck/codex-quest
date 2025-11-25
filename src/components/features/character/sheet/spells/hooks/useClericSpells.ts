import { useState, useEffect } from "react";
import { logger, getClassById } from "@/utils";
import { loadSpellsForClass } from "@/services/dataLoader";
import type { Character, Spell } from "@/types";
import { CHARACTER_CLASSES } from "@/constants";

interface UseClericSpellsResult {
  availableSpells: Record<number, Spell[]>;
  loadingSpells: boolean;
}

export function useClericSpells(
  character: Character | undefined,
  spellSystemType: string,
  spellSlots: Record<number, number>
): UseClericSpellsResult {
  const [availableSpells, setAvailableSpells] = useState<
    Record<number, Spell[]>
  >({});
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

        // Check if character has a cleric-type class (including combination classes)
        const classData = getClassById(character.class);
        const isClericType = classData?.classType === CHARACTER_CLASSES.CLERIC;
        const clericClassId = isClericType ? character.class : null;

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
