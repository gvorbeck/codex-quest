/**
 * Shared type definitions for monster/bestiary data
 */

export interface MonsterStats {
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
}

export interface Monster {
  name: string;
  variants?: Array<[string, MonsterStats]>;
  ac?: string;
  hitDice?: string;
  numAttacks?: string;
  damage?: string;
  movement?: string;
  numAppear?: string;
  saveAs?: string;
  morale?: string;
  treasure?: string;
  xp?: string;
  category?: string;
  description?: string;
}

export interface MonsterWithCategory extends Monster {
  category: string;
  [key: string]: unknown; // For Accordion compatibility
}