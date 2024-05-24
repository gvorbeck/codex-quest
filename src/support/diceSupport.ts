import { Chances, Loot, RaceNames, SavingThrowsType } from "@/data/definitions";
import { races } from "@/data/races";
import { titleCaseToCamelCase } from "./stringSupport";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";

const roller = new DiceRoller();

// NEW
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

// NEW
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

export const emptyLoot: Loot = {
  copper: 0,
  silver: 0,
  electrum: 0,
  gold: 0,
  platinum: 0,
  gems: 0,
  jewels: 0,
  magicItems: 0,
};

export function generateUnguardedTreasure(level: number): Loot {
  const chances: Chances = {
    copper: [0, 0, 0],
    silver: [0, 0, 0],
    electrum: [0, 0, 0],
    gold: [0, 0, 0],
    platinum: [0, 0, 0],
    gems: [0, 0, 0],
    jewels: [0, 0, 0],
    magicItems: 0,
  };
  const loot = { ...emptyLoot };

  switch (level) {
    case 1:
      chances.copper = [0.75, 8, 1];
      chances.silver = [0.5, 6, 1];
      chances.electrum = [0.25, 4, 1];
      chances.gold = [0.07, 4, 1];
      chances.platinum = [0.01, 4, 1];
      chances.gems = [0.07, 4, 1];
      chances.jewels = [0.03, 4, 1];
      chances.magicItems = 0.02;
      break;
    case 2:
      chances.copper = [0.5, 10, 1];
      chances.silver = [0.5, 8, 1];
      chances.electrum = [0.25, 6, 1];
      chances.gold = [0.2, 6, 1];
      chances.platinum = [0.02, 4, 1];
      chances.gems = [0.1, 6, 1];
      chances.jewels = [0.07, 4, 1];
      chances.magicItems = 0.05;
      break;
    case 3:
      chances.copper = [0.3, 6, 2];
      chances.silver = [0.5, 10, 1];
      chances.electrum = [0.25, 8, 1];
      chances.gold = [0.5, 6, 1];
      chances.platinum = [0.04, 4, 1];
      chances.gems = [0.15, 6, 1];
      chances.jewels = [0.07, 6, 1];
      chances.magicItems = 0.08;
      break;
    case 4:
    case 5:
      chances.copper = [0.2, 6, 3];
      chances.silver = [0.5, 6, 2];
      chances.electrum = [0.25, 10, 1];
      chances.gold = [0.5, 6, 2];
      chances.platinum = [0.08, 4, 1];
      chances.gems = [0.2, 8, 1];
      chances.jewels = [0.1, 6, 1];
      chances.magicItems = 0.12;
      break;
    case 6:
    case 7:
      chances.copper = [0.15, 6, 4];
      chances.silver = [0.5, 6, 3];
      chances.electrum = [0.25, 12, 1];
      chances.gold = [0.7, 8, 2];
      chances.platinum = [0.15, 4, 1];
      chances.gems = [0.3, 8, 1];
      chances.jewels = [0.15, 6, 1];
      chances.magicItems = 0.16;
      break;
    case 8:
    default:
      chances.copper = [0.1, 6, 5];
      chances.silver = [0.5, 6, 5];
      chances.electrum = [0.25, 8, 2];
      chances.gold = [0.75, 6, 4];
      chances.platinum = [0.3, 4, 1];
      chances.gems = [0.4, 8, 1];
      chances.jewels = [0.3, 8, 1];
      chances.magicItems = 0.2;
      break;
  }

  const roll = (d: number) => Math.floor(Math.random() * d) + 1;
  const getAmount = (
    chance: number,
    d: number,
    numDice: number,
    amount: number = 1,
  ) => {
    let total = 0;
    if (Math.random() <= chance) {
      for (let i = 0; i < numDice; i++) {
        total += roll(d);
      }
    }
    return total * amount;
  };
  const hasMagicItem = Math.random() <= chances.magicItems ? 1 : 0;

  (Object.keys(loot) as (keyof Loot)[]).forEach((key) => {
    if (key !== "magicItems") {
      const notGemOrJewel = key !== "gems" && key !== "jewels";
      loot[key] = getAmount(
        chances[key][0], // % chance
        chances[key][1], // the type of die
        chances[key][2], // number of dice
        notGemOrJewel ? 100 : 1,
      );
    } else {
      loot[key] = hasMagicItem;
    }
  });

  return loot;
}
