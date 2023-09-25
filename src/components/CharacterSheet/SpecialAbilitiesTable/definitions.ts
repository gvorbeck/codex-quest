import { RaceNames } from "../../../data/definitions";

export interface SpecialAbilitiesTableProps {
  characterLevel: number;
  characterClass: string;
  characterRace: RaceNames;
}

export interface AbilitiesArray {
  [key: string]: { [level: string]: number[] };
}

export type CharacterClass = "thief" | "assassin";
