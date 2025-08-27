export interface GameCombatant {
  ac: number;
  avatar?: string;
  initiative: number;
  name: string;
  [key: string]: unknown;
}

export interface GamePlayer {
  character: string; // Character ID
  characterName?: string; // Resolved character name
  user: string; // User ID  
  userName?: string; // Resolved user name
  avatar?: string; // Character avatar
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