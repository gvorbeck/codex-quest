import type { Character, Race } from "@/types/character";

/**
 * Checks if a character can equip a specific item based on their race restrictions
 * @param character - The character to check
 * @param race - The race of the character
 * @param equipmentId - The ID of the equipment item to check
 * @returns true if the character can equip the item, false otherwise
 */
export function canEquipItem(
  character: Character,
  race: Race,
  equipmentId: string
): boolean {
  return !race.restrictions.weaponRestrictions?.includes(equipmentId);
}

/**
 * Checks if a character meets the ability score requirements for a specific race
 * @param character - The character to check
 * @param race - The race to check requirements for
 * @returns true if the character meets all requirements, false otherwise
 */
export function isRaceEligible(character: Character, race: Race): boolean {
  return race.restrictions.requirements.every((req) => {
    const abilityValue = character.abilities[req.ability].value;
    const meetsMin = req.min ? abilityValue >= req.min : true;
    const meetsMax = req.max ? abilityValue <= req.max : true;
    return meetsMin && meetsMax;
  });
}

/**
 * Gets all races that a character is eligible for based on their ability scores
 * @param character - The character to check
 * @param races - Array of all available races
 * @returns Array of races the character is eligible for
 */
export function getEligibleRaces(character: Character, races: Race[]): Race[] {
  return races.filter((race) => isRaceEligible(character, race));
}
