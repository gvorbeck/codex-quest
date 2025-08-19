export interface AbilityScore {
  value: number;
  modifier: number;
}

export interface Character {
  name: string;
  race: string;
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
    type: "divine" | "arcane";
    spellsPerLevel: { [level: number]: number[] }; // spellsPerLevel[characterLevel] = [1st level spells, 2nd level spells, etc.]
  };
  specialAbilities: SpecialAbility[];
  experienceTable: { [level: number]: number };
  savingThrows: { [level: number]: { [saveType: string]: number } };
  thac0Table?: { [level: number]: number }; // For fighters mainly
  thiefSkills?: { [level: number]: { [skill: string]: number } }; // For thieves
}
