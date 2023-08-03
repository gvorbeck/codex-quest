import { ClassNames } from "../components/definitions";

export const attackBonusTable: Record<string, number[]> = {
  [ClassNames.FIGHTER]: [
    0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 6, 7, 7, 8, 8, 8, 9, 9, 10, 10, 10,
  ],
  [ClassNames.CLERIC]: [
    0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8,
  ],
  [ClassNames.MAGICUSER]: [
    0, 1, 1, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7,
  ],
  [ClassNames.THIEF]: [
    0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8,
  ],
  [ClassNames.ASSASSIN]: [
    0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8,
  ],
};
