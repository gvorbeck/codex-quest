/**
 * Reusable validation rules
 * Consolidates common validation patterns from across the codebase
 */

import type { ValidationRule } from './types';
import { createRule } from './core';
import type { Character, Race, Class, AbilityScore } from '@/types/character';

// Ability score constants
export const ABILITY_SCORE_RANGE = {
  MIN: 3,
  MAX: 18,
} as const;

export const ABILITY_NAMES = [
  'strength',
  'dexterity',
  'constitution',
  'intelligence',
  'wisdom',
  'charisma',
] as const;

export type AbilityName = (typeof ABILITY_NAMES)[number];

/**
 * Common validation rules
 */
export const Rules = {
  // Basic type validation
  isString: createRule<unknown>('isString', (value) => typeof value === 'string', 'Must be a string'),
  
  isNumber: createRule<unknown>('isNumber', (value) => typeof value === 'number', 'Must be a number'),
  
  isInteger: createRule<number>('isInteger', (value) => Number.isInteger(value), 'Must be an integer'),
  
  // String validation
  minLength: (min: number): ValidationRule<string> =>
    createRule('minLength', (value) => value.length >= min, `Must be at least ${min} characters`),
  
  maxLength: (max: number): ValidationRule<string> =>
    createRule('maxLength', (value) => value.length <= max, `Must be no more than ${max} characters`),
  
  pattern: (regex: RegExp, message: string): ValidationRule<string> =>
    createRule('pattern', (value) => regex.test(value), message),
  
  // Number validation
  min: (min: number): ValidationRule<number> =>
    createRule('min', (value) => value >= min, `Must be at least ${min}`),
  
  max: (max: number): ValidationRule<number> =>
    createRule('max', (value) => value <= max, `Must be no more than ${max}`),
  
  range: (min: number, max: number): ValidationRule<number> =>
    createRule('range', (value) => value >= min && value <= max, `Must be between ${min} and ${max}`),
  
  // Ability score validation
  isValidAbilityScore: createRule<unknown>(
    'isValidAbilityScore',
    (value) => 
      typeof value === 'number' &&
      value >= ABILITY_SCORE_RANGE.MIN &&
      value <= ABILITY_SCORE_RANGE.MAX &&
      Number.isInteger(value),
    `Must be an integer between ${ABILITY_SCORE_RANGE.MIN} and ${ABILITY_SCORE_RANGE.MAX}`
  ),
  
  // Character name validation
  characterName: createRule<string>(
    'characterName',
    (value) => {
      const trimmed = value.trim();
      return trimmed.length >= 2 && 
             trimmed.length <= 50 && 
             /^[a-zA-Z\s\-'.]+$/.test(trimmed);
    },
    'Name must be 2-50 characters and contain only letters, spaces, hyphens, apostrophes, and periods'
  ),
  
  // Array validation
  nonEmptyArray: createRule<unknown[]>(
    'nonEmptyArray',
    (value) => Array.isArray(value) && value.length > 0,
    'Must select at least one item'
  ),
  
  // Race validation
  validRace: (availableRaces: Race[]): ValidationRule<string> =>
    createRule(
      'validRace',
      (value) => value === '' || value === 'custom' || availableRaces.some(r => r.id === value),
      'Selected race is not available'
    ),
  
  // Class validation
  validClassArray: (availableClasses: Class[]): ValidationRule<string[]> =>
    createRule(
      'validClassArray',
      (classes) => Array.isArray(classes) && 
                   classes.every(classId => 
                     typeof classId === 'string' && 
                     (classId.startsWith('custom-') || availableClasses.some(c => c.id === classId))
                   ),
      'One or more selected classes are not available'
    ),
};

/**
 * Type guards as validation rules
 */
export const TypeGuards = {
  isAbilityScore: createRule<unknown>(
    'isAbilityScore',
    (obj): obj is AbilityScore => {
      if (typeof obj !== 'object' || obj === null) return false;
      const score = obj as Record<string, unknown>;
      return typeof score['value'] === 'number' &&
             Number.isInteger(score['value']) &&
             score['value'] >= ABILITY_SCORE_RANGE.MIN &&
             score['value'] <= ABILITY_SCORE_RANGE.MAX &&
             typeof score['modifier'] === 'number' &&
             Number.isInteger(score['modifier']);
    },
    'Invalid ability score structure'
  ),
  
  hasValidAbilitiesStructure: createRule<unknown>(
    'hasValidAbilitiesStructure',
    (character): character is { abilities: Character['abilities'] } => {
      if (typeof character !== 'object' || character === null) return false;
      const char = character as Record<string, unknown>;
      
      if (typeof char['abilities'] !== 'object' || char['abilities'] === null) return false;
      const abilities = char['abilities'] as Record<string, unknown>;
      
      return ABILITY_NAMES.every(abilityName => {
        const ability = abilities[abilityName];
        return TypeGuards.isAbilityScore.validate(ability);
      });
    },
    'Invalid character abilities structure'
  ),
};