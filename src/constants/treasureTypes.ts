import type {
  LairTreasureType,
  IndividualTreasureType,
  UnguardedTreasureLevel,
} from "@/utils/treasureGenerator";
import { CURRENCY_UI_CONFIG, type CurrencyKey } from "@/constants";

export interface TreasureTypeConfig {
  value: string;
  label: string;
  icon: string;
}

export const TREASURE_TYPES: TreasureTypeConfig[] = [
  {
    value: "lair",
    label: "Lair",
    icon: "shield",
  },
  {
    value: "individual",
    label: "Individual",
    icon: "user",
  },
  {
    value: "unguarded",
    label: "Unguarded",
    icon: "star",
  },
];

export const LAIR_TREASURE_TYPES: { value: LairTreasureType; label: string }[] =
  [
    { value: "A", label: "Type A - Large dragon hoard" },
    { value: "B", label: "Type B - Medium monster lair" },
    { value: "C", label: "Type C - Small monster lair" },
    { value: "D", label: "Type D - Minor dragon hoard" },
    { value: "E", label: "Type E - Giant lair" },
    { value: "F", label: "Type F - Rich monster lair" },
    { value: "G", label: "Type G - Dragon treasure" },
    { value: "H", label: "Type H - Dragon treasure (special)" },
    { value: "I", label: "Type I - Wealthy individual" },
    { value: "J", label: "Type J - Poor monster" },
    { value: "K", label: "Type K - Minor treasure" },
    { value: "L", label: "Type L - Gem cache" },
    { value: "M", label: "Type M - Royal treasury" },
    { value: "N", label: "Type N - Magic items only" },
    { value: "O", label: "Type O - High-magic treasure" },
  ];

export const INDIVIDUAL_TREASURE_TYPES: {
  value: IndividualTreasureType;
  label: string;
}[] = [
  { value: "P", label: "Type P - Copper pieces" },
  { value: "Q", label: "Type Q - Silver pieces" },
  { value: "R", label: "Type R - Electrum pieces" },
  { value: "S", label: "Type S - Gold pieces" },
  { value: "T", label: "Type T - Platinum pieces" },
  { value: "U", label: "Type U - Adventurer's purse" },
  { value: "V", label: "Type V - Wealthy traveler" },
];

export const UNGUARDED_TREASURE_LEVELS: {
  value: UnguardedTreasureLevel;
  label: string;
}[] = [
  { value: 1, label: "Level 1 - Beginner treasure" },
  { value: 2, label: "Level 2 - Minor cache" },
  { value: 3, label: "Level 3 - Small hoard" },
  { value: 4, label: "Level 4-5 - Medium treasure" },
  { value: 5, label: "Level 4-5 - Medium treasure" },
  { value: 6, label: "Level 6-7 - Valuable cache" },
  { value: 7, label: "Level 6-7 - Valuable cache" },
  { value: 8, label: "Level 8+ - Epic treasure" },
];

export interface CoinConfig {
  key: CurrencyKey;
  label: string;
  color: string;
}

// Derived from unified currency configuration
export const COIN_CONFIGS: CoinConfig[] = CURRENCY_UI_CONFIG.map(({ key, abbrev, textColor }) => ({
  key,
  label: abbrev,
  color: textColor
}));
