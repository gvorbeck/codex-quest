export interface GameCombatant {
  ac: number;
  avatar?: string;
  initiative: number;
  name: string;
  [key: string]: unknown;
}

export interface GamePlayer {
  character: string; // Character ID
  user: string; // User ID
  [key: string]: unknown;
}

export interface Game {
  id: string;
  name: string;
  notes?: string;
  combatants?: GameCombatant[];
  players?: GamePlayer[];
  // Allow for additional properties that might exist
  [key: string]: unknown;
}