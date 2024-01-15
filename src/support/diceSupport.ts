import { RaceNames, SavingThrowsType } from "@/data/definitions";
import { races } from "@/data/races";
import { titleCaseToCamelCase } from "./stringSupport";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";

const roller = new DiceRoller();
export const rollDice = (dice: string) => roller.roll(dice).total;

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
