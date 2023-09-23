export interface SpecialAbilitiesTableProps {
  characterLevel: number;
  characterClass: string;
}

export interface AbilitiesArray {
  [key: string]: { [level: string]: number[] };
}

export type CharacterClass = "thief" | "assassin";
