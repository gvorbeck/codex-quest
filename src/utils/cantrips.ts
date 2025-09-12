import type { Character, Cantrip } from "@/types/character";
import cantripData from "@/data/cantrips.json";
import { CHARACTER_CLASSES } from "@/constants/gameData";
import { hasClassType, hasCustomClasses } from "@/utils/characterHelpers";

export interface SpellTypeInfo {
  type: "orisons" | "cantrips";
  singular: "orison" | "cantrip";
  capitalized: "Orisons" | "Cantrips";
  capitalizedSingular: "Orison" | "Cantrip";
  abilityScore: "Intelligence" | "Wisdom" | "Intelligence/Wisdom";
}

/**
 * Gets available cantrips/orisons for character classes
 */
export function getAvailableCantrips(character: Character): Cantrip[] {
  const mappedClasses = character.class.map((classId) => {
    // For custom classes that use spells, default to magic-user cantrips
    if (hasCustomClasses(character)) {
      if (character.spells?.length) {
        return "magic-user"; // Default custom spellcasters to arcane cantrips
      }
    }

    // Map class IDs to cantrip class names
    if (classId === "magic-user") return "magic-user";
    return classId;
  });

  return cantripData.filter((cantrip) =>
    cantrip.classes.some((cantripClass) => mappedClasses.includes(cantripClass))
  );
}

/**
 * Determines spell type terminology and ability score based on character classes
 */
export function getSpellTypeInfo(character: Character): SpellTypeInfo {
  // Check for custom classes first - default to arcane (Intelligence)
  const hasCustomSpellcaster =
    hasCustomClasses(character) && !!character.spells?.length;

  // Use consolidated class type checking
  const hasDivineClasses = hasClassType(character, CHARACTER_CLASSES.CLERIC);
  const hasArcaneClasses =
    hasCustomSpellcaster ||
    hasClassType(character, CHARACTER_CLASSES.MAGIC_USER);

  const isOrisons = hasDivineClasses && !hasArcaneClasses;

  let abilityScore: SpellTypeInfo["abilityScore"];
  if (hasDivineClasses && hasArcaneClasses) {
    abilityScore = "Intelligence/Wisdom";
  } else if (hasDivineClasses) {
    abilityScore = "Wisdom";
  } else {
    abilityScore = "Intelligence";
  }

  return {
    type: isOrisons ? "orisons" : "cantrips",
    singular: isOrisons ? "orison" : "cantrip",
    capitalized: isOrisons ? "Orisons" : "Cantrips",
    capitalizedSingular: isOrisons ? "Orison" : "Cantrip",
    abilityScore,
  };
}

/**
 * Gets cantrip options for Select component
 */
export function getCantripOptions(
  availableCantrips: Cantrip[],
  knownCantrips: Cantrip[]
) {
  const availableToAdd = availableCantrips.filter(
    (cantrip) => !knownCantrips.some((known) => known.name === cantrip.name)
  );

  return availableToAdd.map((cantrip) => ({
    value: cantrip.name,
    label: cantrip.name,
  }));
}
