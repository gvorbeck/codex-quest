// Mock character data for testing
// Provides realistic test data for character creation, validation, and manipulation

import type { Character, Equipment, Spell } from "@/types";

export const mockAbilityScores = {
  strength: { value: 15, modifier: 1 },
  dexterity: { value: 13, modifier: 1 },
  constitution: { value: 14, modifier: 1 },
  intelligence: { value: 12, modifier: 0 },
  wisdom: { value: 10, modifier: 0 },
  charisma: { value: 8, modifier: -1 },
};

export const mockEquipment: Equipment[] = [
  {
    name: "Longsword",
    costValue: 15,
    costCurrency: "gp",
    weight: 3,
    category: "weapon",
    amount: 1,
    damage: "1d8",
    type: "melee",
  },
  {
    name: "Leather Armor",
    costValue: 5,
    costCurrency: "gp",
    weight: 15,
    category: "armor",
    amount: 1,
    AC: 12,
  },
  {
    name: "Shield",
    costValue: 10,
    costCurrency: "gp",
    weight: 6,
    category: "shield",
    amount: 1,
    AC: 1,
  },
];

export const mockSpells: Spell[] = [
  {
    name: "Magic Missile",
    level: {
      spellcrafter: null,
      paladin: null,
      cleric: null,
      "magic-user": 1,
      druid: null,
      illusionist: null,
      necromancer: null,
    },
    range: "150'",
    duration: "instantaneous",
    description: "Automatically hits target for 1d4+1 damage",
  },
];

export const mockBasicCharacter: Character = {
  name: "Test Fighter",
  abilities: mockAbilityScores,
  race: "human",
  class: ["fighter"],
  level: 1,
  xp: 0,
  hp: { current: 8, max: 8, die: "1d8" },
  equipment: mockEquipment,
  currency: { gold: 30, silver: 0, copper: 0 },
  settings: { version: 2.5 },
};

export const mockMagicUserCharacter: Character = {
  name: "Test Wizard",
  abilities: {
    ...mockAbilityScores,
    intelligence: { value: 16, modifier: 2 },
    constitution: { value: 10, modifier: 0 },
  },
  race: "human",
  class: ["magic-user"],
  level: 1,
  xp: 0,
  hp: { current: 4, max: 4, die: "1d4" },
  equipment: [
    {
      name: "Dagger",
      costValue: 2,
      costCurrency: "gp",
      weight: 1,
      category: "weapon",
      amount: 1,
      damage: "1d4",
      type: "melee",
    },
  ],
  spells: mockSpells,
  currency: { gold: 25, silver: 0, copper: 0 },
  settings: { version: 2.5 },
};

export const mockMultiClassCharacter: Character = {
  name: "Test Fighter/Magic-User",
  abilities: {
    ...mockAbilityScores,
    intelligence: { value: 14, modifier: 1 },
  },
  race: "elf",
  class: ["fighter", "magic-user"],
  level: 1,
  xp: 0,
  hp: { current: 6, max: 6, die: "1d6" },
  equipment: mockEquipment,
  spells: mockSpells,
  currency: { gold: 50, silver: 0, copper: 0 },
  settings: { version: 2.5 },
};

export const mockEmptyCharacter: Character = {
  name: "",
  abilities: {
    strength: { value: 0, modifier: 0 },
    dexterity: { value: 0, modifier: 0 },
    constitution: { value: 0, modifier: 0 },
    intelligence: { value: 0, modifier: 0 },
    wisdom: { value: 0, modifier: 0 },
    charisma: { value: 0, modifier: 0 },
  },
  race: "",
  class: [],
  level: 1,
  xp: 0,
  hp: { current: 0, max: 0 },
  equipment: [],
  currency: { gold: 0 },
  settings: { version: 2.5 },
};
