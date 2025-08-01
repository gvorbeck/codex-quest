import {
  Chances,
  Loot,
  MagicArmorTreasure,
  MagicItemColumns,
  MiscItemTreasure,
} from "@/data/definitions";
import { rollDice } from "./diceSupport";

const emptyLoot: Loot = {
  copper: 0,
  silver: 0,
  electrum: 0,
  gold: 0,
  platinum: 0,
  gems: 0,
  jewels: 0,
  magicItems: [],
};

export function getLoot(level: number | string, dragonAge?: number): Loot {
  const chances: Chances = {
    copper: [0, 0],
    silver: [0, 0],
    electrum: [0, 0],
    gold: [0, 0],
    platinum: [0, 0],
    gems: [0, 0],
    jewels: [0, 0],
    magicItems: [0, "any", 0, 0, 0],
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loot = { ...emptyLoot, magicItems: [] as any[] };

  const dragonLootPercentage =
    dragonAge && dragonAge > 1 ? dragonAge / 10 + 0.15 : 0;

  switch (level) {
    // coin, gems, jewels [percentage chance, rollDice()]
    // magicItems [percentage chance, column, number produced, # scrolls, # potions]
    case "A":
      chances.copper = [0.5, rollDice("5d6*100")];
      chances.silver = [0.6, rollDice("5d6*100")];
      chances.electrum = [0.4, rollDice("5d4*100")];
      chances.gold = [0.7, rollDice("10d6*100")];
      chances.platinum = [0.5, rollDice("1d10*100")];
      chances.gems = [0.5, rollDice("6d6")];
      chances.jewels = [0.5, rollDice("6d6")];
      chances.magicItems = [0.3, "any", 3, 0, 0];
      break;
    case "B":
      chances.copper = [0.75, rollDice("5d10*100")];
      chances.silver = [0.5, rollDice("5d6*100")];
      chances.electrum = [0.5, rollDice("5d4*100")];
      chances.gold = [0.5, rollDice("3d6*100")];
      chances.gems = [0.25, rollDice("1d6")];
      chances.jewels = [0.25, rollDice("1d6")];
      chances.magicItems = [0.1, "weaponArmor", 1, 0, 0];
      break;
    case "C":
      chances.copper = [0.6, rollDice("6d6*100")];
      chances.silver = [0.6, rollDice("5d4*100")];
      chances.electrum = [0.3, rollDice("2d6*100")];
      chances.gems = [0.25, rollDice("1d4")];
      chances.jewels = [0.25, rollDice("1d4")];
      chances.magicItems = [0.15, "any", rollDice("1d2"), 0, 0];
      break;
    case "D":
      chances.copper = [0.3, rollDice("4d6*100")];
      chances.silver = [0.45, rollDice("6d6*100")];
      chances.gold = [0.9, rollDice("5d8*100")];
      chances.gems = [0.3, rollDice("1d8")];
      chances.jewels = [0.3, rollDice("1d8")];
      chances.magicItems = [0.2, "any", rollDice("1d2"), 0, 1];
      break;
    case "E":
      chances.copper = [0.3, rollDice("2d8*100")];
      chances.silver = [0.6, rollDice("6d10*100")];
      chances.electrum = [0.5, rollDice("3d8*100")];
      chances.gold = [0.5, rollDice("4d10*100")];
      chances.gems = [0.1, rollDice("1d10")];
      chances.jewels = [0.1, rollDice("1d10")];
      chances.magicItems = [0.3, "any", rollDice("1d4"), 1, 0];
      break;
    case "F":
      chances.silver = [0.4, rollDice("3d8*100")];
      chances.electrum = [0.5, rollDice("4d8*100")];
      chances.gold = [0.85, rollDice("6d10*100")];
      chances.platinum = [0.7, rollDice("2d8*100")];
      chances.gems = [0.2, rollDice("2d12")];
      chances.jewels = [0.1, rollDice("1d12")];
      chances.magicItems = [0.35, "noWeapon", rollDice("1d4"), 1, 1];
      break;
    case "G":
      chances.gold = [0.9, rollDice("4d6*1000")];
      chances.platinum = [0.75, rollDice("5d8*100")];
      chances.gems = [0.25, rollDice("3d6")];
      chances.jewels = [0.25, rollDice("1d10")];
      chances.magicItems = [0.5, "any", rollDice("1d4"), 1, 0];
      break;
    case "H":
      chances.copper = [dragonLootPercentage, rollDice("8d10*100")];
      chances.silver = [dragonLootPercentage, rollDice("6d10*1000")];
      chances.electrum = [dragonLootPercentage, rollDice("3d10*1000")];
      chances.gold = [dragonLootPercentage, rollDice("5d8*1000")];
      chances.platinum = [dragonLootPercentage, rollDice("9d8*100")];
      chances.gems = [dragonLootPercentage, rollDice("1d100")];
      chances.jewels = [dragonLootPercentage, rollDice("10d4")];
      chances.magicItems = [dragonLootPercentage, "any", rollDice("1d4"), 1, 1];
      break;
    case "I":
      chances.platinum = [0.8, rollDice("3d10*100")];
      chances.gems = [0.5, rollDice("2d6")];
      chances.jewels = [0.5, rollDice("2d6")];
      chances.magicItems = [0.15, "any", rollDice("1d4"), 0, 0];
      break;
    case "J":
      chances.copper = [0.45, rollDice("3d8*100")];
      chances.silver = [0.45, rollDice("1d8*100")];
      break;
    case "K":
      chances.silver = [0.9, rollDice("2d10")];
      chances.electrum = [0.35, rollDice("1d8")];
      break;
    case "L":
      chances.gems = [0.5, rollDice("1d4")];
      break;
    case "M":
      chances.gold = [0.9, rollDice("4d10*100")];
      chances.platinum = [0.9, rollDice("2d8*1000")];
      chances.gems = [0.55, rollDice("5d4")];
      chances.jewels = [0.45, rollDice("2d6")];
      break;
    case "N":
      chances.magicItems = [0.4, "any", 0, 0, rollDice("2d4")];
      break;
    case "O":
      chances.magicItems = [0.5, "any", 0, rollDice("1d4"), 0];
      break;
    case "P":
      chances.copper = [1, rollDice("3d8")];
      break;
    case "Q":
      chances.silver = [1, rollDice("3d6")];
      break;
    case "R":
      chances.electrum = [1, rollDice("2d6")];
      break;
    case "S":
      chances.gold = [1, rollDice("2d4")];
      break;
    case "T":
      chances.platinum = [1, rollDice("1d6")];
      break;
    case "U":
      chances.copper = [0.5, rollDice("1d20")];
      chances.silver = [0.5, rollDice("1d20")];
      chances.gold = [0.25, rollDice("1d20")];
      chances.gems = [0.05, rollDice("1d4")];
      chances.jewels = [0.05, rollDice("1d4")];
      chances.magicItems = [0.02, "any", 1, 0, 0];
      break;
    case "V":
      chances.silver = [0.25, rollDice("1d20")];
      chances.electrum = [0.25, rollDice("1d20")];
      chances.gold = [0.5, rollDice("1d20")];
      chances.platinum = [0.25, rollDice("1d20")];
      chances.gems = [0.1, rollDice("1d4")];
      chances.jewels = [0.1, rollDice("1d4")];
      chances.magicItems = [0.05, "any", 1, 0, 0];
      break;
    case 1:
      chances.copper = [0.75, rollDice("1d8*100")];
      chances.silver = [0.5, rollDice("1d6*100")];
      chances.electrum = [0.25, rollDice("1d4*100")];
      chances.gold = [0.07, rollDice("1d4*100")];
      chances.platinum = [0.01, rollDice("1d4*100")];
      chances.gems = [0.07, rollDice("1d4")];
      chances.jewels = [0.03, rollDice("1d4")];
      chances.magicItems = [0.02, "any", 1, 0, 0];
      break;
    case 2:
      chances.copper = [0.5, rollDice("1d10*100")];
      chances.silver = [0.5, rollDice("1d8*100")];
      chances.electrum = [0.25, rollDice("1d6*100")];
      chances.gold = [0.2, rollDice("1d6*100")];
      chances.platinum = [0.02, rollDice("1d4*100")];
      chances.gems = [0.1, rollDice("1d6")];
      chances.jewels = [0.07, rollDice("1d4")];
      chances.magicItems = [0.05, "any", 1, 0, 0];
      break;
    case 3:
      chances.copper = [0.3, rollDice("2d6*100")];
      chances.silver = [0.5, rollDice("1d10*100")];
      chances.electrum = [0.25, rollDice("1d8*100")];
      chances.gold = [0.5, rollDice("1d6*100")];
      chances.platinum = [0.04, rollDice("1d4*100")];
      chances.gems = [0.15, rollDice("1d6")];
      chances.jewels = [0.07, rollDice("1d6")];
      chances.magicItems = [0.08, "any", 1, 0, 0];
      break;
    case 4:
    case 5:
      chances.copper = [0.2, rollDice("3d6*100")];
      chances.silver = [0.5, rollDice("2d6*100")];
      chances.electrum = [0.25, rollDice("1d10*100")];
      chances.gold = [0.5, rollDice("2d6*100")];
      chances.platinum = [0.08, rollDice("1d4*100")];
      chances.gems = [0.2, rollDice("1d8")];
      chances.jewels = [0.1, rollDice("1d6")];
      chances.magicItems = [0.12, "any", 1, 0, 0];
      break;
    case 6:
    case 7:
      chances.copper = [0.15, rollDice("4d6*100")];
      chances.silver = [0.5, rollDice("3d6*100")];
      chances.electrum = [0.25, rollDice("1d12*100")];
      chances.gold = [0.7, rollDice("2d8*100")];
      chances.platinum = [0.15, rollDice("1d4*100")];
      chances.gems = [0.3, rollDice("1d8")];
      chances.jewels = [0.15, rollDice("1d6")];
      chances.magicItems = [0.16, "any", 1, 0, 0];
      break;
    case 8:
    default:
      chances.copper = [0.1, rollDice("5d6*100")];
      chances.silver = [0.5, rollDice("5d6*100")];
      chances.electrum = [0.25, rollDice("2d8*100")];
      chances.gold = [0.75, rollDice("4d6*100")];
      chances.platinum = [0.3, rollDice("1d4*100")];
      chances.gems = [0.4, rollDice("1d8")];
      chances.jewels = [0.3, rollDice("1d8")];
      chances.magicItems = [0.2, "any", 1, 0, 0];
      break;
  }

  (Object.keys(loot) as (keyof Loot)[]).forEach((key) => {
    const roll = Math.random();
    if (key !== "magicItems") {
      if (roll <= chances[key][0]) {
        loot[key] = chances[key][1];
      }
    } else {
      // if there's a chance AND the roll is successful
      if (chances[key][0] > 0 && roll <= chances[key][0]) {
        // if there are any magic items
        if (chances[key][2] > 0) {
          for (let i = 1; i <= chances[key][2]; i++) {
            loot[key].push(getMagicItems(chances[key][1]));
          }
        }
        // if there are any scrolls
        if (chances[key][3] > 0) {
          for (let i = 1; i <= chances[key][3]; i++) {
            loot[key].push(getScroll());
          }
        }
        // if there are any potions
        if (chances[key][4] > 0) {
          for (let i = 1; i <= chances[key][4]; i++) {
            loot[key].push(`Potion of ${getPotion()}`);
          }
        }
      }
    }
  });

  return loot;
}

export function getJewels(loot: Loot) {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getMagicItems(column: MagicItemColumns): any {
  const i = Math.floor(Math.random() * 100) + 1;

  function getAnyColumn(roll: number) {
    const results = [
      getMagicalWeapon(),
      getMagicalArmor(),
      `Potion of ${getPotion()}`,
      getScroll(),
      getWand(),
      getMiscItem(),
      getRareItem(),
    ];
    const thresholds = [25, 35, 55, 85, 90, 97, 100];
    return results[thresholds.findIndex((t) => roll <= t)];
  }

  function getWeaponArmorColumn(roll: number) {
    if (roll <= 70) return getMagicalWeapon();
    return getMagicalArmor();
  }

  function getAnyExcWeaponColumn(roll: number) {
    const results = [
      getMagicalArmor(),
      `Potion of ${getPotion()}`,
      getScroll(),
      getWand(),
      getMiscItem(),
      getRareItem(),
    ];
    const thresholds = [12, 40, 79, 86, 96, 100];
    return results[thresholds.findIndex((t) => roll <= t)];
  }

  if (column === "any") return getAnyColumn(i);
  if (column === "weaponArmor") return getWeaponArmorColumn(i);
  if (column === "noWeapon") return getAnyExcWeaponColumn(i);
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
  return {
    ...getWeaponBonus(weapons[thresholds.findIndex((t) => roll <= t)]),
    id: "weapon",
  };
}

function getMagicalArmor(
  reverse = false,
  a?: MagicArmorTreasure,
): MagicArmorTreasure {
  const armor: MagicArmorTreasure = a ?? {
    name: "",
    special: "",
    bonus: "",
    id: "armor",
  };

  if (!a) {
    const armorTypes = ["Leather Armor", "Chain Mail", "Plate Mail", "Shield"];
    const armorThresholds = [9, 28, 43, 100];
    const armorRoll = Math.floor(Math.random() * 100) + 1;
    armor.name = armorTypes[armorThresholds.findIndex((t) => armorRoll <= t)];
  }

  const bonusTypes = reverse
    ? ["-1", "-2", "-3", "Cursed", "Cursed"]
    : ["+1", "+2", "+3", "Cursed", "Cursed"];
  const bonusThresholds = [50, 80, 90, 95, 100];
  const bonusRoll = Math.floor(Math.random() * 100) + 1;
  const bonusIndex = bonusThresholds.findIndex((t) => bonusRoll <= t);
  const bonus = bonusTypes[bonusIndex];

  let armorSpecial = "";

  if (bonusIndex === 3) {
    // Roll again with reverse bonus
    return getMagicalArmor(true, { ...armor, special: "Cursed", bonus: "" });
  } else if (bonusIndex === 4) {
    armorSpecial = "Cursed: AC 11, but appears to be +1 when tested.";
  }

  return { ...armor, bonus, special: armorSpecial };
}

function getPotion() {
  const potions = [
    "Clairaudience",
    "Clairvoyance",
    "Cold Resistance",
    "Control Animal",
    "Control Dragon",
    "Control Giant",
    "Control Human",
    "Control Plant",
    "Control Undead",
    "Delusion",
    "Diminution",
    "Fire Resistance",
    "Flying",
    "Gaseous Form",
    "Giant Strength",
    "Growth",
    "Healing",
    "Heroism",
    "Invisibility",
    "Invulnerability",
    "Levitation",
    "Longevity",
    "Mind Reading",
    "Poison",
    "Polymorph Self",
    "Speed",
    "Treasure Finding",
  ];
  const potionThresholds = [
    3, 6, 8, 11, 13, 16, 19, 22, 25, 32, 35, 39, 43, 47, 51, 55, 59, 63, 68, 72,
    76, 80, 84, 86, 89, 97, 100,
  ];
  const potionRoll = Math.floor(Math.random() * 100) + 1;
  return potions[potionThresholds.findIndex((t) => potionRoll <= t)];
}

function getScroll() {
  const scrolls = [
    "Cleric Spell Scroll (1 Spell)",
    "Cleric Spell Scroll (2 Spells)",
    "Cleric Spell Scroll (3 Spells)",
    "Cleric Spell Scroll (4 Spells)",
    "Magic-User Spell Scroll (1 Spell)",
    "Magic-User Spell Scroll (2 Spells)",
    "Magic-User Spell Scroll (3 Spells)",
    "Magic-User Spell Scroll (4 Spells)",
    "Magic-User Spell Scroll (5 Spells)",
    "Magic-User Spell Scroll (6 Spells)",
    "Magic-User Spell Scroll (7 Spells)",
    "Cursed Scroll",
    "Protection from Elementals",
    "Protection from Lycanthropes",
    "Protection from Magic",
    "Protection from Undead",
    "Map to Treasure Type A",
    "Map to Treasure Type E",
    "Map to Treasure Type G",
    `Map to ${rollDice("1d4")} Magic Items`,
  ];
  const scrollThresholds = [
    3, 6, 8, 9, 15, 20, 25, 29, 32, 34, 35, 40, 46, 56, 61, 75, 85, 89, 92, 100,
  ];
  const scrollRoll = Math.floor(Math.random() * 100) + 1;
  return `Scroll: ${scrolls[scrollThresholds.findIndex((t) => scrollRoll <= t)]}`;
}

function getWand() {
  const wands = [
    "Rod of Cancellation",
    "Snake Staff",
    "Staff of Commanding",
    "Staff of Healing",
    "Staff of Power",
    "Staff of Striking",
    "Staff of Wizardry",
    "Wand of Cold",
    "Wand of Enemy Detection",
    "Wand of Fear",
    "Wand of Fireballs",
    "Wand of Illusion",
    "Wand of Lightning Bolts",
    "Wand of Magic Detection",
    "Wand of Paralysis",
    "Wand of Polymorph",
    "Wand of Secret Door Detection",
    "Wand of Trap Detection",
  ];
  const wandThresholds = [
    8, 13, 17, 28, 30, 34, 35, 40, 45, 50, 55, 60, 65, 73, 79, 84, 92, 100,
  ];
  const wandRoll = Math.floor(Math.random() * 100) + 1;
  return `Wands, Staves and Rods: ${wands[wandThresholds.findIndex((t) => wandRoll <= t)]}`;
}

function getMiscItem(): MiscItemTreasure {
  const roll = Math.floor(Math.random() * 100) + 1;
  let miscItem: MiscItemTreasure;
  if (roll <= 57) {
    const misc1 = [
      { effect: "Blasting", column: "G" },
      { effect: "Blending", column: "F" },
      { effect: "Cold Resistance", column: "F" },
      { effect: "Comprehension", column: "E" },
      { effect: "Control Animal", column: "C" },
      { effect: "Control Human", column: "C" },
      { effect: "Control Plant", column: "C" },
      { effect: "Courage", column: "G" },
      { effect: "Deception", column: "F" },
      { effect: "Delusion", column: "A" },
      { effect: "Djinni Summoning", column: "C" },
      { effect: "Doom", column: "G" },
      { effect: "Fire Resistance", column: "F" },
      { effect: "Invisibility", column: "F" },
      { effect: "Levitation", column: "B" },
      { effect: "Mind Reading", column: "C" },
      { effect: "Panic", column: "G" },
      { effect: "Penetrating Vision", column: "D" },
    ];
    const misc1Thresholds = [
      1, 5, 13, 17, 22, 29, 35, 37, 40, 52, 55, 56, 67, 80, 85, 95, 97, 100,
    ];
    const roll1 = Math.floor(Math.random() * 100) + 1;
    // return misc1[misc1Thresholds.findIndex((t) => roll1 <= t)];
    miscItem = {
      form: "",
      id: "misc",
      ...misc1[misc1Thresholds.findIndex((t) => roll1 <= t)],
    };
  } else {
    const misc2 = [
      { effect: "Protection +1", column: "F" },
      { effect: "Protection +2", column: "F" },
      { effect: "Protection +3", column: "F" },
      { effect: "Protection from Energy Drain", column: "F" },
      { effect: "Protection from Scrying", column: "F" },
      { effect: "Regeneration", column: "C" },
      { effect: "Scrying", column: "H" },
      { effect: "Scrying, Superior", column: "H" },
      { effect: "Speed", column: "B" },
      { effect: "Spell Storing", column: "C" },
      { effect: "Spell Turning", column: "F" },
      { effect: "Stealth", column: "B" },
      { effect: "Telekinesis", column: "C" },
      { effect: "Telepathy", column: "C" },
      { effect: "Teleportation", column: "C" },
      { effect: "True Seeing", column: "D" },
      { effect: "Water Walking", column: "B" },
      { effect: "Weakness", column: "C" },
      { effect: "Wishes", column: "C" },
    ];
    const misc2Thresholds = [
      7, 10, 11, 14, 20, 23, 29, 32, 39, 42, 50, 69, 72, 74, 76, 78, 88, 99,
      100,
    ];
    const roll2 = Math.floor(Math.random() * 100) + 1;
    miscItem = {
      form: "",
      id: "misc",
      ...misc2[misc2Thresholds.findIndex((t) => roll2 <= t)],
    };
  }
  const formRoll = Math.floor(Math.random() * 100) + 1;
  switch (miscItem.column) {
    case "A": {
      const items = [
        "Bell (or Chime)",
        "Belt (or Girdle)",
        "Boots",
        "Bowl",
        "Cloak",
        "Crystal Ball (or Orb)",
        "Drums",
        "Helm",
        "Horn",
        "Lens",
        "Mirror",
        "Pendant",
        "Ring",
      ];
      const thresholds = [2, 5, 13, 15, 28, 31, 33, 38, 43, 46, 49, 67, 100];
      miscItem.form = items[thresholds.findIndex((t) => formRoll <= t)];
      break;
    }
    case "B": {
      const items = ["Boots", "Pendant", "Ring"];
      const thresholds = [25, 50, 100];
      miscItem.form = items[thresholds.findIndex((t) => formRoll <= t)];
      break;
    }
    case "C": {
      const items = ["Pendant", "Ring"];
      const thresholds = [40, 100];
      miscItem.form = items[thresholds.findIndex((t) => formRoll <= t)];
      break;
    }
    case "D": {
      const items = ["Lens", "Mirror", "Pendant", "Ring"];
      const thresholds = [17, 21, 50, 100];
      miscItem.form = items[thresholds.findIndex((t) => formRoll <= t)];
      break;
    }
    case "E": {
      const items = ["Helm", "Pendant", "Ring"];
      const thresholds = [40, 80, 100];
      miscItem.form = items[thresholds.findIndex((t) => formRoll <= t)];
      break;
    }
    case "F": {
      const items = ["Belt (or Girdle)", "Cloak", "Pendant", "Ring"];
      const thresholds = [7, 38, 50, 100];
      miscItem.form = items[thresholds.findIndex((t) => formRoll <= t)];
      break;
    }
    case "G": {
      const items = ["Bell (or Chime)", "Drums", "Horn"];
      const thresholds = [17, 50, 100];
      miscItem.form = items[thresholds.findIndex((t) => formRoll <= t)];
      break;
    }
    case "H": {
      const items = ["Bowl", "Crystal Ball (or Orb)", "Mirror"];
      const thresholds = [17, 67, 100];
      miscItem.form = items[thresholds.findIndex((t) => formRoll <= t)];
      break;
    }
    default:
      break;
  }
  return miscItem;
}

function getRareItem() {
  function getDeviceOfSummoningElementals() {
    const roll = Math.floor(Math.random() * 8) + 1;
    const items = [
      "Bowl of Summoning Water Elementals",
      "Brazier of Summoning Fire Elementals",
      "Censer of Summoning Air Elementals",
      "Crucible of Summoning Metal Elementals",
      "Mallet of Summoning Wood Elementals",
      "Marble Plate of Summoning Cold Elementals",
      "Rod of Summoning Lightning Elementals",
      "Stone of Summoning Earth Elementals",
    ];
    return items[roll - 1];
  }

  const roll = Math.floor(Math.random() * 100) + 1;
  const items = [
    "Bag of Devouring",
    "Bag of Holding",
    "Boots of Traveling and Leaping",
    "Broom of Flying",
    getDeviceOfSummoningElementals(),
    "Efreeti Bottle",
    "Flying Carpet",
    "Gauntlets of Ogre Power",
    "Girdle of Giant Strength",
    "Mirror of Imprisonment",
    "Rope of Climbing",
  ];
  const thresholds = [5, 20, 32, 47, 57, 59, 64, 81, 86, 88, 100];
  return `Rare Item: ${items[thresholds.findIndex((t) => roll <= t)]}`;
}

export function getGems(loot: Loot) {
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
