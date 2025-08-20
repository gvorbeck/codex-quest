export interface AbilityScore {
  value: number;
  modifier: number;
}

export interface Character {
  name: string;
  race: string;
  class?: string; // Single class
  combinationClass?: string; // Combination class like "fighter/magic-user"
  abilities: {
    strength: AbilityScore;
    dexterity: AbilityScore;
    constitution: AbilityScore;
    intelligence: AbilityScore;
    wisdom: AbilityScore;
    charisma: AbilityScore;
  };
  equipment: unknown[];
}

export interface RaceRequirement {
  ability: keyof Character["abilities"];
  min?: number;
  max?: number;
}

export interface SpecialAbility {
  name: string;
  description: string;
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
  allowedCombinationClasses?: string[]; // New field for combination classes
  abilityRequirements: RaceRequirement[];
  prohibitedWeapons?: string[]; // Array of equipment IDs that this race cannot use
  specialAbilities: SpecialAbility[];
  savingThrows: SavingThrowBonus[];
  lifespan: string;
  supplementalContent?: boolean;
}

export interface CombinationClass {
  name: string;
  id: string;
  description: string;
  hitDie: string;
  primaryClasses: [string, string]; // The two classes being combined
  specialAbilities: SpecialAbility[];
  eligibleRaces: string[]; // Races that can take this combination class
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
