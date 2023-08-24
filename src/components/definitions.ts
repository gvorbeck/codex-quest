import { SavingThrowsType } from "./CharacterSheet/SavingThrows/definitions";
import { Abilities } from "./CreateCharacter/CharacterAbilities/definitions";

interface HP {
  dice: string;
  points: number;
  max: number;
  desc: string;
}

export interface SpellLevels {
  cleric: number | null;
  "magic-user": number | null;
  druid: number | null;
  illusionist: number | null;
}

export interface Spell {
  name: string;
  range: string;
  level: SpellLevels;
  duration: string;
  description: string;
}

interface SpecialRestriction {
  race: string[];
  class: string[];
}

export interface CharacterData {
  abilities: Abilities;
  class: string;
  race: string;
  hp: HP;
  spells: Spell[];
  gold: number;
  equipment: EquipmentItem[];
  weight: number;
  name: string;
  avatar: string;
  id?: string;
  level: number;
  specials: SpecialRestriction;
  restrictions: SpecialRestriction;
  savingThrows: SavingThrowsType;
  xp: number;
  desc: string;
  wearing?: { armor: string; shield: string };
}

export interface EquipmentItem {
  name: string;
  costValue: number;
  costCurrency: string;
  weight?: number;
  category: string;
  size?: string;
  damage?: string;
  AC?: string | number;
  amount: number;
  type?: string;
  range?: number[];
}

export type Capacity = { light: number; heavy: number };
export type CapacityMap = Record<string, Capacity>;

export type SpellItem = {
  name: string;
};

export interface SpellType {
  name: string;
  range: string;
  level: SpellLevels;
  duration: string;
  description: string;
}

export type SavingThrows = {
  deathRayOrPoison: number;
  magicWands: number;
  paralysisOrPetrify: number;
  dragonBreath: number;
  spells: number;
};

export enum DiceTypes {
  D4 = "d4",
  D6 = "d6",
  D8 = "d8",
  D10 = "d10",
  D12 = "d12",
  D20 = "d20",
  D100 = "d100",
}

export enum ClassNames {
  ASSASSIN = "Assassin",
  BARBARIAN = "Barbarian",
  CLERIC = "Cleric",
  DRUID = "Druid",
  FIGHTER = "Fighter",
  ILLUSIONIST = "Illusionist",
  MAGICUSER = "Magic-User",
  THIEF = "Thief",
  CUSTOM = "Custom",
}

export enum RaceNames {
  DWARF = "Dwarf",
  ELF = "Elf",
  GNOME = "Gnome",
  HALFLING = "Halfling",
  HUMAN = "Human",
  CUSTOM = "Custom",
}
