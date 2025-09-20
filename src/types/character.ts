import type { CHARACTER_CLASSES } from "@/constants";

export interface AbilityScore {
  value: number;
  modifier: number;
}

export interface Spell {
  name: string;
  range: string;
  level: {
    spellcrafter: number | null;
    paladin: number | null;
    cleric: number | null;
    "magic-user": number | null;
    druid: number | null;
    illusionist: number | null;
    necromancer: number | null;
  };
  duration: string;
  description: string;
  // Optional preparation metadata for cleric-type characters
  preparation?: {
    slotLevel: number;
    slotIndex: number;
  };
}

export interface Cantrip {
  name: string;
  classes: string[]; // Classes that can learn this cantrip
  description: string;
}

export interface ScrollCreationProject {
  id: string;
  spellName: string;
  spellLevel: number;
  startDate: string; // ISO date string
  daysRequired: number;
  daysCompleted: number;
  costTotal: number;
  costPaid: number;
  status: "in-progress" | "completed" | "paused" | "failed";
  notes?: string;
}

export interface Equipment {
  name: string;
  costValue: number;
  costCurrency: "gp" | "sp" | "cp";
  weight: number;
  category: string;
  subCategory?: string;
  amount: number;
  // Weapon properties
  size?: "S" | "M" | "L";
  damage?: string;
  twoHandedDamage?: string;
  type?: "melee" | "missile" | "both";
  range?: [number, number, number];
  ammo?: string[];
  // Armor properties
  AC?: number | string;
  missileAC?: string;
  // Beast of burden properties
  lowCapacity?: number;
  capacity?: number;
  animalWeight?: number;
  // Equipment with gold amount
  gold?: number;
  wearing?: boolean; // For armor and shields
  description?: string; // Optional description for the equipment
  // Magic item properties for scrolls
  isScroll?: boolean;
  scrollSpell?: string;
  scrollLevel?: number;
}

export interface PackItem {
  /** The exact name of the equipment item as it appears in equipment.json */
  equipmentName: string;
  /** How many of this item to include in the pack */
  quantity: number;
  /** Optional description of why this item is included in the pack */
  description?: string;
}

export interface EquipmentPack {
  /** Unique identifier for the pack */
  id: string;
  /** Display name of the pack */
  name: string;
  /** Description explaining what the pack is for */
  description: string;
  /** Total cost in gold pieces */
  cost: number;
  /** Total weight in pounds */
  weight: number;
  /** List of equipment items included in this pack */
  items: PackItem[];
  /** Optional criteria for when this pack is recommended */
  suitableFor?: {
    /** Classes that would benefit from this pack */
    classes?: string[];
    /** Races that would benefit from this pack */
    races?: string[];
    /** Character levels where this pack is most useful */
    levels?: number[];
  };
}

export interface PackApplicationResult {
  /** Whether the pack was successfully applied */
  success: boolean;
  /** Error message if application failed */
  error?: string;
  /** Items that couldn't be found in equipment.json */
  missingItems?: string[];
  /** Total cost of items that were successfully added */
  totalCost?: number;
  /** Total weight of items that were successfully added */
  totalWeight?: number;
}

export interface Character {
  name: string;
  race: string;
  class: string[]; // Array of class IDs - single item for normal class, multiple for combination
  abilities: {
    strength: AbilityScore;
    dexterity: AbilityScore;
    constitution: AbilityScore;
    intelligence: AbilityScore;
    wisdom: AbilityScore;
    charisma: AbilityScore;
  };
  equipment: Equipment[];
  currency: {
    gold: number;
    silver?: number;
    copper?: number;
    electrum?: number;
    platinum?: number;
  };
  desc?: string;
  hp: {
    current: number;
    max: number;
    desc?: string;
    die?: string; // e.g., "1d6", "1d8", etc.
  };
  level: number;
  cantrips?: Cantrip[]; // Names of cantrips known by the character
  spells?: Spell[]; // Spells known by the character
  languages?: string[]; // Languages known by the character
  avatar?: string; // Avatar image URL or path
  settings?: {
    useCoinWeight?: boolean; // Whether to include coin weight in encumbrance calculations
    showCantrips?: boolean; // Whether to show the cantrips/orisons section
    version?: number; // Data format version for migration purposes
  };
  xp: number; // Total experience points
  scrollCreation?: {
    projects: ScrollCreationProject[];
    totalScrollsCreated?: number;
    bonuses?: {
      researchRollBonus?: number; // +25% for Spellcrafters
      timeReduction?: number; // 50% at 6th level
      costReduction?: number; // 25% at 9th level
    };
  };
}

export interface RaceRequirement {
  ability: keyof Character["abilities"];
  min?: number;
  max?: number;
}

export interface SpecialAbility {
  name: string;
  description: string;
  // Mechanical effects for programmatic use by character sheet components
  effects?: {
    // Combat bonuses/penalties
    attackBonus?: {
      value: number;
      conditions?: string[]; // e.g., ["ranged weapons", "in bright light"]
    };
    acBonus?: {
      value: number;
      conditions?: string[]; // e.g., ["vs creatures larger than man-sized"]
    };
    initiativeBonus?: {
      value: number;
    };
    // Saving throw bonuses are handled separately in savingThrows array
    // Other mechanical effects can be added here as needed
    experienceBonus?: {
      value: number; // percentage bonus
      conditions?: string[]; // e.g., ["not combination class"]
    };
    // Vision/detection abilities
    darkvision?: {
      range: number; // in feet
    };
    // Dice modifications
    hitDiceRestriction?: {
      maxSize?: "d4" | "d6" | "d8" | "d10" | "d12";
      sizeDecrease?: number; // Reduce die size by this many steps
    };
    hitDiceBonus?: {
      sizeIncrease: number; // Increase die size by this many steps
    };
    // Special bonuses
    strengthBonus?: {
      value: number;
      conditions?: string[]; // e.g., ["feats of strength", "opening doors"]
    };
    reactionBonus?: {
      value: number;
      conditions?: string[]; // e.g., ["vs canine creatures", "vs humanoids human-size or smaller"]
    };
    savingThrowBonus?: {
      value: number;
      conditions?: string[]; // e.g., ["vs fey charm effects"]
    };
    naturalArmor?: {
      baseAC: number; // Base armor class
      rearAC?: number; // Special rear armor class
    };
  };
}

export interface SavingThrowBonus {
  type: string;
  bonus: number;
}

export interface CarryingCapacity {
  light: number; // Maximum light load in pounds
  heavy: number; // Maximum heavy load in pounds
  strengthModifier: {
    positive: number; // Multiplier for positive STR modifiers (e.g. 0.1 = +10% per +1)
    negative: number; // Multiplier for negative STR modifiers (e.g. 0.2 = -20% per -1)
  };
}

export interface Race {
  name: string;
  id: string;
  description: string;
  physicalDescription: string;
  allowedClasses: string[];
  abilityRequirements: RaceRequirement[];
  prohibitedWeapons?: string[]; // Array of equipment IDs that this race cannot use
  specialAbilities: SpecialAbility[];
  savingThrows: SavingThrowBonus[];
  lifespan: string;
  languages: string[]; // Languages automatically known by this race
  carryingCapacity: CarryingCapacity;
  supplementalContent?: boolean;
}

export interface Class {
  name: string;
  id: string;
  classType:
    | typeof CHARACTER_CLASSES.FIGHTER
    | typeof CHARACTER_CLASSES.THIEF
    | typeof CHARACTER_CLASSES.CLERIC
    | typeof CHARACTER_CLASSES.MAGIC_USER;
  description: string;
  hitDie: string;
  primaryAttribute: keyof Character["abilities"];
  abilityRequirements: RaceRequirement[];
  allowedWeapons: string[];
  allowedArmor: string[];
  spellcasting?: {
    spellsPerLevel: { [level: number]: number[] }; // spellsPerLevel[characterLevel] = [1st level spells, 2nd level spells, etc.]
  };
  specialAbilities: SpecialAbility[];
  experienceTable: { [level: number]: number };
  skills?: { [level: number]: { [skill: string]: number } }; // For classes with skill progression
  supplementalContent?: boolean; // Indicates if this class is part of supplemental content
}

// Base interface for character creation step props
export interface BaseStepProps {
  character: Character;
  onCharacterChange: (character: Character) => void;
}

// Game rules type exports - derived from gameRules constants
export type CharacterClass =
  (typeof CHARACTER_CLASSES)[keyof typeof CHARACTER_CLASSES];
export type SkillKey =
  | "openLocks"
  | "removeTraps"
  | "detectTraps"
  | "pickPockets"
  | "moveSilently"
  | "climbWalls"
  | "hide"
  | "listen"
  | "poison"
  | "tracking";
export type SkillClassKey = "thief" | "assassin" | "ranger" | "scout";
export type TwoHPClass =
  | "fighter"
  | "thief"
  | "assassin"
  | "barbarian"
  | "ranger"
  | "paladin"
  | "scout";

// Character system types
export type SpellSystemType = "magic-user" | "cleric" | "custom" | "none";

export interface RacialModificationInfo {
  abilityName: string;
  originalHitDie: string;
  modifiedHitDie: string;
  modificationType: "restriction" | "increase" | "decrease";
}

// Character progression types
export interface HPGainResult {
  roll: number | null;
  constitutionBonus: number | null;
  total: number;
  max: number | null;
  breakdown: string;
  isFixed: boolean;
}

export interface SpellGainInfo {
  level: number;
  newSpells: number[];
  totalSpellsGained: number;
  spellsByLevel: Array<{ spellLevel: number; count: number; spells: Spell[] }>;
}
