// Constants for magic item generation
export const MAGIC_ITEM_CATEGORIES = {
  WEAPON: 25,
  ARMOR: 70,
  SCROLL: 79,
  WAND_STAFF_ROD: 86,
  MISCELLANEOUS: 96,
  RARE: 100,
} as const;

export const GEM_VALUE_ADJUSTMENTS = {
  NEXT_LOWER: { roll: 2, multiplier: 0.25 },
  HALF_VALUE: { roll: 3, multiplier: 0.5 },
  THREE_QUARTER: { roll: 4, multiplier: 0.75 },
  NORMAL_MIN: 5,
  NORMAL_MAX: 9,
  ONE_AND_HALF: { roll: 10, multiplier: 1.5 },
  DOUBLE: { roll: 11, multiplier: 2 },
  NEXT_HIGHER: { roll: 12, multiplier: 4 },
} as const;

// Gem types and values
interface GemType {
  name: string;
  baseValue: number;
}

export const GEM_TYPES: Record<string, GemType> = {
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
export const JEWELRY_TYPES = [
  "Anklet", "Earring", "Belt", "Flagon", "Bowl", "Goblet", "Bracelet", "Knife",
  "Brooch", "Letter Opener", "Buckle", "Locket", "Chain", "Medal", "Choker", 
  "Necklace", "Circlet", "Plate", "Clasp", "Pin", "Comb", "Scepter", "Crown", 
  "Statuette", "Cup", "Tiara"
];

// Magic item tables
export const MAGIC_WEAPONS = [
  "Great Axe", "Battle Axe", "Hand Axe", "Shortbow", "Shortbow Arrow",
  "Longbow", "Longbow Arrow", "Light Quarrel", "Heavy Quarrel", "Dagger",
  "Shortsword", "Longsword", "Scimitar", "Two-Handed Sword", "Warhammer",
  "Mace", "Maul", "Pole Arm", "Sling Bullet", "Spear"
];

export const MAGIC_ARMOR = [
  "Leather Armor", "Chain Mail", "Plate Mail", "Shield"
];

export const SCROLLS = [
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

export const WANDS_STAVES_RODS = [
  "Rod of Cancellation", "Snake Staff", "Staff of Commanding",
  "Staff of Healing", "Staff of Power", "Staff of Striking",
  "Staff of Wizardry", "Wand of Cold", "Wand of Enemy Detection",
  "Wand of Fear", "Wand of Fireballs", "Wand of Illusion",
  "Wand of Lightning Bolts", "Wand of Magic Detection",
  "Wand of Paralysis", "Wand of Polymorph", "Wand of Secret Door Detection",
  "Wand of Trap Detection"
];

export const MISCELLANEOUS_ITEMS = [
  "Blasting", "Blending", "Cold Resistance", "Comprehension", "Control Animal",
  "Control Human", "Control Plant", "Courage", "Deception", "Delusion",
  "Djinni Summoning", "Doom", "Fire Resistance", "Invisibility", "Levitation",
  "Mind Reading", "Panic", "Penetrating Vision", "Protection +1", "Protection +2",
  "Protection +3", "Protection from Energy Drain", "Protection from Scrying",
  "Regeneration", "Scrying", "Scrying, Superior", "Speed", "Spell Storing",
  "Spell Turning", "Stealth", "Telekinesis", "Telepathy", "Teleportation",
  "True Seeing", "Water Walking", "Weakness", "Wishes"
];

export const RARE_ITEMS = [
  "Bag of Devouring", "Bag of Holding", "Boots of Traveling and Leaping",
  "Broom of Flying", "Device of Summoning Elementals", "Efreeti Bottle",
  "Flying Carpet", "Gauntlets of Ogre Power", "Girdle of Giant Strength",
  "Mirror of Imprisonment", "Rope of Climbing"
];