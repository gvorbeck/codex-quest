import { CharData, Spell } from "@/data/definitions";
import spells from "@/data/spells.json";

export const getSpellFromName = (name: string) => {
  return spells.find((spell) => spell.name === name);
};

export const getSelectedSpellsByLevel = (
  character: CharData,
  magicClass: string,
) => {
  return character.spells.reduce((acc, spell) => {
    const level = spell.level[magicClass.toLowerCase()];
    if (level) {
      if (acc[level - 1]) {
        acc[level - 1].push(spell);
      } else {
        acc[level - 1] = [spell];
      }
    }
    return acc;
  }, [] as Spell[][]);
};

// Get all the spells available to a Character at a given level
export const getSpellsAtLevel = (character: CharData, level?: number) => {
  const filteredSpells: Spell[] = [];
  character.class.forEach((className) => {
    filteredSpells.push(
      ...spells.filter((spell: Spell) => {
        const levelValue = spell.level?.[className.toLowerCase()];
        if (
          levelValue !== null &&
          levelValue !== undefined &&
          spell.name !== "Read Magic"
        ) {
          if (level) {
            if (levelValue === level) {
              return spell;
            }
          } else {
            if (levelValue <= character.level) {
              return spell;
            }
          }
        }
      }),
    );
  });
  return filteredSpells;
};
