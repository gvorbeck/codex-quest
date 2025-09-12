import { useMemo } from "react";
import type { Character, Spell, Cantrip } from "@/types/character";
import {
  canCastSpells,
  getSpellLevel,
  getSpellSlots,
  getCharacterSpellSystemType,
} from "@/utils/characterHelpers";
import { allClasses } from "@/data/classes";

interface SpellWithLevel extends Spell {
  spellLevel: number;
  uniqueKey: string;
  [key: string]: unknown;
}

interface CantripWithLevel extends Cantrip {
  spellLevel: 0;
  uniqueKey: string;
  [key: string]: unknown;
}

export interface SpellDataResult {
  knownSpells: SpellWithLevel[];
  cantrips: CantripWithLevel[];
  spellSlots: Record<number, number>;
  spellSystemInfo?: {
    spellType: string;
    spellTypeLower: string;
    abilityBonus: number;
  };
  canCast: boolean;
  spellSystemType: string;
}

// Constants
const READ_MAGIC_SPELL: Spell = {
  name: "Read Magic",
  range: "0 (personal)",
  level: {
    spellcrafter: 1,
    paladin: null,
    cleric: null,
    "magic-user": 1,
    druid: null,
    illusionist: 1,
    necromancer: 1,
  },
  duration: "2 turns",
  description:
    "This spell allows the caster to read magical inscriptions on objects (books, scrolls, weapons, etc.) which would otherwise be unintelligible. Reading a scroll of magic spells in this fashion does not invoke its magic, but allows the caster to see what spell it contains and (if the caster is able to cast spells of the level required) to cast it at a later time. The GM will determine what can be read and what cannot.",
};

// Helper functions
function hasReadMagicAbility(character: Character): boolean {
  return character.class.some((classId) => {
    const classData = allClasses.find((c) => c.id === classId);
    if (!classData?.specialAbilities) return false;

    return classData.specialAbilities.some(
      (ability) => ability.name === "Read Magic"
    );
  });
}

function getSpellSystemInfo(character: Character) {
  const hasDivineClasses = character.class.some((classId) =>
    ["cleric", "druid"].includes(classId)
  );
  const hasArcaneClasses = character.class.some((classId) =>
    ["magic-user", "illusionist", "necromancer", "spellcrafter"].includes(
      classId
    )
  );

  const spellType =
    hasDivineClasses && !hasArcaneClasses ? "Orisons" : "Cantrips";
  const spellTypeLower = spellType.toLowerCase();

  const abilityBonus =
    spellType === "Orisons"
      ? character.abilities.wisdom.modifier
      : character.abilities.intelligence.modifier;

  return {
    spellType,
    spellTypeLower,
    abilityBonus,
  };
}

function getCharacterCantrips(character: Character): CantripWithLevel[] {
  const cantrips = character.cantrips || [];
  return cantrips.map((cantrip, index) => ({
    ...cantrip,
    spellLevel: 0 as const,
    uniqueKey: `${cantrip.name.toLowerCase().replace(/\s+/g, "-")}-${index}`,
  }));
}

export function useSpellData(character?: Character): SpellDataResult {
  return useMemo(() => {
    if (!character || !canCastSpells(character)) {
      return {
        knownSpells: [],
        cantrips: [],
        spellSlots: {},
        spellSystemType: "none",
        canCast: false,
      };
    }

    const characterSpells = character.spells || [];
    const hasReadMagic = hasReadMagicAbility(character);
    const systemType = getCharacterSpellSystemType(character);

    const allSpells: SpellWithLevel[] = [];

    // Add Read Magic if the character's class has it as a special ability
    if (hasReadMagic && !characterSpells.some((s) => s.name === "Read Magic")) {
      const readMagicLevel = getSpellLevel(READ_MAGIC_SPELL, character.class);
      if (readMagicLevel > 0) {
        allSpells.push({
          ...READ_MAGIC_SPELL,
          spellLevel: readMagicLevel,
          uniqueKey: `read-magic-auto`,
        });
      }
    }

    // Add character's spells based on spell system type
    characterSpells.forEach((spell, index) => {
      const spellLevel = getSpellLevel(spell, character.class);
      if (spellLevel > 0) {
        // For magic-user types and custom classes, show spells without preparation metadata
        // For cleric types, this will be handled separately in the prepared spells section
        if ((systemType === "magic-user" || systemType === "custom") && !spell.preparation) {
          allSpells.push({
            ...spell,
            spellLevel,
            uniqueKey: `${spell.name
              .toLowerCase()
              .replace(/\s+/g, "-")}-${index}`,
          });
        }
      }
    });

    const characterCantrips = getCharacterCantrips(character);
    const spells = allSpells.filter((spell) => spell.spellLevel > 0);
    const characterSpellSlots = getSpellSlots(character, allClasses);

    return {
      knownSpells: spells,
      cantrips: characterCantrips,
      spellSlots: characterSpellSlots,
      spellSystemInfo: getSpellSystemInfo(character),
      canCast: canCastSpells(character),
      spellSystemType: systemType,
    };
  }, [character]);
}