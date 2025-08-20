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
  equipment: unknown[];
  spells?: Spell[]; // Spells known by the character
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
  abilityRequirements: RaceRequirement[];
  prohibitedWeapons?: string[]; // Array of equipment IDs that this race cannot use
  specialAbilities: SpecialAbility[];
  savingThrows: SavingThrowBonus[];
  lifespan: string;
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
