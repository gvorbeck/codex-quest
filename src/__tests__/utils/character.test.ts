import { describe, it, expect } from "vitest";
import {
  calculateModifier,
  formatModifier,
  calculateArmorClass,
  calculateMovementRate,
  createEmptyCharacter,
  isCustomClass,
  isCustomRace,
  canCastSpells,
  calculateHitDie,
  isRaceEligible,
  cascadeValidateCharacter,
  hasValidAbilityScores,
  GAME_MECHANICS,
} from "@/utils";
import type { Character, Race, Equipment } from "@/types";

describe("Character Utilities", () => {
  describe("Ability Score Calculations", () => {
    it("calculates ability modifiers correctly", () => {
      expect(calculateModifier(3)).toBe(-3);
      expect(calculateModifier(8)).toBe(-1);
      expect(calculateModifier(10)).toBe(0);
      expect(calculateModifier(12)).toBe(0);
      expect(calculateModifier(15)).toBe(1);
      expect(calculateModifier(17)).toBe(2);
      expect(calculateModifier(18)).toBe(3);
    });

    it("formats modifiers with correct signs", () => {
      expect(formatModifier(3)).toBe("+3");
      expect(formatModifier(1)).toBe("+1");
      expect(formatModifier(0)).toBe("+0");
      expect(formatModifier(-1)).toBe("-1");
      expect(formatModifier(-3)).toBe("-3");
    });
  });

  describe("Armor Class Calculations", () => {
    it("returns default AC for character with no equipment", () => {
      const character = { equipment: [] };
      expect(calculateArmorClass(character)).toBe(
        GAME_MECHANICS.DEFAULT_UNARMORED_AC
      );
    });

    it("calculates AC with worn armor", () => {
      const character = {
        equipment: [
          {
            name: "Chain Mail",
            AC: 15,
            wearing: true,
            category: "armor",
          } as Equipment,
        ],
      };
      expect(calculateArmorClass(character)).toBe(15);
    });

    it("adds shield bonus to armor AC", () => {
      const character = {
        equipment: [
          {
            name: "Leather Armor",
            AC: 12,
            wearing: true,
            category: "armor",
          } as Equipment,
          {
            name: "Shield",
            AC: "+1",
            wearing: true,
            category: "shield",
          } as Equipment,
        ],
      };
      expect(calculateArmorClass(character)).toBe(13);
    });

    it("ignores non-worn equipment", () => {
      const character = {
        equipment: [
          {
            name: "Chain Mail",
            AC: 15,
            wearing: false,
            category: "armor",
          } as Equipment,
        ],
      };
      expect(calculateArmorClass(character)).toBe(
        GAME_MECHANICS.DEFAULT_UNARMORED_AC
      );
    });
  });

  describe("Movement Rate Calculations", () => {
    it("returns default movement for unarmored character", () => {
      const character = createEmptyCharacter();
      expect(calculateMovementRate(character)).toBe(
        GAME_MECHANICS.DEFAULT_MOVEMENT_RATE
      );
    });

    it("reduces movement for leather armor", () => {
      const character = {
        ...createEmptyCharacter(),
        equipment: [
          {
            name: "Leather Armor",
            AC: 12,
            wearing: true,
            category: "armor",
          } as Equipment,
        ],
      };
      expect(calculateMovementRate(character)).toBe(
        GAME_MECHANICS.LEATHER_ARMOR_MOVEMENT
      );
    });

    it("reduces movement for metal armor", () => {
      const character = {
        ...createEmptyCharacter(),
        equipment: [
          {
            name: "Chain Mail",
            AC: 15,
            wearing: true,
            category: "armor",
          } as Equipment,
        ],
      };
      expect(calculateMovementRate(character)).toBe(
        GAME_MECHANICS.METAL_ARMOR_MOVEMENT
      );
    });
  });

  describe("Character Creation", () => {
    it("creates empty character with default values", () => {
      const character = createEmptyCharacter();

      expect(character.name).toBe("");
      expect(character.race).toBe("");
      expect(character.class).toEqual([]);
      expect(character.level).toBe(1);
      expect(character.xp).toBe(0);
      expect(character.equipment).toEqual([]);
      expect(character.currency.gold).toBe(0);
      expect(character.hp.current).toBe(0);
      expect(character.hp.max).toBe(0);

      // Check all ability scores are initialized
      Object.values(character.abilities).forEach((ability) => {
        expect(ability.value).toBe(0);
        expect(ability.modifier).toBe(0);
      });
    });
  });

  describe("Class and Race Detection", () => {
    it("detects custom classes correctly", () => {
      expect(isCustomClass("fighter")).toBe(false);
      expect(isCustomClass("magic-user")).toBe(false);
      expect(isCustomClass("custom-paladin")).toBe(true);
      expect(isCustomClass("non-existent-class")).toBe(true);
    });

    it("detects custom races correctly", () => {
      expect(isCustomRace("human")).toBe(false);
      expect(isCustomRace("elf")).toBe(false);
      expect(isCustomRace("custom-dragonkin")).toBe(true);
      expect(isCustomRace("non-existent-race")).toBe(true);
    });
  });

  describe("Spellcasting Detection", () => {
    it("detects spellcasting characters", () => {
      const magicUser: Character = {
        ...createEmptyCharacter(),
        class: ["magic-user"],
      };
      expect(canCastSpells(magicUser)).toBe(true);

      const cleric: Character = {
        ...createEmptyCharacter(),
        class: ["cleric"],
      };
      expect(canCastSpells(cleric)).toBe(true);

      const fighter: Character = {
        ...createEmptyCharacter(),
        class: ["fighter"],
      };
      expect(canCastSpells(fighter)).toBe(false);
    });
  });

  describe("Hit Die Calculations", () => {
    it("returns hit die for standard classes", () => {
      const fighter: Character = {
        ...createEmptyCharacter(),
        class: ["fighter"],
        race: "human",
      };
      expect(calculateHitDie(fighter)).toBe("1d8");

      const magicUser: Character = {
        ...createEmptyCharacter(),
        class: ["magic-user"],
        race: "human",
      };
      expect(calculateHitDie(magicUser)).toBe("1d4");
    });

    it("returns null for character with no class", () => {
      const character = createEmptyCharacter();
      expect(calculateHitDie(character)).toBe(null);
    });
  });

  describe("Race Eligibility", () => {
    it("validates race requirements", () => {
      const character: Character = {
        ...createEmptyCharacter(),
        abilities: {
          strength: { value: 15, modifier: 1 },
          dexterity: { value: 13, modifier: 1 },
          constitution: { value: 12, modifier: 0 },
          intelligence: { value: 10, modifier: 0 },
          wisdom: { value: 11, modifier: 0 },
          charisma: { value: 14, modifier: 1 },
        },
      };

      const elfRace: Race = {
        id: "elf",
        name: "Elf",
        description: "Test elf",
        physicalDescription: "Tall and graceful",
        allowedClasses: ["fighter", "magic-user", "thief"],
        abilityRequirements: [{ ability: "intelligence", min: 9 }],
        specialAbilities: [],
        savingThrows: [],
        lifespan: "Immortal",
        languages: ["Common", "Elvish"],
        carryingCapacity: {
          light: 60,
          heavy: 150,
          strengthModifier: { positive: 0.1, negative: 0.2 },
        },
      };

      expect(isRaceEligible(character, elfRace)).toBe(true);

      // Test with character that doesn't meet requirements
      const lowIntCharacter: Character = {
        ...character,
        abilities: {
          ...character.abilities,
          intelligence: { value: 8, modifier: -1 },
        },
      };

      expect(isRaceEligible(lowIntCharacter, elfRace)).toBe(false);
    });
  });

  describe("Character Validation", () => {
    it("validates ability scores", () => {
      const validCharacter: Character = {
        ...createEmptyCharacter(),
        abilities: {
          strength: { value: 15, modifier: 1 },
          dexterity: { value: 13, modifier: 1 },
          constitution: { value: 12, modifier: 0 },
          intelligence: { value: 10, modifier: 0 },
          wisdom: { value: 11, modifier: 0 },
          charisma: { value: 14, modifier: 1 },
        },
      };
      expect(hasValidAbilityScores(validCharacter)).toBe(true);

      const invalidCharacter: Character = {
        ...validCharacter,
        abilities: {
          ...validCharacter.abilities,
          strength: { value: 25, modifier: 7 }, // Invalid high score
        },
      };
      expect(hasValidAbilityScores(invalidCharacter)).toBe(false);

      const invalidLowCharacter: Character = {
        ...validCharacter,
        abilities: {
          ...validCharacter.abilities,
          strength: { value: 1, modifier: -4 }, // Invalid low score
        },
      };
      expect(hasValidAbilityScores(invalidLowCharacter)).toBe(false);
    });
  });

  describe("Cascade Validation", () => {
    it("clears invalid selections when race changes", () => {
      const character: Character = {
        ...createEmptyCharacter(),
        race: "elf",
        class: ["fighter", "magic-user"],
        spells: [],
      };

      const humanRace: Race = {
        id: "human",
        name: "Human",
        description: "Versatile humans",
        physicalDescription: "Average height and build",
        allowedClasses: ["fighter", "cleric", "magic-user", "thief"],
        abilityRequirements: [],
        specialAbilities: [],
        savingThrows: [],
        lifespan: "70-80 years",
        languages: ["Common"],
        carryingCapacity: {
          light: 60,
          heavy: 150,
          strengthModifier: { positive: 0.1, negative: 0.2 },
        },
      };

      const result = cascadeValidateCharacter(character, humanRace, []);

      // Multi-class should be cleared for humans
      expect(result.class).toEqual([]);
      expect(result.spells).toEqual([]);
    });
  });
});
