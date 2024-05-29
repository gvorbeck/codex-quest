import { RaceNames, SavingThrowsType } from "@/data/definitions";
import { races } from "@/data/races";
import { titleCaseToCamelCase } from "./stringSupport";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";

const roller = new DiceRoller();

// Get the total of a dice roll matching the notation provided.
// Use count to roll dice multiple times.
export const rollDice = (dice: string, count?: number) => {
  if (!count) return roller.roll(dice).total;
  const results = [];
  for (let i = 0; i < count; i++) {
    results.push(roller.roll(dice).total);
  }
  return results;
};

// Calculate the modifier for an ability score.
export function calculateModifier(score: number) {
  let modifier;
  if (score === null) modifier = "";
  if (score === 3) modifier = "-3";
  else if (score <= 5) modifier = "-2";
  else if (score <= 8) modifier = "-1";
  else if (score <= 12) modifier = "+0";
  else if (score <= 15) modifier = "+1";
  else if (score <= 17) modifier = "+2";
  else if (score === 18) modifier = "+3";
  return modifier;
}

export const rollSavingThrow = (
  score: number,
  title: string,
  race: string,
  openNotification: (result: string, savingThrowTitle: string) => void,
) => {
  const raceModifier =
    races[race as RaceNames]?.savingThrows?.[
      titleCaseToCamelCase(title) as keyof SavingThrowsType
    ] || 0;
  const result = roller.roll(
    `d20${raceModifier > 0 ? `+${raceModifier}` : ""}`,
  );
  const passFail = result.total >= score ? "Pass" : "Fail";
  openNotification(result.output + " - " + passFail, title);
};

export const rollSpecialAbility = (
  score: number,
  title: string,
  openNotification: (result: string, specialAbilityTable: string) => void,
) => {
  const result = roller.roll(`d%`);
  const passFail = result.total <= score ? "Pass" : "Fail";
  openNotification(result.output + " - " + passFail, title);
};
