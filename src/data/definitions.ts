export enum EquipmentCategories {
  GENERAL = "general-equipment",
  AXES = "axes",
  BOWS = "bows",
  DAGGERS = "daggers",
  SWORDS = "swords",
  HAMMERMACE = "hammers-and-maces",
  OTHERWEAPONS = "other-weapons",
  SPEARSPOLES = "spears-and-polearms",
  IMPROVISED = "improvised-weapons",
  CHAINFLAIL = "chain-and-flail",
  SLINGHURLED = "slings-and-hurled-weapons",
  AMMUNITION = "ammunition",
  ARMOR = "armor",
  SHIELDS = "shields",
  BARDING = "barding",
  BEASTS = "beasts-of-burden",
}

export enum ClassNames {
  ASSASSIN = "Assassin",
  BARBARIAN = "Barbarian",
  CLERIC = "Cleric",
  DRUID = "Druid",
  FIGHTER = "Fighter",
  ILLUSIONIST = "Illusionist",
  MAGICUSER = "Magic-User",
  THIEF = "Thief",
  NECROMANCER = "Necromancer",
  RANGER = "Ranger",
  CUSTOM = "Custom",
  PALADIN = "Paladin",
  SCOUT = "Scout",
  SPELLCRAFTER = "Spellcrafter",
}

export enum RaceNames {
  DWARF = "Dwarf",
  ELF = "Elf",
  GNOME = "Gnome",
  HALFLING = "Halfling",
  HUMAN = "Human",
  CUSTOM = "Custom",
  HALFELF = "Half-Elf",
  HALFOGRE = "Half-Ogre",
  HALFORC = "Half-Orc",
  BISREN = "Bisren",
  CANEIN = "Canein",
  CHELONIAN = "Chelonian",
  FAUN = "Faun",
  PHAERIM = "Phaerim",
}

export interface SpellLevels {
  cleric: number | null;
  "magic-user": number | null;
  druid: number | null;
  illusionist: number | null;
  necromancer: number | null;
  paladin: number | null;
}

export enum DiceTypes {
  D4 = "d4",
  D6 = "d6",
  D8 = "d8",
  D10 = "d10",
  D12 = "d12",
  D20 = "d20",
  D100 = "d100",
}
