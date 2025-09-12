import type { Spell } from "@/types/character";
import { loadSpellsForClass, loadAllFirstLevelSpells, loadAllSpells } from "@/services/dataLoader";


/**
 * Get all first level spells available to a class (excluding Read Magic for magic-users)
 */
export async function getFirstLevelSpellsForClass(
  classId: string
): Promise<Spell[]> {
  if (classId === "all") {
    return await loadAllFirstLevelSpells();
  }
  return await loadSpellsForClass(classId, 1);
}

/**
 * Get all spells for custom classes (all levels)
 */
export async function getAllSpellsForCustomClass(): Promise<Spell[]> {
  return await loadAllSpells();
}

// Re-export consolidated spellcasting functions from characterHelpers
export { 
  characterHasSpellcasting,
  getFirstSpellcastingClass 
} from "@/utils/characterHelpers";
