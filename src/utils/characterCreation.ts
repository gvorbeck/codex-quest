import type { Character, Cantrip, Class } from "@/types/character";
import { roller } from "@/utils/dice";
import { getAvailableCantrips } from "@/utils/cantrips";
import {
  canCastSpells,
  hasClassType,
  isCustomClass,
  hasCustomClasses,
} from "@/utils/characterHelpers";
import { CHARACTER_CLASSES } from "@/constants/gameData";
import { getClassFromAvailable } from "./characterHelpers";

/**
 * Determines the effective spellcasting class for a character
 * Returns the type (standard/custom) and class ID of the first spellcasting class found
 */
export function getEffectiveSpellcastingClass(
  character: Character,
  availableClasses: Class[]
): { type: "standard" | "custom"; classId: string } | null {
  // Check if any of the character's classes can cast spells
  for (const classId of character.class) {
    // Check if it's a custom class
    if (isCustomClass(classId)) {
      // For custom classes, assume they can cast spells (UI will determine this)
      return { type: "custom", classId };
    } else {
      // Standard class - check if it has spellcasting
      const classData = getClassFromAvailable(classId, availableClasses);
      if (classData?.spellcasting) {
        return { type: "standard", classId };
      }
    }
  }
  return null;
}

/**
 * Gets the relevant ability modifier for spellcasting
 * Returns the modifier based on whether the character has divine, arcane, or custom spellcasting
 */
export function getSpellcastingAbilityModifier(character: Character): number {
  // Check for custom classes first - default to arcane (Intelligence)
  const hasCustomSpellcaster = hasCustomClasses(character);

  const hasArcane =
    hasCustomSpellcaster ||
    hasClassType(character, CHARACTER_CLASSES.MAGIC_USER);
  const hasDivine =
    !hasCustomSpellcaster && hasClassType(character, CHARACTER_CLASSES.CLERIC);

  if (hasArcane) {
    return character.abilities.intelligence.modifier;
  } else if (hasDivine) {
    return character.abilities.wisdom.modifier;
  }

  return 0;
}

/**
 * Auto-assigns starting cantrips based on 1d4 + ability bonus
 * Follows the game rules for determining number and selection of starting cantrips
 */
export function assignStartingCantrips(character: Character): Cantrip[] {
  // Don't auto-assign if character already has cantrips (manual selection)
  if (character.cantrips && character.cantrips.length > 0) {
    return character.cantrips;
  }

  // Check if any class can cast spells
  const hasSpellcaster = canCastSpells(character);
  if (!hasSpellcaster) {
    return [];
  }

  // Get relevant ability modifier
  const abilityBonus = getSpellcastingAbilityModifier(character);

  // Roll 1d4 + ability bonus for number of starting cantrips
  const rollResult = roller("1d4");
  const numCantrips = Math.max(0, rollResult.total + abilityBonus);

  if (numCantrips === 0) {
    return [];
  }

  // Get available cantrips and randomly select
  const availableCantrips = getAvailableCantrips(character);
  const selectedCantrips: Cantrip[] = [];

  // Shuffle available cantrips and pick the first numCantrips
  const shuffled = [...availableCantrips].sort(() => Math.random() - 0.5);
  for (let i = 0; i < Math.min(numCantrips, shuffled.length); i++) {
    const cantrip = shuffled[i];
    if (cantrip) {
      selectedCantrips.push(cantrip);
    }
  }

  return selectedCantrips;
}
