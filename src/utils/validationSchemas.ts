import type { Character } from "@/types/character";
import type { ValidationSchema } from "@/validation";
import { Rules } from "@/validation";

/**
 * Validation schemas for character creation with enhanced type safety
 */

// Individual ability score validation
export const abilityScoreSchema: ValidationSchema<number> = {
  required: true,
  rules: [
    Rules.isValidAbilityScore,
    Rules.isInteger,
  ],
};

// Character name validation
export const characterNameSchema: ValidationSchema<string> = {
  required: true,
  rules: [Rules.characterName],
};

// Race selection validation
export const raceSelectionSchema: ValidationSchema<string> = {
  required: true,
  rules: [Rules.minLength(1)],
};

// Class selection validation
export const classSelectionSchema: ValidationSchema<string[]> = {
  required: true,
  rules: [Rules.nonEmptyArray],
};

// Complete character validation schema
export const characterSchema: ValidationSchema<Partial<Character>> = {
  required: true,
  rules: [
    {
      name: "hasName",
      validate: (char: Partial<Character>) =>
        typeof char.name === "string" && char.name.trim().length > 0,
      message: "Character must have a name",
    },
    {
      name: "hasAbilities",
      validate: (char: Partial<Character>) =>
        char.abilities !== undefined &&
        Object.values(char.abilities).every((ability) =>
          Rules.isValidAbilityScore.validate(ability.value)
        ),
      message: "Character must have valid ability scores",
    },
    {
      name: "hasRace",
      validate: (char: Partial<Character>) =>
        typeof char.race === "string" && char.race.length > 0,
      message: "Character must have a selected race",
    },
    {
      name: "hasClass",
      validate: (char: Partial<Character>) =>
        Array.isArray(char.class) && char.class.length > 0,
      message: "Character must have at least one selected class",
    },
  ],
};
