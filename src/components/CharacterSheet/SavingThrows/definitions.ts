import { CharacterData, SavingThrows } from "../../../data/definitions";
// import { CharacterData } from "../../definitions";

// export type SavingThrowsType = {
//   deathRayOrPoison: number;
//   magicWands: number;
//   paralysisOrPetrify: number;
//   dragonBreath: number;
//   spells: number;
// };

export interface SavingThrowsTables {
  [characterClass: string]: {
    [levelRange: string]: SavingThrows;
  };
}

export interface SavingThrowsProps {
  characterData: CharacterData;
}

export type TableCellRecord = {
  score: number;
  throw: string;
};
