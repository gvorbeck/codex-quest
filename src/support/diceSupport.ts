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
    const jewelTypes = [
      "Anklet",
      "Belt",
      "Bowl",
      "Bracelet",
      "Brooch",
      "Buckle",
      "Chain",
      "Choker",
      "Circlet",
      "Clasp",
      "Comb",
      "Crown",
      "Cup",
      "Earring",
      "Flagon",
      "Goblet",
      "Knife",
      "Letter Opener",
      "Locket",
      "Medal",
      "Necklace",
      "Plate",
      "Pin",
      "Scepter",
      "Statuette",
      "Tiara",
    ];
    const thresholds = [
      6, 12, 14, 21, 27, 32, 37, 40, 42, 47, 51, 52, 55, 62, 65, 68, 73, 77, 80,
      82, 89, 90, 95, 96, 99, 100,
    ];
    return jewelTypes[thresholds.findIndex((t) => n <= t)];
  }

  for (let i = 0; i < loot.jewels; i++) {
    const value = rollDice("2d8") * 100;
    const type = getJewel();
    jewels.push({ type, value });
  }

  return jewels;
}

export function generateMagicItems() {
  const i = Math.floor(Math.random() * 100) + 1;

  function getAnyColumn(roll: number) {
    if (roll <= 25) return getMagicalWeapon();
    if (roll <= 35) return "Armor";
    if (roll <= 55) return "Potion";
    if (roll <= 85) return "Scroll";
    if (roll <= 90) return "Wand, Staff, or Rod";
    if (roll <= 97) return "Miscellaneous Items";
    return "Rare Items";
  }

  function getWeaponArmorColumn(roll: number) {
    if (roll <= 70) return getMagicalWeapon();
    return "Armor";
  }

  function getAnyExcWeaponColumn(roll: number) {
    if (roll <= 12) return "Armor";
    if (roll <= 40) return "Potion";
    if (roll <= 79) return "Scroll";
    if (roll <= 86) return "Wand, Staff, or Rod";
    if (roll <= 96) return "Miscellaneous Items";
    return "Rare Items";
  }

  return [getAnyColumn(i), getWeaponArmorColumn(i), getAnyExcWeaponColumn(i)];
}

function getSpecialEnemy() {
  const roll = Math.floor(Math.random() * 6) + 1;
  const enemies = [
    "Dragons",
    "Enchanted",
    "Lycanthropes",
    "Regenerators",
    "Spell Users",
    "Undead",
  ];
  return enemies[roll - 1];
}

function getSpecialAbility() {
  const roll = Math.floor(Math.random() * 20) + 1;
  const abilities = [
    "Casts Light on Command",
    "Charm Person",
    "Drains Energy",
    "Flames on Command",
    "Locate Objects",
    "Wishes",
  ];
  const thresholds = [9, 11, 12, 16, 19];
  return abilities[thresholds.findIndex((t) => roll <= t)];
}

function getWeaponBonus(weapon: {
  name: string;
  type: string;
  bonus: string;
  specAbility: string;
}) {
  const w = { ...weapon };
  const roll = Math.floor(Math.random() * 100) + 1;
  const meleeBonuses = [
    { bonus: "+1" },
    { bonus: "+2" },
    { bonus: "+3" },
    { bonus: "+4" },
    { bonus: "+5" },
    { bonus: "+1, +2 vs. " + getSpecialEnemy() },
    { bonus: "+1, +3 vs. " + getSpecialEnemy() },
    { bonus: "reroll", specAbility: getSpecialAbility() }, // reroll
    { bonus: "-1", specAbility: "Cursed" },
    { bonus: "-2", specAbility: "Cursed" },
  ];
  const meleeThresholds = [40, 50, 55, 57, 58, 75, 85, 95, 98, 100];
  const missileBonuses = [
    { bonus: "+1" },
    { bonus: "+2" },
    { bonus: "+3" },
    { bonus: "+1, +2 vs. " + getSpecialEnemy() },
    { bonus: "+1, +3 vs. " + getSpecialEnemy() },
    { bonus: "-1", specAbility: "Cursed" },
    { bonus: "-2", specAbility: "Cursed" },
  ];
  const missileThresholds = [46, 58, 64, 82, 94, 98, 100];
  const bonuses = w.type === "melee" ? meleeBonuses : missileBonuses;
  const thresholds = w.type === "melee" ? meleeThresholds : missileThresholds;
  const index = thresholds.findIndex((t) => roll <= t);
  if (bonuses[index].bonus) w.bonus = bonuses[index].bonus;
  if (bonuses[index].specAbility)
    w.specAbility = bonuses[index].specAbility || "";
  if (w.bonus === "reroll") return getWeaponBonus(w);

  return w;
}

function getMagicalWeapon() {
  const roll = Math.floor(Math.random() * 100) + 1;
  const weapons = [
    { name: "Great Axe", type: "melee", bonus: "", specAbility: "" },
    { name: "Battle Axe", type: "melee", bonus: "", specAbility: "" },
    { name: "Hand Axe", type: "melee", bonus: "", specAbility: "" },
    { name: "Shortbow", type: "missile", bonus: "", specAbility: "" },
    { name: "Shortbow Arrow", type: "missile", bonus: "", specAbility: "" },
    { name: "Longbow", type: "missile", bonus: "", specAbility: "" },
    { name: "Longbow Arrow", type: "missile", bonus: "", specAbility: "" },
    { name: "Light Quarrel", type: "missile", bonus: "", specAbility: "" },
    { name: "Heavy Quarrel", type: "missile", bonus: "", specAbility: "" },
    { name: "Dagger", type: "melee", bonus: "", specAbility: "" },
    { name: "Shortsword", type: "melee", bonus: "", specAbility: "" },
    { name: "Longsword", type: "melee", bonus: "", specAbility: "" },
    { name: "Scimitar", type: "melee", bonus: "", specAbility: "" },
    { name: "Two-Handed Sword", type: "melee", bonus: "", specAbility: "" },
    { name: "Warhammer", type: "melee", bonus: "", specAbility: "" },
    { name: "Mace", type: "melee", bonus: "", specAbility: "" },
    { name: "Maul", type: "melee", bonus: "", specAbility: "" },
    { name: "Pole Arm", type: "melee", bonus: "", specAbility: "" },
    { name: "Sling Bullet", type: "missile", bonus: "", specAbility: "" },
    { name: "Spear", type: "melee", bonus: "", specAbility: "" },
  ];
  const thresholds = [
    2, 9, 11, 19, 27, 31, 35, 43, 47, 59, 65, 79, 81, 83, 86, 94, 95, 96, 97,
    100,
  ];
  return getWeaponBonus(weapons[thresholds.findIndex((t) => roll <= t)]);
}

export function generateGems(loot: Loot) {
  const gems = [];
  const values = [5, 10, 50, 100, 500, 1000, 5000];

  function getBaseDescription(quality: number) {
    const qualities = [
      {
        quality: "Ornamental",
        baseValue: values[1],
        amount: Math.floor(Math.random() * 10) + 1,
      },
      {
        quality: "Semiprecious",
        baseValue: values[2],
        amount: Math.floor(Math.random() * 8) + 1,
      },
      {
        quality: "Fancy",
        baseValue: values[3],
        amount: Math.floor(Math.random() * 6) + 1,
      },
      {
        quality: "Precious",
        baseValue: values[4],
        amount: Math.floor(Math.random() * 4) + 1,
      },
      {
        quality: "Gem",
        baseValue: values[5],
        amount: Math.floor(Math.random() * 2) + 1,
      },
    ];
    const thresholds = [20, 45, 75, 95, 100];
    return qualities[thresholds.findIndex((t) => quality <= t)];
  }

  function getValue(baseValue: number) {
    const adjusted = rollDice("2d6");
    const valueTypes = [
      values[values.findIndex((value) => value === baseValue) - 1],
      Math.floor(baseValue / 2),
      Math.floor(baseValue * 0.75),
      baseValue,
      Math.floor(baseValue * 1.5),
      Math.floor(baseValue * 2),
      values[values.findIndex((value) => value === baseValue) + 1],
    ];
    const thresholds = [2, 3, 4, 9, 10, 11, 12];
    return valueTypes[thresholds.findIndex((t) => adjusted <= t)];
  }

  function getType() {
    const typeRoll = Math.floor(Math.random() * 100) + 1;
    const gemTypes = [
      "Alexandrite",
      "Amethyst",
      "Aventurine",
      "Chlorastrolite",
      "Diamond",
      "Emerald",
      "Fire Opal",
      "Fluorospar",
      "Garnet",
      "Heliotrope",
      "Malachite",
      "Rhodonite",
      "Ruby",
      "Sapphire",
      "Topaz",
    ];
    const thresholds = [
      5, 12, 20, 30, 40, 43, 48, 57, 63, 68, 78, 88, 91, 95, 100,
    ];
    return gemTypes[thresholds.findIndex((t) => typeRoll <= t)];
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
