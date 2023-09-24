import { SpellLevels } from "../data/definitions";
import { SavingThrowsType } from "./CharacterSheet/SavingThrows/definitions";
import { Abilities } from "./CharacterCreator/CharacterAbilities/definitions";
import { EquipmentItem } from "./EquipmentStore/definitions";

interface HP {
  dice: string;
  points: number;
  max: number;
  desc: string;
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

export type CharacterData = {
  abilities: Abilities;
  avatar: string;
  class: string[];
  desc: string | string[];
  equipment: EquipmentItem[];
  gold: number;
  hp: HP;
  id?: string;
  level: number;
  name: string;
  race: string;
  restrictions: SpecialRestriction;
  savingThrows: SavingThrowsType;
  specials: SpecialRestriction;
  spells: Spell[];
  wearing?: { armor: string; shield: string };
  weight: number;
  xp: number;
};

export type SetCharacterData = (characterData: CharacterData) => void;

export interface CharacterDataStatePair {
  characterData: CharacterData;
  setCharacterData: SetCharacterData;
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
