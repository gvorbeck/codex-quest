/**
 * Sample character data for mock mode
 * Provides rich demonstration data for contributors and demos
 */

import type { Character } from "@/types";
import { createEmptyCharacter } from "@/utils/character";

/**
 * Creates a sample character with the given race and class
 */
const createSampleCharacter = (
  name: string,
  raceName: string,
  className: string,
  overrides: Partial<Character> = {}
): Character => {
  const baseCharacter = createEmptyCharacter();

  return {
    ...baseCharacter,
    name,
    race: raceName,
    class: className,
    abilities: {
      strength: { value: 14, modifier: 1 },
      intelligence: { value: 12, modifier: 0 },
      wisdom: { value: 13, modifier: 1 },
      dexterity: { value: 15, modifier: 1 },
      constitution: { value: 16, modifier: 2 },
      charisma: { value: 11, modifier: 0 },
      ...overrides.abilities,
    },
    hp: {
      current:
        className === "fighter" ? 10 : className === "magic-user" ? 6 : 8,
      max: className === "fighter" ? 10 : className === "magic-user" ? 6 : 8,
    },
    level: 1,
    xp: 0,
    currency: {
      platinum: 0,
      gold: className === "magic-user" ? 120 : 100,
      electrum: 0,
      silver: 0,
      copper: 0,
      ...overrides.currency,
    },
    equipment: [
      // Basic starting equipment based on class
      ...(className === "fighter"
        ? [
            {
              name: "Sword",
              amount: 1,
              wearing: true,
              category: "Weapons",
              costValue: 10,
              costCurrency: "gp" as const,
              weight: 3,
            },
            {
              name: "Shield",
              amount: 1,
              wearing: true,
              category: "Shields",
              costValue: 15,
              costCurrency: "gp" as const,
              weight: 5,
              AC: "+1",
            },
            {
              name: "Chain Mail",
              amount: 1,
              wearing: true,
              category: "Armor",
              costValue: 75,
              costCurrency: "gp" as const,
              weight: 40,
              AC: 5,
            },
          ]
        : []),
      ...(className === "magic-user"
        ? [
            {
              name: "Dagger",
              amount: 1,
              wearing: true,
              category: "Weapons",
              costValue: 2,
              costCurrency: "gp" as const,
              weight: 1,
            },
            {
              name: "Spellbook",
              amount: 1,
              wearing: false,
              category: "Equipment",
              costValue: 15,
              costCurrency: "gp" as const,
              weight: 3,
            },
          ]
        : []),
      ...(className === "thief"
        ? [
            {
              name: "Short Sword",
              amount: 1,
              wearing: true,
              category: "Weapons",
              costValue: 8,
              costCurrency: "gp" as const,
              weight: 3,
            },
            {
              name: "Leather Armor",
              amount: 1,
              wearing: true,
              category: "Armor",
              costValue: 20,
              costCurrency: "gp" as const,
              weight: 15,
              AC: 7,
            },
            {
              name: "Thieves' Tools",
              amount: 1,
              wearing: false,
              category: "Equipment",
              costValue: 25,
              costCurrency: "gp" as const,
              weight: 1,
            },
          ]
        : []),
      ...(className === "cleric"
        ? [
            {
              name: "Mace",
              amount: 1,
              wearing: true,
              category: "Weapons",
              costValue: 5,
              costCurrency: "gp" as const,
              weight: 4,
            },
            {
              name: "Chain Mail",
              amount: 1,
              wearing: true,
              category: "Armor",
              costValue: 75,
              costCurrency: "gp" as const,
              weight: 40,
              AC: 5,
            },
            {
              name: "Holy Symbol",
              amount: 1,
              wearing: false,
              category: "Equipment",
              costValue: 10,
              costCurrency: "gp" as const,
              weight: 0,
            },
          ]
        : []),
      // Common items for all
      {
        name: "Backpack",
        amount: 1,
        wearing: false,
        category: "Equipment",
        costValue: 2,
        costCurrency: "gp" as const,
        weight: 2,
      },
      {
        name: "Rope, 50'",
        amount: 1,
        wearing: false,
        category: "Equipment",
        costValue: 1,
        costCurrency: "gp" as const,
        weight: 5,
      },
      {
        name: "Torches",
        amount: 6,
        wearing: false,
        category: "Equipment",
        costValue: 0,
        costCurrency: "cp" as const,
        weight: 6,
      },
      {
        name: "Rations, Trail (1 week)",
        amount: 1,
        wearing: false,
        category: "Equipment",
        costValue: 10,
        costCurrency: "gp" as const,
        weight: 14,
      },
    ],
    spells:
      className === "magic-user"
        ? [
            {
              name: "Magic Missile",
              range: "150'",
              level: {
                "magic-user": 1,
                spellcrafter: 1,
                paladin: null,
                cleric: null,
                druid: null,
                illusionist: null,
                necromancer: null,
              },
              duration: "Instantaneous",
              description:
                "Creates missiles of magical energy that automatically hit their target.",
            },
          ]
        : [],
    cantrips:
      className === "magic-user"
        ? [
            {
              name: "Light",
              classes: ["magic-user"],
              description:
                "Creates a bright light for 1 hour + 1 turn per level.",
            },
          ]
        : [],
    ...overrides,
  };
};

/**
 * Pre-built sample characters showcasing different races, classes, and builds
 */
export const SAMPLE_CHARACTERS: Character[] = [
  // Human Fighter - Classic tank build
  createSampleCharacter("Thorin Ironforge", "Human", "fighter", {
    abilities: {
      strength: { value: 16, modifier: 2 },
      intelligence: { value: 10, modifier: 0 },
      wisdom: { value: 12, modifier: 0 },
      dexterity: { value: 14, modifier: 1 },
      constitution: { value: 15, modifier: 1 },
      charisma: { value: 13, modifier: 1 },
    },
    hp: { current: 12, max: 12 },
    xp: 500,
  }),

  // Elf Magic-User - Classic spellcaster
  createSampleCharacter("Elara Moonwhisper", "Elf", "magic-user", {
    abilities: {
      strength: { value: 8, modifier: -1 },
      intelligence: { value: 16, modifier: 2 },
      wisdom: { value: 14, modifier: 1 },
      dexterity: { value: 15, modifier: 1 },
      constitution: { value: 12, modifier: 0 },
      charisma: { value: 13, modifier: 1 },
    },
    hp: { current: 6, max: 6 },
    xp: 750,
    spells: [
      {
        name: "Magic Missile",
        range: "150'",
        level: {
          "magic-user": 1,
          spellcrafter: 1,
          paladin: null,
          cleric: null,
          druid: null,
          illusionist: null,
          necromancer: null,
        },
        duration: "Instantaneous",
        description:
          "Creates missiles of magical energy that automatically hit their target.",
      },
      {
        name: "Sleep",
        range: "240'",
        level: {
          "magic-user": 1,
          spellcrafter: 1,
          paladin: null,
          cleric: null,
          druid: null,
          illusionist: null,
          necromancer: null,
        },
        duration: "4d4 turns",
        description: "Causes creatures to fall into magical slumber.",
      },
    ],
    cantrips: [
      {
        name: "Light",
        classes: ["magic-user"],
        description: "Creates a bright light for 1 hour + 1 turn per level.",
      },
      {
        name: "Prestidigitation",
        classes: ["magic-user"],
        description: "Performs minor magical tricks and illusions.",
      },
    ],
  }),

  // Halfling Thief - Stealth specialist
  createSampleCharacter("Pip Lightfinger", "Halfling", "thief", {
    abilities: {
      strength: { value: 10, modifier: 0 },
      intelligence: { value: 13, modifier: 1 },
      wisdom: { value: 12, modifier: 0 },
      dexterity: { value: 17, modifier: 2 },
      constitution: { value: 14, modifier: 1 },
      charisma: { value: 15, modifier: 1 },
    },
    hp: { current: 5, max: 5 },
    xp: 300,
    currency: {
      platinum: 0,
      gold: 85,
      electrum: 0,
      silver: 50,
      copper: 75,
    },
    avatar: "/avatars/warrior-man-3.webp",
  }),

  // Dwarf Cleric - Support character
  createSampleCharacter("Brother Marcus", "Dwarf", "cleric", {
    abilities: {
      strength: { value: 14, modifier: 1 },
      intelligence: { value: 11, modifier: 0 },
      wisdom: { value: 16, modifier: 2 },
      dexterity: { value: 10, modifier: 0 },
      constitution: { value: 16, modifier: 2 },
      charisma: { value: 14, modifier: 1 },
    },
    hp: { current: 10, max: 10 },
    xp: 1000,
  }),

  // Elf Multi-class (demonstrates advanced features)
  (() => {
    const character = createSampleCharacter(
      "Silvyr Dualwield",
      "Elf",
      "fighter",
      {
        abilities: {
          strength: { value: 15, modifier: 1 },
          intelligence: { value: 14, modifier: 1 },
          wisdom: { value: 13, modifier: 1 },
          dexterity: { value: 16, modifier: 2 },
          constitution: { value: 12, modifier: 0 },
          charisma: { value: 14, modifier: 1 },
        },
        xp: 2500,
        currency: {
          platinum: 2,
          gold: 150,
          electrum: 10,
          silver: 25,
          copper: 0,
        },
      }
    );

    // Set to magic-user-thief combination class (only elves can do this)
    character.class = "magic-user-thief";

    character.hp = { current: 10, max: 10 };

    return character;
  })(),
];

/**
 * Get a random sample character for quick demo purposes
 */
export const getRandomSampleCharacter = (): Character => {
  const randomIndex = Math.floor(Math.random() * SAMPLE_CHARACTERS.length);
  return SAMPLE_CHARACTERS[randomIndex]!;
};

/**
 * Get all sample characters with fresh IDs for mock persistence
 */
export const getAllSampleCharacters = (): Character[] => {
  return SAMPLE_CHARACTERS;
};
