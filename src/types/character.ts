export interface AbilityScore {
  value: number;
  modifier: number;
}

export interface Character {
  name: string;
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
