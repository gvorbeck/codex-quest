import { DocumentData } from "firebase-admin/firestore";
import { AttackTypes } from "../support/stringSupport";

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

export enum EquipmentCategoriesWeapons {
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
  DOKKALFAR = "Dokkalfar",
}

export enum DiceTypes {
  D3 = "d3",
  D4 = "d4",
  D6 = "d6",
  D8 = "d8",
  D10 = "d10",
  D12 = "d12",
  D20 = "d20",
  D100 = "d100",
}

export type SavingThrowsType = {
  deathRayOrPoison: number;
  magicWands: number;
  paralysisOrPetrify: number;
  dragonBreath: number;
  spells: number;
};

export type Spell = {
  description: string;
  duration: string;
  level: Record<string, number | null>;
  name: string;
  range: string;
};

export type ZeroLevelSpell = {
  name: string;
  classes: string[];
  description: string;
};

export type Monster = {
  name: string;
  variants: [string, MonsterStatsType][];
  description: string;
};

export type MonsterStatsType = {
  ac: string;
  hitDice: string;
  numAttacks: string;
  damage: string;
  movement: string;
  numAppear: string;
  saveAs: string;
  morale: string;
  treasure: string;
  xp: string;
};

export type Abilities = {
  strength: number | string;
  intelligence: number | string;
  wisdom: number | string;
  dexterity: number | string;
  constitution: number | string;
  charisma: number | string;
};

export type CostCurrency = "gp" | "sp" | "cp";
export type SizeOptions = "S" | "M" | "L";
export type AttackTypeStrings =
  | AttackTypes.MELEE
  | AttackTypes.MISSILE
  | AttackTypes.BOTH;

export type EquipmentItem = {
  AC?: string | number;
  ammo?: string[];
  amount: number;
  capacity?: number;
  category: EquipmentCategories | "inherent" | "weapons";
  costCurrency: CostCurrency;
  costValue: number;
  damage?: string;
  lowCapacity?: number;
  minLevel?: number;
  missileAC?: string;
  name: string;
  noDelete?: boolean;
  notes?: string;
  range?: number[];
  size?: SizeOptions;
  subCategory?: string;
  type?: string;
  weight?: number;
};

export type UpdateCharAction =
  | {
      type: "FETCH";
      payload: DocumentData;
    }
  | {
      type: "UPDATE";
      payload: Partial<CharData>;
    };

export type CharDataAction =
  | UpdateCharAction
  | { type: "RESET" }
  | {
      type: "SET_ABILITIES";
      payload: {
        scores: Abilities;
        modifiers: Abilities;
        newCharacter: boolean;
      };
    }
  | {
      type: "FLIP_ABILITIES";
      payload: {
        newCharacter: boolean;
      };
    }
  | {
      type: "SET_RACE";
      payload: {
        race: string;
      };
    }
  | {
      type: "SET_CLASS";
      payload: {
        class: string[];
        position?: "primary" | "secondary";
        combinationClass?: boolean;
        keepSpells?: boolean;
      };
    }
  | {
      type: "SET_SPELLS";
      payload: {
        spells: Spell[];
      };
    }
  | {
      type: "SET_HP";
      payload: {
        dice?: DiceTypes;
        points: number;
        setMax?: boolean;
        desc?: string;
      };
    }
  | {
      type: "SET_GOLD";
      payload?: { gold: number };
    }
  | {
      type: "SET_EQUIPMENT";
      payload: {
        item: EquipmentItem;
        amount?: number | null;
      };
    }
  | {
      type: "SET_NAME";
      payload: {
        name: string;
      };
    }
  | {
      type: "SET_AVATAR";
      payload: {
        avatar: string;
      };
    };

export type CharData = {
  abilities: {
    scores: Abilities;
    modifiers: Abilities;
  };
  avatar: string;
  cantrips?: ZeroLevelSpell[];
  charId?: string;
  class: string[];
  copper: number;
  desc: string | string[];
  electrum: number;
  equipment: EquipmentItem[];
  gold: number;
  hp: {
    dice: DiceTypes | string;
    points: number;
    max: number;
    desc: string;
  };
  id?: string;
  level: number;
  name: string;
  platinum: number;
  race: string;
  silver: number;
  spells: Spell[];
  userId?: string;
  wearing?: { armor: string; shield: string };
  weight: number;
  xp: number;
  useCoinWeight?: boolean;
};

export type SetCharData = (characterData: CharData) => void;

export type AbilityRecord = {
  key: string;
  ability: string;
  score: number;
};

export type GameData = {
  name: string;
  id?: string;
  players: PlayerListObject[];
  notes?: string;
  combatants: CombatantType[];
};

export type PlayerListObject = { user: string; character: string };

export type GamePlayer = {
  user: string;
  character: string;
};
export type GamePlayerList = GamePlayer[];

export type AvatarTypes = "none" | "stock" | "upload";

export type CombatantType = {
  name: string;
  initiative: number;
  tags: string[];
  type: CombatantTypes;
  avatar?: string;
  ac?: number;
};

export type CombatantTypes = "player" | "monster";

export interface ModalDisplay {
  isOpen: boolean;
  title: string;
  content: React.ReactNode | undefined;
}

export type Loot = {
  copper: number;
  silver: number;
  electrum: number;
  gold: number;
  platinum: number;
  gems: number;
  jewels: number;
  magicItems: number;
};

export type Chances = {
  copper: [number, number, number];
  silver: [number, number, number];
  electrum: [number, number, number];
  gold: [number, number, number];
  platinum: [number, number, number];
  gems: [number, number, number];
  jewels: [number, number, number];
  magicItems: number;
};
