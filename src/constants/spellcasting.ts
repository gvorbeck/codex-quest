/**
 * Spellcasting class constants for cantrip/orison management
 */

export const DIVINE_CLASSES = ["cleric", "druid"] as const;
export const ARCANE_CLASSES = ["magic-user", "illusionist", "necromancer", "spellcrafter"] as const;

export type DivineClass = typeof DIVINE_CLASSES[number];
export type ArcaneClass = typeof ARCANE_CLASSES[number];
export type SpellcastingClass = DivineClass | ArcaneClass;