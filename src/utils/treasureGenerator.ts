import { roller } from "./dice";

export interface TreasureResult {
  type: string;
  level?: string;
  copper: number;
  silver: number;
  electrum: number;
  gold: number;
  platinum: number;
  gemsAndJewelry: string[];
  magicItems: string[];
  description: string;
  breakdown: string[];
}

export type TreasureType = "lair" | "individual" | "unguarded";

// Lair treasure types
export type LairTreasureType = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O";

// Individual treasure types
export type IndividualTreasureType = "P" | "Q" | "R" | "S" | "T" | "U" | "V";

// Unguarded treasure levels
export type UnguardedTreasureLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

// Gem types and values
interface GemType {
  name: string;
  baseValue: number;
}

const GEM_TYPES: Record<string, GemType> = {
  "01-05": { name: "Alexandrite", baseValue: 10 },
  "06-12": { name: "Amethyst", baseValue: 50 },
  "13-20": { name: "Aventurine", baseValue: 100 },
  "21-30": { name: "Chlorastrolite", baseValue: 500 },
  "31-40": { name: "Diamond", baseValue: 1000 },
  "41-43": { name: "Emerald", baseValue: 5000 },
  "44-48": { name: "Fire Opal", baseValue: 100 },
  "49-57": { name: "Fluorspar", baseValue: 50 },
  "58-63": { name: "Garnet", baseValue: 10 },
  "64-68": { name: "Heliotrope", baseValue: 100 },
  "69-78": { name: "Malachite", baseValue: 10 },
  "79-88": { name: "Rhodonite", baseValue: 50 },
  "89-91": { name: "Ruby", baseValue: 500 },
  "92-95": { name: "Sapphire", baseValue: 1000 },
  "96-00": { name: "Topaz", baseValue: 500 }
};

// Jewelry types
const JEWELRY_TYPES = [
  "Anklet", "Earring", "Belt", "Flagon", "Bowl", "Goblet", "Bracelet", "Knife",
  "Brooch", "Letter Opener", "Buckle", "Locket", "Chain", "Medal", "Choker", 
  "Necklace", "Circlet", "Plate", "Clasp", "Pin", "Comb", "Scepter", "Crown", 
  "Statuette", "Cup", "Tiara"
];

// Magic item tables
const MAGIC_WEAPONS = [
  "Great Axe", "Battle Axe", "Hand Axe", "Shortbow", "Shortbow Arrow",
  "Longbow", "Longbow Arrow", "Light Quarrel", "Heavy Quarrel", "Dagger",
  "Shortsword", "Longsword", "Scimitar", "Two-Handed Sword", "Warhammer",
  "Mace", "Maul", "Pole Arm", "Sling Bullet", "Spear"
];

const MAGIC_ARMOR = [
  "Leather Armor", "Chain Mail", "Plate Mail", "Shield"
];

// const POTIONS = [
//   "Clairaudience", "Clairvoyance", "Cold Resistance", "Control Animal",
//   "Control Dragon", "Control Giant", "Control Human", "Control Plant",
//   "Control Undead", "Delusion", "Diminution", "Fire Resistance", "Flying",
//   "Gaseous Form", "Giant Strength", "Growth", "Healing", "Heroism",
//   "Invisibility", "Invulnerability", "Levitation", "Longevity", "Mind Reading",
//   "Poison", "Polymorph Self", "Speed", "Treasure Finding"
// ];

const SCROLLS = [
  "Cleric Spell Scroll (1 Spell)", "Cleric Spell Scroll (2 Spells)",
  "Cleric Spell Scroll (3 Spells)", "Cleric Spell Scroll (4 Spells)",
  "Magic-User Spell Scroll (1 Spell)", "Magic-User Spell Scroll (2 Spells)",
  "Magic-User Spell Scroll (3 Spells)", "Magic-User Spell Scroll (4 Spells)",
  "Magic-User Spell Scroll (5 Spells)", "Magic-User Spell Scroll (6 Spells)",
  "Magic-User Spell Scroll (7 Spells)", "Cursed Scroll",
  "Protection from Elementals", "Protection from Lycanthropes",
  "Protection from Magic", "Protection from Undead",
  "Map to Treasure Type A", "Map to Treasure Type E",
  "Map to Treasure Type G", "Map to 1d4 Magic Items"
];

const WANDS_STAVES_RODS = [
  "Rod of Cancellation", "Snake Staff", "Staff of Commanding",
  "Staff of Healing", "Staff of Power", "Staff of Striking",
  "Staff of Wizardry", "Wand of Cold", "Wand of Enemy Detection",
  "Wand of Fear", "Wand of Fireballs", "Wand of Illusion",
  "Wand of Lightning Bolts", "Wand of Magic Detection",
  "Wand of Paralysis", "Wand of Polymorph", "Wand of Secret Door Detection",
  "Wand of Trap Detection"
];

const MISCELLANEOUS_ITEMS = [
  "Blasting", "Blending", "Cold Resistance", "Comprehension", "Control Animal",
  "Control Human", "Control Plant", "Courage", "Deception", "Delusion",
  "Djinni Summoning", "Doom", "Fire Resistance", "Invisibility", "Levitation",
  "Mind Reading", "Panic", "Penetrating Vision", "Protection +1", "Protection +2",
  "Protection +3", "Protection from Energy Drain", "Protection from Scrying",
  "Regeneration", "Scrying", "Scrying, Superior", "Speed", "Spell Storing",
  "Spell Turning", "Stealth", "Telekinesis", "Telepathy", "Teleportation",
  "True Seeing", "Water Walking", "Weakness", "Wishes"
];

const RARE_ITEMS = [
  "Bag of Devouring", "Bag of Holding", "Boots of Traveling and Leaping",
  "Broom of Flying", "Device of Summoning Elementals", "Efreeti Bottle",
  "Flying Carpet", "Gauntlets of Ogre Power", "Girdle of Giant Strength",
  "Mirror of Imprisonment", "Rope of Climbing"
];

// Treasure generation functions
function rollPercentage(): number {
  return roller("1d100").total;
}

function rollDice(formula: string): number {
  return roller(formula).total;
}

function generateGem(): string {
  const roll = rollPercentage();
  let gemType = "Garnet"; // default
  let baseValue = 10;
  
  for (const [range, gem] of Object.entries(GEM_TYPES)) {
    const rangeParts = range.split('-').map(n => parseInt(n));
    const min = rangeParts[0];
    const max = rangeParts[1];
    if (min !== undefined && max !== undefined && roll >= min && roll <= max) {
      gemType = gem.name;
      baseValue = gem.baseValue;
      break;
    }
  }
  
  // Apply value adjustment (2d6)
  const adjustment = rollDice("2d6");
  let multiplier = 1;
  
  switch (adjustment) {
    case 2: multiplier = 0.25; break; // Next Lower Value Row
    case 3: multiplier = 0.5; break;  // 1/2
    case 4: multiplier = 0.75; break; // 3/4
    case 5: case 6: case 7: case 8: case 9: multiplier = 1; break; // Normal Value
    case 10: multiplier = 1.5; break; // 1.5 Times
    case 11: multiplier = 2; break;   // 2 Times
    case 12: multiplier = 4; break;   // Next Higher Value Row
  }
  
  const finalValue = Math.round(baseValue * multiplier);
  return `${gemType} (${finalValue} gp)`;
}

function generateJewelry(): string {
  const type = JEWELRY_TYPES[Math.floor(Math.random() * JEWELRY_TYPES.length)]!;
  const baseValue = rollDice("2d8") * 100; // Standard jewelry value
  return `${type} (${baseValue} gp)`;
}

function generateMagicItem(): string {
  const roll = rollPercentage();
  
  if (roll <= 25) { // Weapon
    const weapon = MAGIC_WEAPONS[Math.floor(Math.random() * MAGIC_WEAPONS.length)]!;
    
    // Determine weapon bonus
    let bonus = "+1";
    const bonusRoll = rollPercentage();
    if (bonusRoll <= 40) bonus = "+1";
    else if (bonusRoll <= 58) bonus = "+2";
    else if (bonusRoll <= 64) bonus = "+3";
    else if (bonusRoll <= 57) bonus = "+4";
    else if (bonusRoll === 58) bonus = "+5";
    else if (bonusRoll <= 75) bonus = "+1, +2 vs. Special Enemy";
    else if (bonusRoll <= 85) bonus = "+1, +3 vs. Special Enemy";
    else if (bonusRoll <= 95) bonus = "Roll Again + Special Ability";
    else if (bonusRoll <= 98) bonus = "Cursed, -1";
    else bonus = "Cursed, -2";
    
    return `${weapon} ${bonus}`;
  } else if (roll <= 70) { // Armor
    const armor = MAGIC_ARMOR[Math.floor(Math.random() * MAGIC_ARMOR.length)]!;
    const bonusRoll = rollPercentage();
    let bonus = "+1";
    if (bonusRoll <= 50) bonus = "+1";
    else if (bonusRoll <= 80) bonus = "+2";
    else if (bonusRoll <= 90) bonus = "+3";
    else if (bonusRoll <= 95) bonus = "Cursed";
    else bonus = "Cursed, AC 11";
    
    return `${armor} ${bonus}`;
  } else if (roll <= 79) { // Scroll
    return SCROLLS[Math.floor(Math.random() * SCROLLS.length)]!;
  } else if (roll <= 86) { // Wand, Staff, or Rod
    return WANDS_STAVES_RODS[Math.floor(Math.random() * WANDS_STAVES_RODS.length)]!;
  } else if (roll <= 96) { // Miscellaneous Items
    return MISCELLANEOUS_ITEMS[Math.floor(Math.random() * MISCELLANEOUS_ITEMS.length)]!;
  } else { // Rare Items
    return RARE_ITEMS[Math.floor(Math.random() * RARE_ITEMS.length)]!;
  }
}

interface TreasureConfig {
  copper: { chance: number; amount: string };
  silver: { chance: number; amount: string };
  electrum: { chance: number; amount: string };
  gold: { chance: number; amount: string };
  platinum: { chance: number; amount: string };
  gems: { chance: number; amount: string };
  jewelry: { chance: number; amount: string };
  magic: { chance: number; amount: number };
}

// Lair treasure generation
function generateLairTreasure(type: LairTreasureType): TreasureResult {
  const result: TreasureResult = {
    type: "Lair",
    level: type,
    copper: 0,
    silver: 0,
    electrum: 0,
    gold: 0,
    platinum: 0,
    gemsAndJewelry: [],
    magicItems: [],
    description: `Lair Treasure Type ${type}`,
    breakdown: []
  };

  const treasureTypes: Record<LairTreasureType, TreasureConfig> = {
    A: {
      copper: { chance: 50, amount: "5d6" },
      silver: { chance: 60, amount: "5d6" },
      electrum: { chance: 40, amount: "5d4" },
      gold: { chance: 70, amount: "10d6" },
      platinum: { chance: 50, amount: "1d10" },
      gems: { chance: 50, amount: "6d6" },
      jewelry: { chance: 50, amount: "6d6" },
      magic: { chance: 30, amount: 3 }
    },
    B: {
      copper: { chance: 75, amount: "5d10" },
      silver: { chance: 50, amount: "5d6" },
      electrum: { chance: 50, amount: "5d4" },
      gold: { chance: 50, amount: "3d6" },
      platinum: { chance: 0, amount: "0" },
      gems: { chance: 25, amount: "1d6" },
      jewelry: { chance: 25, amount: "1d6" },
      magic: { chance: 10, amount: 1 }
    },
    C: {
      copper: { chance: 60, amount: "6d6" },
      silver: { chance: 60, amount: "5d4" },
      electrum: { chance: 30, amount: "2d6" },
      gold: { chance: 0, amount: "0" },
      platinum: { chance: 0, amount: "0" },
      gems: { chance: 25, amount: "1d4" },
      jewelry: { chance: 25, amount: "1d4" },
      magic: { chance: 15, amount: 2 }
    },
    D: {
      copper: { chance: 30, amount: "4d6" },
      silver: { chance: 45, amount: "6d6" },
      electrum: { chance: 0, amount: "0" },
      gold: { chance: 90, amount: "5d8" },
      platinum: { chance: 0, amount: "0" },
      gems: { chance: 30, amount: "1d8" },
      jewelry: { chance: 30, amount: "1d8" },
      magic: { chance: 20, amount: 2 }
    },
    E: {
      copper: { chance: 30, amount: "2d8" },
      silver: { chance: 60, amount: "6d10" },
      electrum: { chance: 50, amount: "3d8" },
      gold: { chance: 50, amount: "4d10" },
      platinum: { chance: 0, amount: "0" },
      gems: { chance: 10, amount: "1d10" },
      jewelry: { chance: 10, amount: "1d10" },
      magic: { chance: 30, amount: 4 }
    },
    F: {
      copper: { chance: 0, amount: "0" },
      silver: { chance: 40, amount: "3d8" },
      electrum: { chance: 50, amount: "4d8" },
      gold: { chance: 85, amount: "6d10" },
      platinum: { chance: 70, amount: "2d8" },
      gems: { chance: 20, amount: "2d12" },
      jewelry: { chance: 10, amount: "1d12" },
      magic: { chance: 35, amount: 4 }
    },
    G: {
      copper: { chance: 0, amount: "0" },
      silver: { chance: 0, amount: "0" },
      electrum: { chance: 0, amount: "0" },
      gold: { chance: 90, amount: "4d6x10" },
      platinum: { chance: 75, amount: "5d8" },
      gems: { chance: 25, amount: "3d6" },
      jewelry: { chance: 25, amount: "1d10" },
      magic: { chance: 50, amount: 4 }
    },
    H: {
      copper: { chance: 0, amount: "0" },
      silver: { chance: 0, amount: "0" },
      electrum: { chance: 0, amount: "0" },
      gold: { chance: 0, amount: "0" },
      platinum: { chance: 0, amount: "0" },
      gems: { chance: 0, amount: "0" },
      jewelry: { chance: 0, amount: "0" },
      magic: { chance: 0, amount: 4 }
    },
    I: {
      copper: { chance: 0, amount: "0" },
      silver: { chance: 0, amount: "0" },
      electrum: { chance: 0, amount: "0" },
      gold: { chance: 0, amount: "0" },
      platinum: { chance: 80, amount: "3d10" },
      gems: { chance: 50, amount: "2d6" },
      jewelry: { chance: 50, amount: "2d6" },
      magic: { chance: 15, amount: 1 }
    },
    J: {
      copper: { chance: 45, amount: "3d8" },
      silver: { chance: 45, amount: "1d8" },
      electrum: { chance: 0, amount: "0" },
      gold: { chance: 0, amount: "0" },
      platinum: { chance: 0, amount: "0" },
      gems: { chance: 0, amount: "0" },
      jewelry: { chance: 0, amount: "0" },
      magic: { chance: 0, amount: 0 }
    },
    K: {
      copper: { chance: 0, amount: "0" },
      silver: { chance: 90, amount: "2d10" },
      electrum: { chance: 35, amount: "1d8" },
      gold: { chance: 0, amount: "0" },
      platinum: { chance: 0, amount: "0" },
      gems: { chance: 0, amount: "0" },
      jewelry: { chance: 0, amount: "0" },
      magic: { chance: 0, amount: 0 }
    },
    L: {
      copper: { chance: 0, amount: "0" },
      silver: { chance: 0, amount: "0" },
      electrum: { chance: 0, amount: "0" },
      gold: { chance: 0, amount: "0" },
      platinum: { chance: 0, amount: "0" },
      gems: { chance: 50, amount: "1d4" },
      jewelry: { chance: 0, amount: "0" },
      magic: { chance: 0, amount: 0 }
    },
    M: {
      copper: { chance: 0, amount: "0" },
      silver: { chance: 0, amount: "0" },
      electrum: { chance: 0, amount: "0" },
      gold: { chance: 90, amount: "4d10" },
      platinum: { chance: 90, amount: "2d8x10" },
      gems: { chance: 55, amount: "5d4" },
      jewelry: { chance: 45, amount: "2d6" },
      magic: { chance: 0, amount: 0 }
    },
    N: {
      copper: { chance: 0, amount: "0" },
      silver: { chance: 0, amount: "0" },
      electrum: { chance: 0, amount: "0" },
      gold: { chance: 0, amount: "0" },
      platinum: { chance: 0, amount: "0" },
      gems: { chance: 0, amount: "0" },
      jewelry: { chance: 0, amount: "0" },
      magic: { chance: 40, amount: 4 }
    },
    O: {
      copper: { chance: 0, amount: "0" },
      silver: { chance: 0, amount: "0" },
      electrum: { chance: 0, amount: "0" },
      gold: { chance: 0, amount: "0" },
      platinum: { chance: 0, amount: "0" },
      gems: { chance: 0, amount: "0" },
      jewelry: { chance: 0, amount: "0" },
      magic: { chance: 50, amount: 4 }
    }
  };

  const config = treasureTypes[type];
  
  // Generate coins
  if (rollPercentage() <= config.copper.chance) {
    result.copper = rollDice(config.copper.amount);
    result.breakdown.push(`Copper: ${result.copper} (${config.copper.amount})`);
  }
  
  if (rollPercentage() <= config.silver.chance) {
    result.silver = rollDice(config.silver.amount);
    result.breakdown.push(`Silver: ${result.silver} (${config.silver.amount})`);
  }
  
  if (rollPercentage() <= config.electrum.chance) {
    result.electrum = rollDice(config.electrum.amount);
    result.breakdown.push(`Electrum: ${result.electrum} (${config.electrum.amount})`);
  }
  
  if (rollPercentage() <= config.gold.chance) {
    let goldAmount = config.gold.amount;
    if (goldAmount.includes('x10')) {
      goldAmount = goldAmount.replace('x10', '');
      result.gold = rollDice(goldAmount) * 10;
    } else {
      result.gold = rollDice(goldAmount);
    }
    result.breakdown.push(`Gold: ${result.gold} (${config.gold.amount})`);
  }
  
  if (rollPercentage() <= config.platinum.chance) {
    let platAmount = config.platinum.amount;
    if (platAmount.includes('x10')) {
      platAmount = platAmount.replace('x10', '');
      result.platinum = rollDice(platAmount) * 10;
    } else {
      result.platinum = rollDice(platAmount);
    }
    result.breakdown.push(`Platinum: ${result.platinum} (${config.platinum.amount})`);
  }
  
  // Generate gems
  if (rollPercentage() <= config.gems.chance) {
    const gemCount = rollDice(config.gems.amount);
    for (let i = 0; i < gemCount; i++) {
      result.gemsAndJewelry.push(generateGem());
    }
    result.breakdown.push(`Gems: ${gemCount} generated`);
  }
  
  // Generate jewelry
  if (rollPercentage() <= config.jewelry.chance) {
    const jewelryCount = rollDice(config.jewelry.amount);
    for (let i = 0; i < jewelryCount; i++) {
      result.gemsAndJewelry.push(generateJewelry());
    }
    result.breakdown.push(`Jewelry: ${jewelryCount} generated`);
  }
  
  // Generate magic items
  if (rollPercentage() <= config.magic.chance) {
    for (let i = 0; i < config.magic.amount; i++) {
      result.magicItems.push(generateMagicItem());
    }
    result.breakdown.push(`Magic Items: ${config.magic.amount} generated`);
  }

  return result;
}

interface IndividualTreasureConfig {
  copper: { amount: string; chance?: number };
  silver: { amount: string; chance?: number };
  electrum: { amount: string; chance?: number };
  gold: { amount: string; chance?: number };
  platinum: { amount: string; chance?: number };
  gems: { amount: string; chance?: number };
  jewelry: { amount: string; chance?: number };
  magic: { amount: number; chance?: number };
}

// Individual treasure generation
function generateIndividualTreasure(type: IndividualTreasureType): TreasureResult {
  const result: TreasureResult = {
    type: "Individual",
    level: type,
    copper: 0,
    silver: 0,
    electrum: 0,
    gold: 0,
    platinum: 0,
    gemsAndJewelry: [],
    magicItems: [],
    description: `Individual Treasure Type ${type}`,
    breakdown: []
  };

  const treasureTypes: Record<IndividualTreasureType, IndividualTreasureConfig> = {
    P: {
      copper: { amount: "3d8" },
      silver: { amount: "0" },
      electrum: { amount: "0" },
      gold: { amount: "0" },
      platinum: { amount: "0" },
      gems: { amount: "0" },
      jewelry: { amount: "0" },
      magic: { amount: 0 }
    },
    Q: {
      copper: { amount: "0" },
      silver: { amount: "3d6" },
      electrum: { amount: "0" },
      gold: { amount: "0" },
      platinum: { amount: "0" },
      gems: { amount: "0" },
      jewelry: { amount: "0" },
      magic: { amount: 0 }
    },
    R: {
      copper: { amount: "0" },
      silver: { amount: "0" },
      electrum: { amount: "2d6" },
      gold: { amount: "0" },
      platinum: { amount: "0" },
      gems: { amount: "0" },
      jewelry: { amount: "0" },
      magic: { amount: 0 }
    },
    S: {
      copper: { amount: "0" },
      silver: { amount: "0" },
      electrum: { amount: "0" },
      gold: { amount: "2d4" },
      platinum: { amount: "0" },
      gems: { amount: "0" },
      jewelry: { amount: "0" },
      magic: { amount: 0 }
    },
    T: {
      copper: { amount: "0" },
      silver: { amount: "0" },
      electrum: { amount: "0" },
      gold: { amount: "0" },
      platinum: { amount: "1d6" },
      gems: { amount: "0" },
      jewelry: { amount: "0" },
      magic: { amount: 0 }
    },
    U: {
      copper: { chance: 50, amount: "1d20" },
      silver: { chance: 50, amount: "1d20" },
      electrum: { chance: 0, amount: "0" },
      gold: { chance: 25, amount: "1d20" },
      platinum: { chance: 0, amount: "0" },
      gems: { chance: 5, amount: "1d4" },
      jewelry: { chance: 5, amount: "1d4" },
      magic: { chance: 2, amount: 1 }
    },
    V: {
      copper: { chance: 0, amount: "0" },
      silver: { chance: 25, amount: "1d20" },
      electrum: { chance: 25, amount: "1d20" },
      gold: { chance: 50, amount: "1d20" },
      platinum: { chance: 25, amount: "1d20" },
      gems: { chance: 10, amount: "1d4" },
      jewelry: { chance: 10, amount: "1d4" },
      magic: { chance: 5, amount: 1 }
    }
  };

  const config = treasureTypes[type];
  
  // Generate coins (most individual treasures are guaranteed)
  if (config.copper.amount !== "0") {
    if (config.copper.chance) {
      if (rollPercentage() <= config.copper.chance) {
        result.copper = rollDice(config.copper.amount);
        result.breakdown.push(`Copper: ${result.copper} (${config.copper.amount})`);
      }
    } else {
      result.copper = rollDice(config.copper.amount);
      result.breakdown.push(`Copper: ${result.copper} (${config.copper.amount})`);
    }
  }
  
  if (config.silver.amount !== "0") {
    if (config.silver.chance) {
      if (rollPercentage() <= config.silver.chance) {
        result.silver = rollDice(config.silver.amount);
        result.breakdown.push(`Silver: ${result.silver} (${config.silver.amount})`);
      }
    } else {
      result.silver = rollDice(config.silver.amount);
      result.breakdown.push(`Silver: ${result.silver} (${config.silver.amount})`);
    }
  }
  
  if (config.electrum.amount !== "0") {
    if (config.electrum.chance) {
      if (rollPercentage() <= config.electrum.chance) {
        result.electrum = rollDice(config.electrum.amount);
        result.breakdown.push(`Electrum: ${result.electrum} (${config.electrum.amount})`);
      }
    } else {
      result.electrum = rollDice(config.electrum.amount);
      result.breakdown.push(`Electrum: ${result.electrum} (${config.electrum.amount})`);
    }
  }
  
  if (config.gold.amount !== "0") {
    if (config.gold.chance) {
      if (rollPercentage() <= config.gold.chance) {
        result.gold = rollDice(config.gold.amount);
        result.breakdown.push(`Gold: ${result.gold} (${config.gold.amount})`);
      }
    } else {
      result.gold = rollDice(config.gold.amount);
      result.breakdown.push(`Gold: ${result.gold} (${config.gold.amount})`);
    }
  }
  
  if (config.platinum.amount !== "0") {
    if (config.platinum.chance) {
      if (rollPercentage() <= config.platinum.chance) {
        result.platinum = rollDice(config.platinum.amount);
        result.breakdown.push(`Platinum: ${result.platinum} (${config.platinum.amount})`);
      }
    } else {
      result.platinum = rollDice(config.platinum.amount);
      result.breakdown.push(`Platinum: ${result.platinum} (${config.platinum.amount})`);
    }
  }
  
  // Generate gems and jewelry for U and V types
  if (config.gems.chance && rollPercentage() <= config.gems.chance) {
    const gemCount = rollDice(config.gems.amount);
    for (let i = 0; i < gemCount; i++) {
      result.gemsAndJewelry.push(generateGem());
    }
    result.breakdown.push(`Gems: ${gemCount} generated`);
  }
  
  if (config.jewelry.chance && rollPercentage() <= config.jewelry.chance) {
    const jewelryCount = rollDice(config.jewelry.amount);
    for (let i = 0; i < jewelryCount; i++) {
      result.gemsAndJewelry.push(generateJewelry());
    }
    result.breakdown.push(`Jewelry: ${jewelryCount} generated`);
  }
  
  // Generate magic items for U and V types
  if (config.magic.chance && rollPercentage() <= config.magic.chance) {
    for (let i = 0; i < config.magic.amount; i++) {
      result.magicItems.push(generateMagicItem());
    }
    result.breakdown.push(`Magic Items: ${config.magic.amount} generated`);
  }

  return result;
}

interface UnguardedTreasureConfig {
  copper: { chance: number; amount: string };
  silver: { chance: number; amount: string };
  electrum: { chance: number; amount: string };
  gold: { chance: number; amount: string };
  platinum: { chance: number; amount: string };
  gems: { chance: number; amount: string };
  jewelry: { chance: number; amount: string };
  magic: { chance: number; amount: number };
}

// Unguarded treasure generation
function generateUnguardedTreasure(level: UnguardedTreasureLevel): TreasureResult {
  const result: TreasureResult = {
    type: "Unguarded",
    level: level.toString(),
    copper: 0,
    silver: 0,
    electrum: 0,
    gold: 0,
    platinum: 0,
    gemsAndJewelry: [],
    magicItems: [],
    description: `Unguarded Treasure Level ${level}`,
    breakdown: []
  };

  const treasureLevels: Record<UnguardedTreasureLevel, UnguardedTreasureConfig> = {
    1: {
      copper: { chance: 75, amount: "1d8" },
      silver: { chance: 50, amount: "1d6" },
      electrum: { chance: 25, amount: "1d4" },
      gold: { chance: 7, amount: "1d4" },
      platinum: { chance: 1, amount: "1d4" },
      gems: { chance: 7, amount: "1d4" },
      jewelry: { chance: 3, amount: "1d4" },
      magic: { chance: 2, amount: 1 }
    },
    2: {
      copper: { chance: 50, amount: "1d10" },
      silver: { chance: 50, amount: "1d8" },
      electrum: { chance: 25, amount: "1d6" },
      gold: { chance: 20, amount: "1d6" },
      platinum: { chance: 2, amount: "1d4" },
      gems: { chance: 10, amount: "1d6" },
      jewelry: { chance: 7, amount: "1d4" },
      magic: { chance: 5, amount: 1 }
    },
    3: {
      copper: { chance: 30, amount: "2d6" },
      silver: { chance: 50, amount: "1d10" },
      electrum: { chance: 25, amount: "1d8" },
      gold: { chance: 50, amount: "1d6" },
      platinum: { chance: 4, amount: "1d4" },
      gems: { chance: 15, amount: "1d6" },
      jewelry: { chance: 7, amount: "1d6" },
      magic: { chance: 8, amount: 1 }
    },
    4: {
      copper: { chance: 20, amount: "3d6" },
      silver: { chance: 50, amount: "2d6" },
      electrum: { chance: 25, amount: "1d10" },
      gold: { chance: 50, amount: "2d6" },
      platinum: { chance: 8, amount: "1d4" },
      gems: { chance: 20, amount: "1d8" },
      jewelry: { chance: 10, amount: "1d6" },
      magic: { chance: 12, amount: 1 }
    },
    5: {
      copper: { chance: 15, amount: "4d6" },
      silver: { chance: 50, amount: "3d6" },
      electrum: { chance: 25, amount: "1d12" },
      gold: { chance: 70, amount: "2d8" },
      platinum: { chance: 15, amount: "1d4" },
      gems: { chance: 30, amount: "1d8" },
      jewelry: { chance: 15, amount: "1d6" },
      magic: { chance: 16, amount: 1 }
    },
    6: {
      copper: { chance: 10, amount: "5d6" },
      silver: { chance: 50, amount: "5d6" },
      electrum: { chance: 25, amount: "2d8" },
      gold: { chance: 75, amount: "4d6" },
      platinum: { chance: 30, amount: "1d4" },
      gems: { chance: 40, amount: "1d8" },
      jewelry: { chance: 30, amount: "1d8" },
      magic: { chance: 20, amount: 1 }
    },
    7: {
      copper: { chance: 10, amount: "5d6" },
      silver: { chance: 50, amount: "5d6" },
      electrum: { chance: 25, amount: "2d8" },
      gold: { chance: 75, amount: "4d6" },
      platinum: { chance: 30, amount: "1d4" },
      gems: { chance: 40, amount: "1d8" },
      jewelry: { chance: 30, amount: "1d8" },
      magic: { chance: 20, amount: 1 }
    },
    8: {
      copper: { chance: 10, amount: "5d6" },
      silver: { chance: 50, amount: "5d6" },
      electrum: { chance: 25, amount: "2d8" },
      gold: { chance: 75, amount: "4d6" },
      platinum: { chance: 30, amount: "1d4" },
      gems: { chance: 40, amount: "1d8" },
      jewelry: { chance: 30, amount: "1d8" },
      magic: { chance: 20, amount: 1 }
    }
  };

  const config = treasureLevels[level];
  
  // Generate all treasure types based on chance
  if (rollPercentage() <= config.copper.chance) {
    result.copper = rollDice(config.copper.amount);
    result.breakdown.push(`Copper: ${result.copper} (${config.copper.amount})`);
  }
  
  if (rollPercentage() <= config.silver.chance) {
    result.silver = rollDice(config.silver.amount);
    result.breakdown.push(`Silver: ${result.silver} (${config.silver.amount})`);
  }
  
  if (rollPercentage() <= config.electrum.chance) {
    result.electrum = rollDice(config.electrum.amount);
    result.breakdown.push(`Electrum: ${result.electrum} (${config.electrum.amount})`);
  }
  
  if (rollPercentage() <= config.gold.chance) {
    result.gold = rollDice(config.gold.amount);
    result.breakdown.push(`Gold: ${result.gold} (${config.gold.amount})`);
  }
  
  if (rollPercentage() <= config.platinum.chance) {
    result.platinum = rollDice(config.platinum.amount);
    result.breakdown.push(`Platinum: ${result.platinum} (${config.platinum.amount})`);
  }
  
  if (rollPercentage() <= config.gems.chance) {
    const gemCount = rollDice(config.gems.amount);
    for (let i = 0; i < gemCount; i++) {
      result.gemsAndJewelry.push(generateGem());
    }
    result.breakdown.push(`Gems: ${gemCount} generated`);
  }
  
  if (rollPercentage() <= config.jewelry.chance) {
    const jewelryCount = rollDice(config.jewelry.amount);
    for (let i = 0; i < jewelryCount; i++) {
      result.gemsAndJewelry.push(generateJewelry());
    }
    result.breakdown.push(`Jewelry: ${jewelryCount} generated`);
  }
  
  if (rollPercentage() <= config.magic.chance) {
    for (let i = 0; i < config.magic.amount; i++) {
      result.magicItems.push(generateMagicItem());
    }
    result.breakdown.push(`Magic Items: ${config.magic.amount} generated`);
  }

  return result;
}

// Main generation function
export function generateTreasure(
  type: TreasureType,
  subtype: LairTreasureType | IndividualTreasureType | UnguardedTreasureLevel
): TreasureResult {
  switch (type) {
    case "lair":
      return generateLairTreasure(subtype as LairTreasureType);
    case "individual":
      return generateIndividualTreasure(subtype as IndividualTreasureType);
    case "unguarded":
      return generateUnguardedTreasure(subtype as UnguardedTreasureLevel);
    default:
      throw new Error(`Unknown treasure type: ${type}`);
  }
}

// Utility function to format treasure result for display
export function formatTreasureResult(treasure: TreasureResult): string {
  const parts: string[] = [];
  
  // Add description
  parts.push(`**${treasure.description}**\n`);
  
  // Add coins
  const coins: string[] = [];
  if (treasure.platinum > 0) coins.push(`${treasure.platinum} pp`);
  if (treasure.gold > 0) coins.push(`${treasure.gold} gp`);
  if (treasure.electrum > 0) coins.push(`${treasure.electrum} ep`);
  if (treasure.silver > 0) coins.push(`${treasure.silver} sp`);
  if (treasure.copper > 0) coins.push(`${treasure.copper} cp`);
  
  if (coins.length > 0) {
    parts.push(`**Coins:** ${coins.join(", ")}`);
  }
  
  // Add gems and jewelry
  if (treasure.gemsAndJewelry.length > 0) {
    parts.push(`**Gems & Jewelry:**`);
    treasure.gemsAndJewelry.forEach(item => {
      parts.push(`• ${item}`);
    });
  }
  
  // Add magic items
  if (treasure.magicItems.length > 0) {
    parts.push(`**Magic Items:**`);
    treasure.magicItems.forEach(item => {
      parts.push(`• ${item}`);
    });
  }
  
  // Add breakdown if requested
  if (treasure.breakdown.length > 0) {
    parts.push(`\n**Generation Details:**`);
    treasure.breakdown.forEach(detail => {
      parts.push(`• ${detail}`);
    });
  }
  
  return parts.join("\n");
}