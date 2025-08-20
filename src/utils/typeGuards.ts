import type { Character, Race, Class, AbilityScore } from "@/types/character";

/**
 * Type guards and enhanced validation utilities for better type safety
 */

// Ability score constants for better type safety
export const ABILITY_SCORE_RANGE = {
  MIN: 3,
  MAX: 18,
} as const;

export const ABILITY_NAMES = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
] as const;

export type AbilityName = (typeof ABILITY_NAMES)[number];

/**
 * Type guard to check if a value is a valid ability score
 */
export function isValidAbilityScore(value: unknown): value is number {
  return (
    typeof value === "number" &&
    value >= ABILITY_SCORE_RANGE.MIN &&
    value <= ABILITY_SCORE_RANGE.MAX &&
    Number.isInteger(value)
  );
}

/**
 * Type guard to check if an object is a valid AbilityScore
 */
export function isAbilityScore(obj: unknown): obj is AbilityScore {
  if (typeof obj !== "object" || obj === null) return false;

  const score = obj as Record<string, unknown>;
  return (
    isValidAbilityScore(score["value"]) &&
    typeof score["modifier"] === "number" &&
    Number.isInteger(score["modifier"])
  );
}

/**
 * Type guard to check if a character has valid abilities structure
 */
export function hasValidAbilitiesStructure(
  character: unknown
): character is { abilities: Character["abilities"] } {
  if (typeof character !== "object" || character === null) return false;

  const char = character as Record<string, unknown>;
  if (typeof char["abilities"] !== "object" || char["abilities"] === null)
    return false;

  const abilities = char["abilities"] as Record<string, unknown>;

  return ABILITY_NAMES.every((abilityName) =>
    isAbilityScore(abilities[abilityName])
  );
}

/**
 * Type guard for valid character race
 */
export function isValidRace(
  race: unknown,
  availableRaces: Race[]
): race is string {
  return (
    typeof race === "string" &&
    (race === "" || availableRaces.some((r) => r.id === race))
  );
}

/**
 * Type guard for valid character class array
 */
export function isValidClassArray(
  classes: unknown,
  availableClasses: Class[]
): classes is string[] {
  if (!Array.isArray(classes)) return false;

  return classes.every(
    (classId) =>
      typeof classId === "string" &&
      availableClasses.some((c) => c.id === classId)
  );
}

/**
 * Enhanced character validation with detailed error reporting
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Comprehensive character validation with detailed feedback
 */
export function validateCharacter(
  character: unknown,
  availableRaces: Race[],
  availableClasses: Class[]
): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  // Basic structure validation
  if (typeof character !== "object" || character === null) {
    result.errors.push("Character must be an object");
    result.isValid = false;
    return result;
  }

  const char = character as Record<string, unknown>;

  // Validate abilities structure
  if (!hasValidAbilitiesStructure(character)) {
    result.errors.push("Invalid abilities structure");
    result.isValid = false;
  }

  // Validate race
  if (!isValidRace(char["race"], availableRaces)) {
    result.errors.push("Invalid race selection");
    result.isValid = false;
  }

  // Validate class array
  if (!isValidClassArray(char["class"], availableClasses)) {
    result.errors.push("Invalid class selection");
    result.isValid = false;
  }

  // If basic structure is valid, run logical validations
  if (result.isValid && hasValidAbilitiesStructure(character)) {
    const typedChar = character as Character;

    // Check ability score requirements for race
    if (typeof char["race"] === "string" && char["race"] !== "") {
      const selectedRace = availableRaces.find((r) => r.id === char["race"]);
      if (selectedRace && !isRaceEligibleSafe(typedChar, selectedRace)) {
        result.warnings.push(
          `Character doesn't meet ability requirements for ${selectedRace.name}`
        );
      }
    }

    // Check class/race compatibility
    if (
      Array.isArray(char["class"]) &&
      char["class"].length > 0 &&
      typeof char["race"] === "string"
    ) {
      const selectedRace = availableRaces.find((r) => r.id === char["race"]);
      if (selectedRace) {
        const invalidClasses = (char["class"] as string[]).filter(
          (classId) => !selectedRace.allowedClasses.includes(classId)
        );
        if (invalidClasses.length > 0) {
          result.warnings.push(
            `Classes not allowed for ${
              selectedRace.name
            }: ${invalidClasses.join(", ")}`
          );
        }
      }
    }
  }

  return result;
}

/**
 * Safe version of race eligibility check with type guards
 */
function isRaceEligibleSafe(character: Character, race: Race): boolean {
  try {
    return race.abilityRequirements.every((req) => {
      const abilityValue = character.abilities[req.ability]?.value;
      if (!isValidAbilityScore(abilityValue)) return false;

      const meetsMin = req.min ? abilityValue >= req.min : true;
      const meetsMax = req.max ? abilityValue <= req.max : true;
      return meetsMin && meetsMax;
    });
  } catch {
    return false;
  }
}
