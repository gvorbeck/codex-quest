import { ClassNames } from "../../components/definitions";

const clericAndDruidSpellBudget = [
  [0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0],
  [2, 0, 0, 0, 0, 0],
  [2, 1, 0, 0, 0, 0],
  [2, 2, 0, 0, 0, 0],
  [2, 2, 1, 0, 0, 0],
  [3, 2, 2, 0, 0, 0],
  [3, 2, 2, 1, 0, 0],
  [3, 3, 2, 2, 0, 0],
  [3, 3, 2, 2, 1, 0],
  [4, 3, 3, 2, 2, 0],
  [4, 4, 3, 2, 2, 1],
  [4, 4, 3, 3, 2, 2],
  [4, 4, 4, 3, 2, 2],
  [4, 4, 4, 3, 3, 2],
  [5, 4, 4, 3, 3, 2],
  [5, 5, 4, 3, 3, 2],
  [5, 5, 4, 4, 3, 3],
  [6, 5, 4, 4, 3, 3],
  [6, 5, 5, 4, 3, 3],
];

const magicUserAndIllusionistSpellBudget = [
  [2, 0, 0, 0, 0, 0],
  [3, 0, 0, 0, 0, 0],
  [3, 1, 0, 0, 0, 0],
  [3, 2, 0, 0, 0, 0],
  [3, 2, 1, 0, 0, 0],
  [4, 2, 2, 0, 0, 0],
  [4, 2, 2, 1, 0, 0],
  [4, 3, 2, 2, 0, 0],
  [4, 3, 2, 2, 1, 0],
  [5, 3, 3, 2, 2, 0],
  [5, 4, 3, 2, 2, 1],
  [5, 4, 3, 3, 2, 2],
  [5, 4, 4, 3, 2, 2],
  [5, 4, 4, 3, 3, 2],
  [6, 4, 4, 3, 3, 2],
  [6, 5, 4, 3, 3, 2],
  [6, 5, 4, 4, 3, 3],
  [7, 5, 4, 4, 3, 3],
  [7, 5, 5, 4, 3, 3],
  [7, 5, 5, 4, 4, 3],
];

const clericSpellBudget = clericAndDruidSpellBudget;

const druidSpellBudget = clericAndDruidSpellBudget;

export const spellBudgets = {
  [ClassNames.CLERIC]: clericSpellBudget,
  [ClassNames.DRUID]: druidSpellBudget,
  [ClassNames.MAGICUSER]: magicUserAndIllusionistSpellBudget,
  [ClassNames.ILLUSIONIST]: magicUserAndIllusionistSpellBudget,
};
