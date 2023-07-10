export interface SpecialAbilitiesTableProps {
  characterLevel: string;
  abilityNames: string[];
  characterClass: string;
}

export interface AbilitiesArray {
  [key: string]: { [level: string]: number[] };
}
