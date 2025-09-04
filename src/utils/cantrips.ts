import type { Character, Cantrip } from "@/types/character";
import { allClasses } from "@/data/classes";
import cantripData from "@/data/cantrips.json";
import {
  DIVINE_CLASSES,
  ARCANE_CLASSES,
  type ArcaneClass,
  type DivineClass,
} from "@/constants/spellcasting";

export interface SpellTypeInfo {
  type: "orisons" | "cantrips";
  singular: "orison" | "cantrip";
  capitalized: "Orisons" | "Cantrips";
  capitalizedSingular: "Orison" | "Cantrip";
  abilityScore: "Intelligence" | "Wisdom" | "Intelligence/Wisdom";
}

/**
 * Determines if a character can learn cantrips/orisons
 */
export function canLearnCantrips(character: Character): boolean {
  return character.class.some((classId) => {
    // Check if it's a custom class that uses spells
    if (character.customClasses && character.customClasses[classId]) {
      return character.customClasses[classId].usesSpells;
    }
    
    const classData = allClasses.find((c) => c.id === classId);
    return classData?.spellcasting !== undefined;
  });
}

/**
 * Gets available cantrips/orisons for character classes
 */
export function getAvailableCantrips(character: Character): Cantrip[] {
  const mappedClasses = character.class.map((classId) => {
    // For custom classes that use spells, default to magic-user cantrips
    if (character.customClasses && character.customClasses[classId]) {
      const customClass = character.customClasses[classId];
      if (customClass.usesSpells) {
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
  const hasCustomSpellcaster = character.class.some((classId) => {
    if (character.customClasses && character.customClasses[classId]) {
      return character.customClasses[classId].usesSpells;
    }
    return false;
  });

  const hasDivineClasses = character.class.some((classId) =>
    DIVINE_CLASSES.includes(classId as DivineClass)
  );
  const hasArcaneClasses = hasCustomSpellcaster || character.class.some((classId) =>
    ARCANE_CLASSES.includes(classId as ArcaneClass)
  );

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
