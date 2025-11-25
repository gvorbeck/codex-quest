/**
 * Character utilities - consolidated from characterCalculations.ts, characterValidation.ts,
 * characterCreation.ts, characterHelpers.ts, and hitDice.ts
 */

import type {
  Character,
  Equipment,
  Class,
  Race,
  RaceRequirement,
  SpecialAbility,
  SpellSystemType,
  RacialModificationInfo,
} from "@/types";
import type { ValidationSchema } from "@/validation";
import { Rules } from "@/validation";
import { allClasses, allRaces } from "@/data";
import { CHARACTER_CLASSES } from "@/constants";
import { CURRENT_VERSION } from "@/services/characterMigration";
// Note: Using direct imports here to avoid circular dependency with barrel file
import { GAME_MECHANICS } from "./mechanics";
import { logger } from "./data";
import { isWornArmor, isWornShield } from "@/utils/equipment";

// ============================================================================
// EQUIPMENT TYPE GUARDS & CALCULATIONS
// ============================================================================


const parseShieldBonus = (
  shieldAC: string | number,
  itemName: string
): number => {
  if (typeof shieldAC === "string" && shieldAC.startsWith("+")) {
    const bonusValue = parseInt(shieldAC.substring(1), 10);
    if (isNaN(bonusValue)) {
      logger.warn(`Invalid shield AC value for ${itemName}: ${shieldAC}`);
      return 0;
    }
    return bonusValue;
  } else if (typeof shieldAC === "number" && shieldAC > 0) {
    return shieldAC;
  }
  return 0;
};

interface EquipmentLike {
  name: string;
  wearing?: boolean;
  AC?: number | string;
  category?: string;
}

const isEquipmentArray = (equipment: unknown[]): equipment is Equipment[] => {
  return equipment.every((item): item is Equipment =>
    typeof item === 'object' &&
    item !== null &&
    'name' in item &&
    typeof item.name === 'string'
  );
};

export function calculateArmorClass(
  character: Character | { equipment?: EquipmentLike[] }
): number {
  const equipment = character.equipment;
  if (!Array.isArray(equipment)) {
    return GAME_MECHANICS.DEFAULT_UNARMORED_AC;
  }

  if (!isEquipmentArray(equipment)) {
    logger.warn('Invalid equipment array passed to calculateArmorClass');
    return GAME_MECHANICS.DEFAULT_UNARMORED_AC;
  }

  let baseAC = GAME_MECHANICS.DEFAULT_UNARMORED_AC;
  let shieldBonus = 0;

  const wornArmor = equipment.find(isWornArmor);
  if (wornArmor && typeof wornArmor.AC === "number") {
    baseAC = wornArmor.AC;
  }

  const wornShields = equipment.filter(isWornShield);
  wornShields.forEach((shield) => {
    shieldBonus += parseShieldBonus(
      shield.AC ?? 0,
      shield.name ?? "Unknown Shield"
    );
  });

  return baseAC + shieldBonus;
}

export function calculateMovementRate(character: Character): string {
  if (!character.equipment) {
    return GAME_MECHANICS.DEFAULT_MOVEMENT_RATE;
  }

  const wornArmor = character.equipment.find(isWornArmor);

  if (!wornArmor) {
    return GAME_MECHANICS.DEFAULT_MOVEMENT_RATE;
  }

  const armorName = wornArmor.name.toLowerCase();

  if (armorName.includes("leather") || armorName.includes("magic")) {
    return GAME_MECHANICS.LEATHER_ARMOR_MOVEMENT;
  }

  if (
    armorName.includes("chain") ||
    armorName.includes("scale") ||
    armorName.includes("splint") ||
    armorName.includes("plate") ||
    armorName.includes("mail")
  ) {
    return GAME_MECHANICS.METAL_ARMOR_MOVEMENT;
  }

  return GAME_MECHANICS.DEFAULT_MOVEMENT_RATE;
}

// Ability score ranges and their modifiers
const ABILITY_SCORE_RANGES = {
  VERY_LOW: { min: 1, max: 3, modifier: -3 },
  LOW: { min: 4, max: 5, modifier: -2 },
  BELOW_AVERAGE: { min: 6, max: 8, modifier: -1 },
  AVERAGE: { min: 9, max: 12, modifier: 0 },
  ABOVE_AVERAGE: { min: 13, max: 15, modifier: 1 },
  HIGH: { min: 16, max: 17, modifier: 2 },
  VERY_HIGH: { min: 18, max: Infinity, modifier: 3 },
} as const;

// Optimized O(1) ability modifier lookup table
const MODIFIER_LOOKUP: Record<number, number> = (() => {
  const lookup: Record<number, number> = {};

  Object.values(ABILITY_SCORE_RANGES).forEach(({ min, max, modifier }) => {
    const actualMax = max === Infinity ? 25 : max; // Reasonable upper bound
    for (let i = min; i <= actualMax; i++) {
      lookup[i] = modifier;
    }
  });

  return lookup;
})();

export const calculateModifier = (score: number): number => {
  return MODIFIER_LOOKUP[score] ?? GAME_MECHANICS.DEFAULT_HIGH_MODIFIER;
};

export const formatModifier = (modifier: number): string => {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
};

export const getAbilityScoreCategory = (
  score: number,
  allScores: number[]
): "highest" | "lowest" | "normal" => {
  const highestScore = Math.max(...allScores);
  const lowestScore = Math.min(...allScores);

  if (score === highestScore) return "highest";
  if (score === lowestScore) return "lowest";
  return "normal";
};


// ============================================================================
// CHARACTER CREATION
// ============================================================================

export function createEmptyCharacter(): Character {
  return {
    name: "",
    abilities: {
      strength: { value: 0, modifier: 0 },
      dexterity: { value: 0, modifier: 0 },
      constitution: { value: 0, modifier: 0 },
      intelligence: { value: 0, modifier: 0 },
      wisdom: { value: 0, modifier: 0 },
      charisma: { value: 0, modifier: 0 },
    },
    race: "",
    class: "",
    equipment: [],
    currency: { gold: 0 },
    hp: { current: 0, max: 0 },
    level: 1,
    xp: 0,
    settings: { version: CURRENT_VERSION },
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function findById<T extends { id: string }>(
  id: string,
  collection: T[]
): T | undefined {
  return collection.find((item) => item.id === id);
}

export function hasSpells(character: Character): boolean {
  return !!(character.spells && character.spells.length > 0);
}

export function hasCantrips(character: Character): boolean {
  return !!(character.cantrips && character.cantrips.length > 0);
}

export const getClassById = (
  classId: string,
  classes: Class[] = allClasses
): Class | undefined => findById(classId, classes);

export const getClassFromAvailable = (
  classId: string,
  availableClasses: Class[]
): Class | undefined => findById(classId, availableClasses);

export const getRaceById = (
  raceId: string,
  races: Race[] = allRaces
): Race | undefined => findById(raceId, races);

export const getRaceFromAvailable = (
  raceId: string,
  availableRaces: Race[]
): Race | undefined => findById(raceId, availableRaces);

// ============================================================================
// CLASS & RACE DETECTION
// ============================================================================

export const SPELLCASTING_CLASS_TYPES = new Set([
  CHARACTER_CLASSES.MAGIC_USER,
  CHARACTER_CLASSES.CLERIC,
]);

const CLASS_TYPE_TO_SPELL_SYSTEM: Record<string, SpellSystemType> = {
  [CHARACTER_CLASSES.MAGIC_USER]: "magic-user",
  [CHARACTER_CLASSES.CLERIC]: "cleric",
};

export const isSpellcastingClassType = (
  classType: string | undefined
): boolean => {
  if (classType === undefined) return false;
  return SPELLCASTING_CLASS_TYPES.has(
    classType as
      | typeof CHARACTER_CLASSES.MAGIC_USER
      | typeof CHARACTER_CLASSES.CLERIC
  );
};

export function isCustomClass(classId: string): boolean {
  return !getClassById(classId);
}

export function isCustomRace(raceId: string): boolean {
  return !getRaceById(raceId);
}

export function hasCustomClasses(character: Character): boolean {
  return isCustomClass(character.class);
}

export function hasCustomRace(character: Character): boolean {
  return isCustomRace(character.race);
}

export function getCharacterSpellSystemType(
  character: Character
): SpellSystemType {
  if (!character.class) return "none";
  if (hasCustomClasses(character)) return "custom";

  const classData = getClassById(character.class);
  if (!classData || !isSpellcastingClassType(classData.classType)) {
    return "none";
  }

  return classData.classType
    ? CLASS_TYPE_TO_SPELL_SYSTEM[classData.classType] || "none"
    : "none";
}

export function canCastSpells(character: Character): boolean {
  if (isCustomClass(character.class)) {
    return hasSpells(character);
  }

  const standardClass = getClassById(character.class);
  return standardClass?.spellcasting !== undefined;
}

export function getFirstSpellcastingClass(character: Character): string | null {
  if (!character.class) return null;

  if (isCustomClass(character.class)) {
    return hasSpells(character) ? character.class : null;
  }

  const standardClass = getClassById(character.class);
  return standardClass?.spellcasting ? character.class : null;
}

export function hasClassType(character: Character, classType: string): boolean {
  if (isCustomClass(character.class)) {
    return false;
  }

  const classData = getClassById(character.class);
  return classData?.classType === classType;
}

export function hasTurnUndeadAbility(character: Character): boolean {
  const classData = getClassById(character.class);
  if (!classData?.specialAbilities) return false;

  return classData.specialAbilities.some(
    (ability: { name: string }) => ability.name === "Turn Undead"
  );
}

// ============================================================================
// HIT DICE CALCULATIONS
// ============================================================================

export function calculateHitDie(character: Character): string | null {
  if (!character.class) return null;

  if (hasCustomClasses(character)) {
    return character.hp.die || "1d6";
  }

  const primaryClass = findById(character.class, allClasses);
  if (!primaryClass?.hitDie) return null;

  return applyRacialHitDiceModifications(character.race, primaryClass.hitDie);
}

export function applyRacialHitDiceModifications(
  raceId: string,
  baseHitDie: string
): string {
  const raceData = findById(raceId, allRaces);
  if (!raceData?.specialAbilities) return baseHitDie;

  let modifiedHitDie = baseHitDie;

  for (const ability of raceData.specialAbilities) {
    const hitDiceRestriction = ability.effects?.hitDiceRestriction;
    if (hitDiceRestriction?.maxSize) {
      modifiedHitDie = applyHitDiceRestriction(
        modifiedHitDie,
        hitDiceRestriction.maxSize
      );
    } else if (hitDiceRestriction?.sizeDecrease) {
      modifiedHitDie = applyHitDiceDecrease(modifiedHitDie);
    }

    const hitDiceBonus = ability.effects?.hitDiceBonus;
    if (hitDiceBonus?.sizeIncrease) {
      modifiedHitDie = applyHitDiceIncrease(modifiedHitDie);
    }
  }

  return modifiedHitDie;
}

function applyHitDiceRestriction(
  currentHitDie: string,
  maxSizeRestriction: string
): string {
  const classMatch = currentHitDie.match(/\d*d(\d+)/);
  const restrictedMatch = maxSizeRestriction.match(/d(\d+)/);

  if (classMatch?.[1] && restrictedMatch?.[1]) {
    const classDieSize = parseInt(classMatch[1], 10);
    const restrictedDieSize = parseInt(restrictedMatch[1], 10);

    if (restrictedDieSize < classDieSize) {
      return `1${maxSizeRestriction}`;
    }
  }

  return currentHitDie;
}

function applyHitDiceDecrease(currentHitDie: string): string {
  const match = currentHitDie.match(/\d*d(\d+)/);
  if (!match?.[1]) return currentHitDie;

  const currentSize = parseInt(match[1], 10);
  let newSize: number;

  switch (currentSize) {
    case 12:
      newSize = 10;
      break;
    case 10:
      newSize = 8;
      break;
    case 8:
      newSize = 6;
      break;
    case 6:
      newSize = 4;
      break;
    case 4:
      newSize = 3;
      break;
    default:
      newSize = currentSize;
  }

  return `1d${newSize}`;
}

function applyHitDiceIncrease(currentHitDie: string): string {
  const match = currentHitDie.match(/\d*d(\d+)/);
  if (!match?.[1]) return currentHitDie;

  const currentSize = parseInt(match[1], 10);
  let newSize: number;

  switch (currentSize) {
    case 4:
      newSize = 6;
      break;
    case 6:
      newSize = 8;
      break;
    case 8:
      newSize = 10;
      break;
    case 10:
      newSize = 12;
      break;
    default:
      newSize = currentSize;
  }

  return `1d${newSize}`;
}

export function getRacialModificationInfo(
  character: Character
): RacialModificationInfo | null {
  if (hasCustomClasses(character)) {
    return null;
  }

  const primaryClass = findById(character.class, allClasses);
  const raceData = findById(character.race, allRaces);

  if (!primaryClass?.hitDie || !raceData?.specialAbilities) return null;

  const originalHitDie = primaryClass.hitDie;
  const modifiedHitDie = calculateHitDie(character);

  if (originalHitDie === modifiedHitDie) return null;

  for (const ability of raceData.specialAbilities) {
    const hitDiceRestriction = ability.effects?.hitDiceRestriction;
    const hitDiceBonus = ability.effects?.hitDiceBonus;

    if (hitDiceRestriction?.maxSize) {
      const classMatch = originalHitDie.match(/\d*d(\d+)/);
      const restrictedMatch = hitDiceRestriction.maxSize.match(/d(\d+)/);

      if (classMatch?.[1] && restrictedMatch?.[1]) {
        const classDieSize = parseInt(classMatch[1], 10);
        const restrictedDieSize = parseInt(restrictedMatch[1], 10);

        if (restrictedDieSize < classDieSize) {
          return {
            abilityName: ability.name,
            originalHitDie,
            modifiedHitDie: modifiedHitDie || originalHitDie,
            modificationType: "restriction",
          };
        }
      }
    } else if (hitDiceRestriction?.sizeDecrease) {
      return {
        abilityName: ability.name,
        originalHitDie,
        modifiedHitDie: modifiedHitDie || originalHitDie,
        modificationType: "decrease",
      };
    } else if (hitDiceBonus?.sizeIncrease) {
      return {
        abilityName: ability.name,
        originalHitDie,
        modifiedHitDie: modifiedHitDie || originalHitDie,
        modificationType: "increase",
      };
    }
  }

  return null;
}

// ============================================================================
// VALIDATION
// ============================================================================

export function canEquipItem(race: Race, equipmentId: string): boolean {
  return !race.prohibitedWeapons?.includes(equipmentId);
}

export function isRaceEligible(character: Character, race: Race): boolean {
  return race.abilityRequirements.every((req: RaceRequirement) => {
    const abilityValue = character.abilities[req.ability].value;
    const meetsMin = req.min ? abilityValue >= req.min : true;
    const meetsMax = req.max ? abilityValue <= req.max : true;
    return meetsMin && meetsMax;
  });
}

export function getEligibleRaces(character: Character, races: Race[]): Race[] {
  return races.filter((race) => isRaceEligible(character, race));
}

export function hasValidAbilityScores(character: Character): boolean {
  const abilities = Object.values(character.abilities);
  return abilities.every(
    (ability) => ability.value >= 3 && ability.value <= 18
  );
}

export function isCurrentRaceStillValid(
  character: Character,
  race: Race
): boolean {
  return isRaceEligible(character, race);
}

export function isCurrentClassStillValid(
  character: Character,
  selectedRace: Race,
  availableClasses: Class[]
): boolean {
  if (!character.class) return true;

  const custom = isCustomClass(character.class);
  const classAllowed = custom || selectedRace.allowedClasses.includes(character.class);
  const classExists = custom || availableClasses.some((cls) => cls.id === character.class);

  return classAllowed && classExists;
}

export function areCurrentSpellsStillValid(
  character: Character,
  availableClasses: Class[]
): boolean {
  if (!character.spells || character.spells.length === 0) {
    return true;
  }

  if (!character.class) return false;

  const custom = isCustomClass(character.class);
  if (custom) {
    return hasSpells(character);
  }

  const classData = getClassFromAvailable(character.class, availableClasses);
  if (!classData?.spellcasting) {
    return false;
  }

  // Map combination classes to their base spellcasting class for spell level lookups
  let spellKeyToCheck = character.class;
  if (character.class === CHARACTER_CLASSES.FIGHTER_MAGIC_USER ||
      character.class === CHARACTER_CLASSES.MAGIC_USER_THIEF) {
    spellKeyToCheck = CHARACTER_CLASSES.MAGIC_USER;
  }

  // Check if all spells are valid for this class
  return character.spells.every((spell) => {
    const spellLevel = spell.level[spellKeyToCheck as keyof typeof spell.level];
    return spellLevel === 1;
  });
}

export function hasRequiredStartingSpells(
  character: Character,
  availableClasses: Class[]
): boolean {
  if (!character.class) return true;

  if (isCustomClass(character.class)) {
    if (!hasSpells(character)) return true;

    const spells = character.spells || [];
    return spells.length >= 1;
  }

  const classData = getClassFromAvailable(character.class, availableClasses);
  if (!classData || !classData.spellcasting) return true;

  // Magic-user types require at least one starting spell (including combination classes)
  if (classData.classType === CHARACTER_CLASSES.MAGIC_USER ||
      character.class === CHARACTER_CLASSES.FIGHTER_MAGIC_USER ||
      character.class === CHARACTER_CLASSES.MAGIC_USER_THIEF) {
    const spells = character.spells || [];

    // For combination classes, use the base magic-user class to check spell levels
    const spellKeyToCheck = (character.class === CHARACTER_CLASSES.FIGHTER_MAGIC_USER ||
                              character.class === CHARACTER_CLASSES.MAGIC_USER_THIEF)
      ? CHARACTER_CLASSES.MAGIC_USER
      : character.class;

    const firstLevelSpells = spells.filter(
      (spell) => spell.level[spellKeyToCheck as keyof typeof spell.level] === 1
    );

    return firstLevelSpells.length >= 1;
  }

  return true;
}

export function cascadeValidateCharacter(
  character: Character,
  selectedRace: Race | undefined,
  availableClasses: Class[]
): Character {
  let updatedCharacter = { ...character };

  if (selectedRace && !isCurrentRaceStillValid(character, selectedRace)) {
    updatedCharacter = {
      ...updatedCharacter,
      race: "",
      class: "",
      spells: [],
    };
    return updatedCharacter;
  }

  if (selectedRace) {
    const classStillValid = isCurrentClassStillValid(
      updatedCharacter,
      selectedRace,
      availableClasses
    );

    if (!classStillValid) {
      updatedCharacter = {
        ...updatedCharacter,
        class: "",
        spells: [],
      };
    }
  }

  const spellsStillValid = areCurrentSpellsStillValid(
    updatedCharacter,
    availableClasses
  );

  if (!spellsStillValid) {
    updatedCharacter = {
      ...updatedCharacter,
      spells: [],
    };
  }

  return updatedCharacter;
}

export function hasValidHitPoints(character: Character): boolean {
  return character.hp && character.hp.max > 0 && character.hp.current > 0;
}

// ============================================================================
// SPELLCASTING UTILITIES
// ============================================================================

export function getEffectiveSpellcastingClass(
  character: Character,
  availableClasses: Class[]
): { type: "standard" | "custom"; classId: string } | null {
  if (!character.class) return null;

  if (isCustomClass(character.class)) {
    return { type: "custom", classId: character.class };
  }

  const classData = getClassFromAvailable(character.class, availableClasses);
  if (classData?.spellcasting) {
    return { type: "standard", classId: character.class };
  }

  return null;
}

export function getSpellcastingAbilityModifier(character: Character): number {
  const hasCustomSpellcaster = hasCustomClasses(character);

  const hasArcane =
    hasCustomSpellcaster ||
    hasClassType(character, CHARACTER_CLASSES.MAGIC_USER);
  const hasDivine =
    !hasCustomSpellcaster && hasClassType(character, CHARACTER_CLASSES.CLERIC);

  if (hasArcane) {
    return character.abilities.intelligence.modifier;
  } else if (hasDivine) {
    return character.abilities.wisdom.modifier;
  }

  return 0;
}

// ============================================================================
// ADVANCED CHARACTER INFO
// ============================================================================

export function getCustomClass(character: Character, classId: string) {
  if (!isCustomClass(classId)) {
    return null;
  }
  return character.class || null;
}

export function getCustomRace(raceId: string) {
  if (!isCustomRace(raceId)) {
    return null;
  }
  return raceId;
}

export function getClassName(character: Character, classId: string): string {
  if (isCustomClass(classId)) {
    const customClass = getCustomClass(character, classId);
    return customClass || classId;
  }

  const classData = getClassById(classId);
  return classData?.name || classId;
}

export function getRaceName(character: Character, raceId?: string): string {
  const targetRaceId = raceId || character.race;

  if (isCustomRace(targetRaceId)) {
    const customRace = getCustomRace(targetRaceId);
    return customRace || targetRaceId;
  }

  const raceData = getRaceById(targetRaceId);
  return raceData?.name || targetRaceId;
}

export function getPrimaryRaceInfo(
  character: Character,
  availableRaces: Race[]
) {
  const raceId = character.race;
  if (!raceId) return null;

  const standardRace = getRaceFromAvailable(raceId, availableRaces);

  if (standardRace) {
    return {
      ...standardRace,
      isCustom: false,
    };
  }

  return isCustomRace(raceId)
    ? {
        id: raceId,
        name: getRaceName(character, raceId),
        description: `Custom race: ${raceId}`,
        physicalDescription: "User-defined custom race",
        allowedClasses: [],
        abilityRequirements: [],
        specialAbilities: [],
        savingThrows: [],
        lifespan: "Variable",
        languages: [],
        isCustom: true,
      }
    : null;
}

export function getPrimaryClassInfo(
  character: Character,
  availableClasses: Class[]
) {
  if (!character.class) return null;

  const standardClass = getClassFromAvailable(character.class, availableClasses);

  if (standardClass) {
    return {
      ...standardClass,
      isCustom: false,
    };
  }

  return isCustomClass(character.class)
    ? {
        id: character.class,
        name: character.class,
        hitDie: character.hp.die || "1d6",
        usesSpells: hasSpells(character),
        isCustom: true,
      }
    : null;
}

export function getHitDie(
  character: Character,
  availableClasses: Class[]
): string {
  const primaryClassInfo = getPrimaryClassInfo(character, availableClasses);
  return primaryClassInfo?.hitDie || "1d6";
}

export function canLevelUp(
  character: Character,
  availableClasses: Class[]
): boolean {
  const primaryClassInfo = getPrimaryClassInfo(character, availableClasses);
  if (!primaryClassInfo) return false;

  if (primaryClassInfo.isCustom) {
    return true;
  }

  if (!primaryClassInfo.id) return false;
  const standardClass = getClassFromAvailable(
    primaryClassInfo.id,
    availableClasses
  );
  if (!standardClass) return false;

  const nextLevel = character.level + 1;
  const requiredXP = standardClass.experienceTable?.[nextLevel];
  return requiredXP !== undefined && (character.xp ?? 0) >= requiredXP;
}

export function getXPToNextLevel(
  character: Character,
  availableClasses: Class[]
): number | null {
  if (!character.class || hasCustomClasses(character)) return null;

  const nextLevel = character.level + 1;
  const classData = getClassFromAvailable(character.class, availableClasses);
  const xpRequired = classData?.experienceTable?.[nextLevel];

  if (!xpRequired) return null;

  return Math.max(0, xpRequired - (character.xp ?? 0));
}

export function getSpellLevel(
  spell: { level: Record<string, number | null> },
  characterClass: string
): number {
  if (isCustomClass(characterClass)) {
    const validLevels = Object.values(spell.level).filter(
      (level) => level !== null && level !== undefined
    );
    if (validLevels.length > 0) {
      return Math.min(...(validLevels as number[]));
    }
    return 1;
  }

  // Map combination classes to their base spellcasting class for spell level lookup
  let mappedClassId = characterClass;
  if (characterClass === CHARACTER_CLASSES.FIGHTER_MAGIC_USER ||
      characterClass === CHARACTER_CLASSES.MAGIC_USER_THIEF) {
    mappedClassId = CHARACTER_CLASSES.MAGIC_USER;
  }

  const level = spell.level?.[mappedClassId as keyof typeof spell.level];
  if (level != null) {
    return level;
  }

  return 0;
}

function calculateStandardClassSpellSlots(
  classData: Class,
  level: number,
  spellSlots: Record<number, number>
): void {
  if (!classData.spellcasting) return;

  const slotsForLevel = classData.spellcasting.spellsPerLevel[level];
  if (!slotsForLevel) return;

  slotsForLevel.forEach((slots, spellLevel) => {
    if (slots > 0) {
      const level = spellLevel + 1;
      spellSlots[level] = Math.max(spellSlots[level] || 0, slots);
    }
  });
}

function calculateCustomClassSpellSlots(
  character: Character,
  availableClasses: Class[],
  spellSlots: Record<number, number>
): void {
  if (!hasSpells(character)) return;

  const magicUserClass = getClassFromAvailable("magic-user", availableClasses);
  if (!magicUserClass?.spellcasting) return;

  const slotsForLevel =
    magicUserClass.spellcasting.spellsPerLevel[character.level];
  if (!slotsForLevel) return;

  slotsForLevel.forEach((slots, spellLevel) => {
    if (slots > 0) {
      const level = spellLevel + 1;
      spellSlots[level] = Math.max(spellSlots[level] || 0, slots);
    }
  });
}

export function getSpellSlots(
  character: Character,
  availableClasses: Class[]
): Record<number, number> {
  const spellSlots: Record<number, number> = {};

  // Handle single class (character.class is now a string, not an array)
  const classId = character.class;

  if (isCustomClass(classId)) {
    calculateCustomClassSpellSlots(character, availableClasses, spellSlots);
  } else {
    const classData = getClassFromAvailable(classId, availableClasses);
    if (classData) {
      calculateStandardClassSpellSlots(classData, character.level, spellSlots);
    }
  }

  return spellSlots;
}

export function getImportantAbilities(
  specialAbilities: Array<{
    name: string;
    source: "race" | "class";
    effects?: SpecialAbility["effects"];
  }>
): Array<{
  name: string;
  source: "race" | "class";
  effects?: SpecialAbility["effects"];
}> {
  return specialAbilities.filter((ability) => {
    const abilityName = ability.name.toLowerCase();
    return (
      ability.effects?.darkvision ||
      abilityName.includes("darkvision") ||
      abilityName.includes("turn undead") ||
      abilityName.includes("sneak attack") ||
      abilityName.includes("stealth") ||
      abilityName.includes("backstab") ||
      abilityName.includes("spellcasting") ||
      abilityName.includes("immunity") ||
      abilityName.includes("rage") ||
      abilityName.includes("tracking") ||
      abilityName.includes("detect") ||
      abilityName.includes("secret door") ||
      abilityName.includes("hide") ||
      abilityName.includes("climb") ||
      abilityName.includes("move silently") ||
      abilityName.includes("ghoul immunity")
    );
  });
}

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

export const abilityScoreSchema: ValidationSchema<number> = {
  required: true,
  rules: [Rules.isValidAbilityScore, Rules.isInteger],
};

export const characterNameSchema: ValidationSchema<string> = {
  required: true,
  rules: [Rules.characterName],
};

export const raceSelectionSchema: ValidationSchema<string> = {
  required: true,
  rules: [Rules.minLength(1)],
};

export const classSelectionSchema: ValidationSchema<string[]> = {
  required: true,
  rules: [Rules.nonEmptyArray],
};

export const characterSchema: ValidationSchema<Partial<Character>> = {
  required: true,
  rules: [
    {
      name: "hasName",
      validate: (char: Partial<Character>) =>
        typeof char.name === "string" && char.name.trim().length > 0,
      message: "Character must have a name",
    },
    {
      name: "hasAbilities",
      validate: (char: Partial<Character>) =>
        char.abilities !== undefined &&
        Object.values(char.abilities).every((ability) =>
          Rules.isValidAbilityScore.validate(ability.value)
        ),
      message: "Character must have valid ability scores",
    },
    {
      name: "hasRace",
      validate: (char: Partial<Character>) =>
        typeof char.race === "string" && char.race.length > 0,
      message: "Character must have a selected race",
    },
    {
      name: "hasClass",
      validate: (char: Partial<Character>) =>
        typeof char.class === "string" && char.class.length > 0,
      message: "Character must have a selected class",
    },
  ],
};

