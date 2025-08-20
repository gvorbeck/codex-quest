import type { Character, ValidationSchema } from '@/types/enhanced';
import { ABILITY_SCORE_RANGE, isValidAbilityScore } from '@/utils/typeGuards';

/**
 * Validation schemas for character creation with enhanced type safety
 */

// Individual ability score validation
export const abilityScoreSchema: ValidationSchema<number> = {
  required: true,
  rules: [
    {
      name: 'validScore',
      validate: isValidAbilityScore,
      message: `Ability score must be between ${ABILITY_SCORE_RANGE.MIN} and ${ABILITY_SCORE_RANGE.MAX}`
    },
    {
      name: 'isInteger',
      validate: (value: number) => Number.isInteger(value),
      message: 'Ability score must be a whole number'
    }
  ]
};

// Character name validation
export const characterNameSchema: ValidationSchema<string> = {
  required: true,
  rules: [
    {
      name: 'minLength',
      validate: (name: string) => name.trim().length >= 2,
      message: 'Character name must be at least 2 characters long'
    },
    {
      name: 'maxLength',
      validate: (name: string) => name.trim().length <= 50,
      message: 'Character name must be 50 characters or less'
    },
    {
      name: 'validCharacters',
      validate: (name: string) => /^[a-zA-Z\s\-'.]+$/.test(name.trim()),
      message: 'Character name can only contain letters, spaces, hyphens, apostrophes, and periods'
    }
  ]
};

// Race selection validation
export const raceSelectionSchema: ValidationSchema<string> = {
  required: true,
  rules: [
    {
      name: 'notEmpty',
      validate: (race: string) => race.trim().length > 0,
      message: 'Please select a race for your character'
    }
  ]
};

// Class selection validation
export const classSelectionSchema: ValidationSchema<string[]> = {
  required: true,
  rules: [
    {
      name: 'notEmpty',
      validate: (classes: string[]) => classes.length > 0,
      message: 'Please select at least one class for your character'
    },
    {
      name: 'validCombination',
      validate: (classes: string[]) => classes.length <= 2,
      message: 'Character can have at most 2 classes'
    },
    {
      name: 'noDuplicates',
      validate: (classes: string[]) => new Set(classes).size === classes.length,
      message: 'Cannot select the same class multiple times'
    }
  ]
};

// Complete character validation schema
export const characterSchema: ValidationSchema<Partial<Character>> = {
  required: true,
  rules: [
    {
      name: 'hasName',
      validate: (char: Partial<Character>) => 
        typeof char.name === 'string' && char.name.trim().length > 0,
      message: 'Character must have a name'
    },
    {
      name: 'hasAbilities',
      validate: (char: Partial<Character>) => 
        char.abilities !== undefined &&
        Object.values(char.abilities).every(ability => 
          isValidAbilityScore(ability.value)
        ),
      message: 'Character must have valid ability scores'
    },
    {
      name: 'hasRace',
      validate: (char: Partial<Character>) => 
        typeof char.race === 'string' && char.race.length > 0,
      message: 'Character must have a selected race'
    },
    {
      name: 'hasClass',
      validate: (char: Partial<Character>) => 
        Array.isArray(char.class) && char.class.length > 0,
      message: 'Character must have at least one selected class'
    }
  ]
};
