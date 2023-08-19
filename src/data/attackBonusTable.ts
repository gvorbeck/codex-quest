import { ClassNames } from "../components/definitions";

const thiefAndAssassin = [
  0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8,
];

const fighterAndBarbarian = [
  0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 6, 7, 7, 8, 8, 8, 9, 9, 10, 10, 10,
];

const clericAndDruid = [
  0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8,
];

const magicUserAndIllusionist = [
  0, 1, 1, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7,
];

export const attackBonusTable: Record<string, number[]> = {
  [ClassNames.FIGHTER]: fighterAndBarbarian,
  [ClassNames.BARBARIAN]: fighterAndBarbarian,
  [ClassNames.CLERIC]: clericAndDruid,
  [ClassNames.DRUID]: clericAndDruid,
  [ClassNames.MAGICUSER]: magicUserAndIllusionist,
  [ClassNames.ILLUSIONIST]: magicUserAndIllusionist,
  [ClassNames.THIEF]: thiefAndAssassin,
  [ClassNames.ASSASSIN]: thiefAndAssassin,
};
