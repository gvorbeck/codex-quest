import { CharacterData } from "../../definitions";

export interface SavingThrows {
  deathRayOrPoison: number;
  magicWands: number;
  paralysisOrPetrify: number;
  dragonBreath: number;
  spells: number;
}

export interface SavingThrowsTables {
  [characterClass: string]: {
    [levelRange: string]: SavingThrows;
  };
}

export interface SavingThrowsProps {
  characterData: CharacterData;
}
