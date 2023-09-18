import { CharacterData } from "../../definitions";

export type SavingThrowsType = {
  deathRayOrPoison: number;
  magicWands: number;
  paralysisOrPetrify: number;
  dragonBreath: number;
  spells: number;
};

export interface SavingThrowsTables {
  [characterClass: string]: {
    [levelRange: string]: SavingThrowsType;
  };
}

export interface SavingThrowsProps {
  characterData: CharacterData;
  className?: string;
}
