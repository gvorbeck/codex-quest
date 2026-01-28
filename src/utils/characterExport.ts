/**
 * Character Export Utilities
 * Functions for exporting character data in various formats (JSON, TXT)
 */

import type { Character } from "@/types";
import {
  getClassById,
  getRaceById,
  formatModifier,
  calculateArmorClass,
  calculateMovementRate,
} from "@/utils/character";
import { getBaseAttackBonus, getSavingThrows } from "@/utils/combatCalculations";

// Constants
const DIVIDER = "=".repeat(80);

/**
 * Sanitize a character name for use in filenames
 * Converts to lowercase, replaces spaces with hyphens, removes special characters
 */
export function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/**
 * Format current date as YYYY-MM-DD
 */
export function formatDate(): string {
  const datePart = new Date().toISOString().split("T")[0];
  return datePart || "";
}

/**
 * Get XP required for next level
 */
function getXPForNextLevel(character: Character): number | null {
  const classData = getClassById(character.class);
  if (!classData?.experienceTable) return null;

  const nextLevel = character.level + 1;
  return classData.experienceTable[nextLevel as keyof typeof classData.experienceTable] ?? null;
}


/**
 * Generate a human-readable character sheet in text format
 */
export function generateCharacterSheetText(character: Character): string {
  const sections: string[] = [];

  // Header
  sections.push(DIVIDER);
  sections.push("BASIC FANTASY RPG - CHARACTER SHEET");
  sections.push(DIVIDER);
  sections.push("");

  // Basic Info
  const classData = getClassById(character.class);
  const raceData = getRaceById(character.race);
  const className = classData?.name || character.class;
  const raceName = raceData?.name || character.race;

  sections.push(`CHARACTER NAME: ${character.name}`);
  sections.push(`RACE: ${raceName}`.padEnd(30) + `CLASS: ${className}`);

  const nextLevelXP = getXPForNextLevel(character);
  const xpDisplay = nextLevelXP
    ? `${character.xp.toLocaleString()} / ${nextLevelXP.toLocaleString()} (Next Level)`
    : `${character.xp.toLocaleString()}`;
  sections.push(`LEVEL: ${character.level}`.padEnd(30) + `XP: ${xpDisplay}`);
  sections.push("");

  // Ability Scores
  sections.push(DIVIDER);
  sections.push("ABILITY SCORES");
  sections.push(DIVIDER);

  const abilities = [
    { name: "Strength", key: "strength" as const },
    { name: "Dexterity", key: "dexterity" as const },
    { name: "Constitution", key: "constitution" as const },
    { name: "Intelligence", key: "intelligence" as const },
    { name: "Wisdom", key: "wisdom" as const },
    { name: "Charisma", key: "charisma" as const },
  ];

  for (let i = 0; i < abilities.length; i += 2) {
    const left = abilities[i];
    const right = abilities[i + 1];
    if (!left) continue;

    const leftScore = character.abilities[left.key];
    const rightScore = right ? character.abilities[right.key] : null;

    let line = `${left.name}:`.padEnd(15) + `${leftScore.value} (${formatModifier(leftScore.modifier)})`;
    if (rightScore && right) {
      line = line.padEnd(40) + `${right.name}:`.padEnd(15) + `${rightScore.value} (${formatModifier(rightScore.modifier)})`;
    }
    sections.push(line);
  }
  sections.push("");

  // Combat Statistics
  sections.push(DIVIDER);
  sections.push("COMBAT STATISTICS");
  sections.push(DIVIDER);

  sections.push(`Hit Points:    ${character.hp.current} / ${character.hp.max}${character.hp.die ? ` (${character.hp.die})` : ""}`);

  const ac = calculateArmorClass(character);
  sections.push(`Armor Class:   ${ac}`);

  const movement = calculateMovementRate(character);
  sections.push(`Movement:      ${movement}`);
  sections.push("");

  // Attack Bonuses
  const baseAttack = getBaseAttackBonus(character.level, character.class);
  const strMod = character.abilities.strength.modifier;
  const dexMod = character.abilities.dexterity.modifier;
  const meleeAttack = baseAttack + strMod;
  const missileAttack = baseAttack + dexMod;

  sections.push("Attack Bonuses:");
  sections.push(`  Base:        ${formatModifier(baseAttack)}`);
  sections.push(`  Melee:       ${formatModifier(meleeAttack)}`);
  sections.push(`  Missile:     ${formatModifier(missileAttack)}`);
  sections.push("");

  // Saving Throws
  const saves = getSavingThrows(character);
  sections.push("Saving Throws:");
  sections.push(`  Death Ray or Poison:    ${saves.deathRay}`);
  sections.push(`  Magic Wands:            ${saves.magicWands}`);
  sections.push(`  Paralysis or Petrify:   ${saves.paralysis}`);
  sections.push(`  Dragon Breath:          ${saves.dragonBreath}`);
  sections.push(`  Spells:                 ${saves.spells}`);
  sections.push("");

  // Equipment
  if (character.equipment && character.equipment.length > 0) {
    sections.push(DIVIDER);
    sections.push("EQUIPMENT");
    sections.push(DIVIDER);

    // Categorize equipment
    const weapons = character.equipment.filter((item) => item.category === "Weapon");
    const armor = character.equipment.filter((item) => item.category === "Armor");
    const other = character.equipment.filter((item) => item.category !== "Weapon" && item.category !== "Armor");

    if (weapons.length > 0) {
      sections.push("Weapons:");
      weapons.forEach((weapon) => {
        const details = [];
        if (weapon.damage) details.push(weapon.damage);
        if (weapon.range) details.push(weapon.range);
        const wearing = weapon.wearing ? " (equipped)" : "";
        sections.push(`  • ${weapon.name}${wearing}${details.length > 0 ? ` (${details.join(", ")})` : ""}`);
      });
      sections.push("");
    }

    if (armor.length > 0) {
      sections.push("Armor:");
      armor.forEach((item) => {
        const wearing = item.wearing ? " (equipped)" : "";
        const acInfo = item.AC ? ` (AC ${item.AC})` : "";
        sections.push(`  • ${item.name}${wearing}${acInfo}`);
      });
      sections.push("");
    }

    if (other.length > 0) {
      sections.push("General Equipment:");
      other.forEach((item) => {
        const amount = item.amount && item.amount > 1 ? ` (${item.amount})` : "";
        sections.push(`  • ${item.name}${amount}`);
      });
      sections.push("");
    }
  }

  // Currency
  const { gold = 0, silver = 0, copper = 0, electrum = 0, platinum = 0 } = character.currency;
  if (gold || silver || copper || electrum || platinum) {
    sections.push("Currency:");
    if (platinum) sections.push(`  Platinum: ${platinum} pp`);
    if (gold) sections.push(`  Gold:     ${gold} gp`);
    if (electrum) sections.push(`  Electrum: ${electrum} ep`);
    if (silver) sections.push(`  Silver:   ${silver} sp`);
    if (copper) sections.push(`  Copper:   ${copper} cp`);
    sections.push("");
  }

  // Languages
  if (character.languages && character.languages.length > 0) {
    sections.push(DIVIDER);
    sections.push("LANGUAGES");
    sections.push(DIVIDER);
    sections.push(character.languages.join(", "));
    sections.push("");
  }

  // Special Abilities
  if (raceData?.specialAbilities && raceData.specialAbilities.length > 0) {
    sections.push(DIVIDER);
    sections.push("SPECIAL ABILITIES");
    sections.push(DIVIDER);
    raceData.specialAbilities.forEach((ability) => {
      sections.push(`• ${ability.name}`);
      if (ability.description) {
        sections.push(`  ${ability.description}`);
      }
    });
    sections.push("");
  }

  // Spells
  if (character.spells && character.spells.length > 0) {
    sections.push(DIVIDER);
    sections.push("SPELLS");
    sections.push(DIVIDER);

    // Group spells by level
    const spellsByLevel: Record<number, typeof character.spells> = {};
    character.spells.forEach((spell) => {
      const classLower = character.class.toLowerCase() as keyof typeof spell.level;
      const level = spell.level[classLower] ?? 1;
      if (!spellsByLevel[level]) {
        spellsByLevel[level] = [];
      }
      spellsByLevel[level].push(spell);
    });

    Object.keys(spellsByLevel)
      .sort((a, b) => Number(a) - Number(b))
      .forEach((level) => {
        sections.push(`Level ${level}:`);
        const spells = spellsByLevel[Number(level)];
        if (spells) {
          spells.forEach((spell) => {
            sections.push(`  • ${spell.name}`);
          });
        }
        sections.push("");
      });
  }

  // Cantrips
  if (character.cantrips && character.cantrips.length > 0) {
    sections.push("Cantrips/Orisons:");
    character.cantrips.forEach((cantrip) => {
      sections.push(`  • ${cantrip.name}`);
    });
    sections.push("");
  }

  // Footer
  sections.push(DIVIDER);
  sections.push(`[Exported from Codex Quest - BFRPG Character Manager]`);
  sections.push(`[Character Version: ${character.settings?.version || "2.6"} | Export Date: ${formatDate()}]`);
  sections.push(DIVIDER);

  return sections.join("\n");
}
