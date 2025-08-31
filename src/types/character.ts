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
  };
  level: number;
  cantrips?: Cantrip[]; // Names of cantrips known by the character
  spells?: Spell[]; // Spells known by the character
  languages?: string[]; // Languages known by the character
  avatar?: string; // Avatar image URL or path
  settings?: {
    useCoinWeight?: boolean; // Whether to include coin weight in encumbrance calculations
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
  supplementalContent?: boolean;
}

export interface Class {
  name: string;
  id: string;
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
  thiefSkills?: { [level: number]: { [skill: string]: number } }; // For thieves
  supplementalContent?: boolean; // Indicates if this class is part of supplemental content
}

// Base interface for character creation step props
export interface BaseStepProps {
  character: Character;
  onCharacterChange: (character: Character) => void;
}
