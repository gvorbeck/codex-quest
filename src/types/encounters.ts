export type EncounterType = "dungeon" | "wilderness" | "city";

// Encounter table types - derived from gameRules constants
export type CityType = "Day Encounter" | "Night Encounter";
export type DungeonLevel =
  | "Level 1"
  | "Level 2"
  | "Level 3"
  | "Level 4-5"
  | "Level 6-7"
  | "Level 8+";
export type WildernessType =
  | "Desert or Barren"
  | "Grassland"
  | "Inhabited Territories"
  | "Jungle"
  | "Mountains or Hills"
  | "Ocean"
  | "River or Riverside"
  | "Swamp"
  | "Woods or Forest";
