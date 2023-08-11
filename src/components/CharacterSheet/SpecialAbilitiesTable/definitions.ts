export interface SpecialAbilitiesTableProps {
  characterLevel: string;
  characterClass: string;
  className?: string;
}

export interface AbilitiesArray {
  [key: string]: { [level: string]: number[] };
}

export type CharacterClass = "thief" | "assassin";
