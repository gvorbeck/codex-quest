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

export function generateLoot(level: number): Loot {
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

export function generateJewels(loot: Loot) {
  const jewels = [];

  function getJewel() {
    const n = Math.floor(Math.random() * 100) + 1;
    if (n <= 6) return "Anklet";
    if (n <= 12) return "Belt";
    if (n <= 14) return "Bowl";
    if (n <= 21) return "Bracelet";
    if (n <= 27) return "Brooch";
    if (n <= 32) return "Buckle";
    if (n <= 37) return "Chain";
    if (n <= 40) return "Choker";
    if (n <= 42) return "Circlet";
    if (n <= 47) return "Clasp";
    if (n <= 51) return "Comb";
    if (n <= 52) return "Crown";
    if (n <= 55) return "Cup";
    if (n <= 62) return "Earring";
    if (n <= 65) return "Flagon";
    if (n <= 68) return "Goblet";
    if (n <= 73) return "Knife";
    if (n <= 77) return "Letter Opener";
    if (n <= 80) return "Locket";
    if (n <= 82) return "Medal";
    if (n <= 89) return "Necklace";
    if (n <= 90) return "Plate";
    if (n <= 95) return "Pin";
    if (n <= 96) return "Scepter";
    if (n <= 99) return "Statuette";
    return "Tiara";
  }

  for (let i = 0; i < loot.jewels; i++) {
    const value = rollDice("2d8") * 100;
    const type = getJewel();
    jewels.push({ type, value });
  }

  return jewels;
}

export function generateGems(loot: Loot) {
  const gems = [];

  const values = [5, 10, 50, 100, 500, 1000, 5000];

  function getBaseDescription(quality: number) {
    if (quality <= 20)
      return {
        quality: "Ornamental",
        baseValue: values[1],
        amount: Math.floor(Math.random() * 10) + 1,
      };
    if (quality <= 45)
      return {
        quality: "Semiprecious",
        baseValue: values[2],
        amount: Math.floor(Math.random() * 8) + 1,
      };
    if (quality <= 75)
      return {
        quality: "Fancy",
        baseValue: values[3],
        amount: Math.floor(Math.random() * 6) + 1,
      };
    if (quality <= 95)
      return {
        quality: "Precious",
        baseValue: values[4],
        amount: Math.floor(Math.random() * 4) + 1,
      };
    return {
      quality: "Gem",
      baseValue: values[5],
      amount: Math.floor(Math.random() * 2) + 1,
    };
  }

  function getValue(baseValue: number) {
    const adjusted = rollDice("2d6");
    if (adjusted === 2)
      return values[values.findIndex((value) => value === baseValue) - 1];
    if (adjusted === 3) return Math.floor(baseValue / 2);
    if (adjusted === 4) return Math.floor(baseValue * 0.75);
    if (adjusted <= 9) return baseValue;
    if (adjusted === 10) return Math.floor(baseValue * 1.5);
    if (adjusted === 11) return Math.floor(baseValue * 2);
    return values[values.findIndex((value) => value === baseValue) + 1];
  }

  function getType() {
    const typeRoll = Math.floor(Math.random() * 100) + 1;
    if (typeRoll <= 5) return "Alexandrite";
    if (typeRoll <= 12) return "Amethyst";
    if (typeRoll <= 20) return "Aventurine";
    if (typeRoll <= 30) return "Chlorastrolite";
    if (typeRoll <= 40) return "Diamond";
    if (typeRoll <= 43) return "Emerald";
    if (typeRoll <= 48) return "Fire Opal";
    if (typeRoll <= 57) return "Fluorospar";
    if (typeRoll <= 63) return "Garnet";
    if (typeRoll <= 68) return "Heliotrope";
    if (typeRoll <= 78) return "Malachite";
    if (typeRoll <= 88) return "Rhodonite";
    if (typeRoll <= 91) return "Ruby";
    if (typeRoll <= 95) return "Sapphire";
    return "Topaz";
  }

  for (let i = 0; i < loot.gems; i++) {
    const qualityRoll = Math.floor(Math.random() * 100) + 1;
    const { quality, baseValue, amount } = getBaseDescription(qualityRoll);
    const value = getValue(baseValue);
    const type = getType();
    if (value !== 5000) gems.push({ type, quality, value, amount });
    else loot.jewels++;
  }
  return gems;
}
