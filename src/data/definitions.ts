export enum EquipmentCategories {
  GENERAL = "general-equipment",
  AXES = "axes",
  BOWS = "bows",
  DAGGERS = "daggers",
  SWORDS = "swords",
  HAMMERMACE = "hammers-and-maces",
  OTHERWEAPONS = "other-weapons",
  SPEARSPOLES = "spears-and-polearms",
  IMPROVISED = "improvised-weapons",
  CHAINFLAIL = "chain-and-flail",
  SLINGHURLED = "slings-and-hurled-weapons",
  AMMUNITION = "ammunition",
  ARMOR = "armor",
  SHIELDS = "shields",
  BARDING = "barding",
  BEASTS = "beasts-of-burden",
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
  NECROMANCER = "Necromancer",
  RANGER = "Ranger",
  CUSTOM = "Custom",
  PALADIN = "Paladin",
  SCOUT = "Scout",
  SPELLCRAFTER = "Spellcrafter",
}

export enum RaceNames {
  DWARF = "Dwarf",
  ELF = "Elf",
  GNOME = "Gnome",
  HALFLING = "Halfling",
  HUMAN = "Human",
  CUSTOM = "Custom",
  HALFELF = "Half-Elf",
  HALFOGRE = "Half-Ogre",
  HALFORC = "Half-Orc",
  BISREN = "Bisren",
  CANEIN = "Canein",
  CHELONIAN = "Chelonian",
  FAUN = "Faun",
  PHAERIM = "Phaerim",
}

export enum DiceTypes {
  D4 = "d4",
  D6 = "d6",
  D8 = "d8",
  D10 = "d10",
  D12 = "d12",
  D20 = "d20",
  D100 = "d100",
}

export type SavingThrowsType = {
  deathRayOrPoison: number;
  magicWands: number;
  paralysisOrPetrify: number;
  dragonBreath: number;
  spells: number;
};

export type Spell = {
  description: string;
  duration: string;
  level: Record<string, number | null>;
  name: string;
  range: string;
};

export type Abilities = {
  strength: number | string;
  intelligence: number | string;
  wisdom: number | string;
  dexterity: number | string;
  constitution: number | string;
  charisma: number | string;
};

export type EquipmentItem = {
  name: string;
  costValue: number;
  costCurrency: string;
  category: string;
  amount: number;
  weight?: number;
  size?: string;
  damage?: string;
  missileAC?: string;
  AC?: string | number;
  type?: string;
  range?: number[];
  ammo?: string[];
  noDelete?: boolean;
  minLevel?: number;
};

type SpecialRestriction = {
  race: string[];
  class: string[];
};

export type CharacterData = {
  abilities: {
    scores: Abilities;
    modifiers: Abilities;
  };
  avatar: string;
  class: string[];
  desc: string | string[];
  equipment: EquipmentItem[];
  gold: number;
  hp: {
    dice: string;
    points: number;
    max: number;
    desc: string;
  };
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

export type AttackType = "melee" | "missile";

export type AbilityRecord = {
  key: string;
  ability: string;
  score: number;
};

export type GamesData = {
  id?: string;
};
