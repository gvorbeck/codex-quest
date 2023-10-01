import { CharacterData, SavingThrowsType } from "../../../data/definitions";

export interface SavingThrowsTables {
  [characterClass: string]: {
    [levelRange: string]: SavingThrowsType;
  };
}

export interface SavingThrowsProps {
  characterData: CharacterData;
}

export type TableCellRecord = {
  score: number;
  throw: string;
};
