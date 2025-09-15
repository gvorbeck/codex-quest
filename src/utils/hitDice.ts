import type { Character } from "@/types/character";
import { allClasses } from "@/data/classes";
import { allRaces } from "@/data/races";
import { hasCustomClasses } from "./characterHelpers";

export interface RacialModificationInfo {
  abilityName: string;
  originalHitDie: string;
  modifiedHitDie: string;
  modificationType: "restriction" | "increase" | "decrease";
}

/**
 * Calculates the hit die for a character, taking into account racial modifications
 */
export function calculateHitDie(character: Character): string | null {
  if (character.class.length === 0) return null;

  // For combination classes, use the first class's hit die
  const primaryClassId = character.class[0];

  // Check if it's a custom class
  if (hasCustomClasses(character) && primaryClassId) {
    return character.hp.die || "1d6";
  }

  const primaryClass = allClasses.find((cls) => cls.id === primaryClassId);
  if (!primaryClass?.hitDie) return null;

  // Apply racial modifications
  return applyRacialHitDiceModifications(character.race, primaryClass.hitDie);
}

/**
 * Applies racial hit dice modifications to a base hit die
 */
export function applyRacialHitDiceModifications(
  raceId: string,
  baseHitDie: string
): string {
  const raceData = allRaces.find((race) => race.id === raceId);
  if (!raceData?.specialAbilities) return baseHitDie;

  let modifiedHitDie = baseHitDie;

  for (const ability of raceData.specialAbilities) {
    // Apply restrictions (maxSize)
    const hitDiceRestriction = ability.effects?.hitDiceRestriction;
    if (hitDiceRestriction?.maxSize) {
      modifiedHitDie = applyHitDiceRestriction(
        modifiedHitDie,
        hitDiceRestriction.maxSize
      );
    } else if (hitDiceRestriction?.sizeDecrease) {
      modifiedHitDie = applyHitDiceDecrease(modifiedHitDie);
    }

    // Apply bonuses (sizeIncrease)
    const hitDiceBonus = ability.effects?.hitDiceBonus;
    if (hitDiceBonus?.sizeIncrease) {
      modifiedHitDie = applyHitDiceIncrease(modifiedHitDie);
    }
  }

  return modifiedHitDie;
}

/**
 * Applies a maximum hit die size restriction
 */
function applyHitDiceRestriction(
  currentHitDie: string,
  maxSizeRestriction: string
): string {
  const classMatch = currentHitDie.match(/\d*d(\d+)/);
  const restrictedMatch = maxSizeRestriction.match(/d(\d+)/);

  if (classMatch?.[1] && restrictedMatch?.[1]) {
    const classDieSize = parseInt(classMatch[1], 10);
    const restrictedDieSize = parseInt(restrictedMatch[1], 10);

    // Use the smaller die size
    if (restrictedDieSize < classDieSize) {
      return `1${maxSizeRestriction}`;
    }
  }

  return currentHitDie;
}

/**
 * Applies a hit die size decrease (Phaerim: d8->d6, d6->d4, d4->d3)
 */
function applyHitDiceDecrease(currentHitDie: string): string {
  const match = currentHitDie.match(/\d*d(\d+)/);
  if (!match?.[1]) return currentHitDie;

  const currentSize = parseInt(match[1], 10);
  let newSize: number;

  switch (currentSize) {
    case 12:
      newSize = 10;
      break;
    case 10:
      newSize = 8;
      break;
    case 8:
      newSize = 6;
      break;
    case 6:
      newSize = 4;
      break;
    case 4:
      newSize = 3;
      break;
    default:
      newSize = currentSize;
  }

  return `1d${newSize}`;
}

/**
 * Applies a hit die size increase (Half-Ogre, Bisren)
 */
function applyHitDiceIncrease(currentHitDie: string): string {
  const match = currentHitDie.match(/\d*d(\d+)/);
  if (!match?.[1]) return currentHitDie;

  const currentSize = parseInt(match[1], 10);
  let newSize: number;

  switch (currentSize) {
    case 4:
      newSize = 6;
      break;
    case 6:
      newSize = 8;
      break;
    case 8:
      newSize = 10;
      break;
    case 10:
      newSize = 12;
      break;
    default:
      newSize = currentSize;
  }

  return `1d${newSize}`;
}

/**
 * Gets information about racial modifications applied to hit dice
 */
export function getRacialModificationInfo(
  character: Character
): RacialModificationInfo | null {
  const primaryClassId = character.class[0];

  // Custom classes don't have racial modifications
  if (hasCustomClasses(character) && primaryClassId) {
    return null;
  }

  const primaryClass = allClasses.find((cls) => cls.id === primaryClassId);
  const raceData = allRaces.find((race) => race.id === character.race);

  if (!primaryClass?.hitDie || !raceData?.specialAbilities) return null;

  const originalHitDie = primaryClass.hitDie;
  const modifiedHitDie = calculateHitDie(character);

  // If no change, return null
  if (originalHitDie === modifiedHitDie) return null;

  // Determine which ability caused the modification
  for (const ability of raceData.specialAbilities) {
    const hitDiceRestriction = ability.effects?.hitDiceRestriction;
    const hitDiceBonus = ability.effects?.hitDiceBonus;

    if (hitDiceRestriction?.maxSize) {
      const classMatch = originalHitDie.match(/\d*d(\d+)/);
      const restrictedMatch = hitDiceRestriction.maxSize.match(/d(\d+)/);

      if (classMatch?.[1] && restrictedMatch?.[1]) {
        const classDieSize = parseInt(classMatch[1], 10);
        const restrictedDieSize = parseInt(restrictedMatch[1], 10);

        if (restrictedDieSize < classDieSize) {
          return {
            abilityName: ability.name,
            originalHitDie,
            modifiedHitDie: modifiedHitDie || originalHitDie,
            modificationType: "restriction",
          };
        }
      }
    } else if (hitDiceRestriction?.sizeDecrease) {
      return {
        abilityName: ability.name,
        originalHitDie,
        modifiedHitDie: modifiedHitDie || originalHitDie,
        modificationType: "decrease",
      };
    } else if (hitDiceBonus?.sizeIncrease) {
      return {
        abilityName: ability.name,
        originalHitDie,
        modifiedHitDie: modifiedHitDie || originalHitDie,
        modificationType: "increase",
      };
    }
  }

  return null;
}
