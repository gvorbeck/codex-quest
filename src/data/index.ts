/**
 * Data barrel file
 * Centralized exports for all game data
 */

// Export race and class collections
export { allRaces } from "./races";
export { allClasses } from "./classes";

// Export JSON data with proper typing
export { default as cantripData } from "./magic/cantrips.json";
export { default as spellsData } from "./magic/spells.json";
export { default as equipmentData } from "./equipment/equipment.json";
export { default as equipmentPackData } from "./equipment/equipmentPacks.json";
export { default as monsterData } from "./monsters.json";
