// Test helpers and utilities
// Provides utility functions for testing including mock data generators and common assertions

import { vi, expect } from 'vitest';
import type { Character, AbilityScore, Equipment } from "@/types";
import { mockBasicCharacter, mockAbilityScores } from '../mocks/character-data';

type AbilityScores = {
  strength: AbilityScore;
  dexterity: AbilityScore;
  constitution: AbilityScore;
  intelligence: AbilityScore;
  wisdom: AbilityScore;
  charisma: AbilityScore;
};

/**
 * Creates a mock character with customizable properties
 */
export const createMockCharacter = (overrides: Partial<Character> = {}): Character => {
  return {
    ...mockBasicCharacter,
    ...overrides
  };
};

/**
 * Creates mock ability scores with optional overrides
 */
export const createMockAbilityScores = (overrides: Partial<AbilityScores> = {}): AbilityScores => {
  return {
    ...mockAbilityScores,
    ...overrides
  };
};

/**
 * Creates a mock equipment item with customizable properties
 */
export const createMockEquipment = (overrides: Partial<Equipment> = {}): Equipment => {
  return {
    name: "Test Item",
    costValue: 10,
    costCurrency: "gp",
    weight: 1,
    category: "misc",
    amount: 1,
    ...overrides
  };
};

/**
 * Mock dice roller that returns predictable results for testing
 */
export const createMockDiceRoller = (results: number[]) => {
  let callCount = 0;
  return vi.fn(() => {
    const result = results[callCount % results.length];
    callCount++;
    return result;
  });
};

/**
 * Waits for async operations to complete (useful for testing async components)
 */
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

/**
 * Creates a mock user event for testing component interactions
 */
export const createMockUserEvent = () => {
  return {
    click: vi.fn(),
    type: vi.fn(),
    clear: vi.fn(),
    selectOptions: vi.fn(),
    upload: vi.fn()
  };
};

/**
 * Assertion helper for testing character validation
 */
export const expectCharacterToBeValid = (character: Character) => {
  expect(character.name).toBeTruthy();
  expect(character.race).toBeTruthy();
  expect(character.class.length).toBeGreaterThan(0);
  expect(character.abilities.strength.value).toBeGreaterThan(0);
  expect(character.level).toBeGreaterThan(0);
};

/**
 * Assertion helper for testing ability score calculations
 */
export const expectAbilityScoreModifier = (value: number, expectedModifier: number) => {
  const modifier = Math.floor((value - 10) / 2);
  expect(modifier).toBe(expectedModifier);
};

/**
 * Mock localStorage for testing persistence
 */
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    })
  };
};