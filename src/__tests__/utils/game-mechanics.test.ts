import { describe, it, expect, vi, beforeEach } from "vitest";
import { roller, GAME_MECHANICS, DICE_LIMITS } from "@/utils/mechanics";
import {
  cascadeValidateCharacter,
  hasValidAbilityScores,
  isRaceEligible,
  canCastSpells,
  getCharacterSpellSystemType,
  calculateHitDie,
} from "@/utils";
import { createEmptyCharacter } from "@/utils";
import type { Character, Race } from "@/types";

describe("Game Mechanics Tests", () => {
  describe("Dice Rolling Mechanics", () => {
    it("handles standard dice notation correctly", () => {
      // Mock Math.random for predictable results
      const mockRandom = vi.spyOn(Math, "random");
      mockRandom.mockReturnValue(0.5); // Always roll middle value

      const result = roller("3d6");

      expect(result).toEqual(
        expect.objectContaining({
          formula: "3d6",
          total: expect.any(Number),
          rolls: expect.arrayContaining([expect.any(Number)]),
          breakdown: expect.any(String),
        })
      );

      expect(result.rolls).toHaveLength(3);
      expect(result.total).toBeGreaterThanOrEqual(3);
      expect(result.total).toBeLessThanOrEqual(18);

      mockRandom.mockRestore();
    });

    it("handles dice notation with modifiers", () => {
      const mockRandom = vi.spyOn(Math, "random");
      mockRandom.mockReturnValue(0.5);

      const result = roller("1d20+5");

      expect(result.total).toBeGreaterThanOrEqual(6); // 1 + 5
      expect(result.total).toBeLessThanOrEqual(25); // 20 + 5
      expect(result.formula).toBe("1d20+5");

      mockRandom.mockRestore();
    });

    it("handles complex dice expressions", () => {
      const mockRandom = vi.spyOn(Math, "random");
      mockRandom.mockReturnValue(0.5);

      const result = roller("2d8+1d4+2");

      expect(result.total).toBeGreaterThanOrEqual(5); // 2 + 1 + 2
      expect(result.total).toBeLessThanOrEqual(22); // 16 + 4 + 2
      expect(result.formula).toBe("2d8+1d4+2");

      mockRandom.mockRestore();
    });

    it("respects dice limits", () => {
      expect(DICE_LIMITS.MAX_DICE_COUNT).toBe(100);
      expect(DICE_LIMITS.MIN_DICE_SIDES).toBe(1);

      // Test that invalid dice expressions are handled
      expect(() => roller("101d6")).toThrow();
      expect(() => roller("1d0")).toThrow();
    });
  });

  describe("Character Validation Mechanics", () => {
    let testCharacter: Character;

    beforeEach(() => {
      testCharacter = {
        ...createEmptyCharacter(),
        abilities: {
          strength: { value: 15, modifier: 1 },
          dexterity: { value: 13, modifier: 1 },
          constitution: { value: 14, modifier: 1 },
          intelligence: { value: 12, modifier: 0 },
          wisdom: { value: 10, modifier: 0 },
          charisma: { value: 8, modifier: -1 },
        },
      };
    });

    it("validates ability scores within legal ranges", () => {
      expect(hasValidAbilityScores(testCharacter)).toBe(true);

      // Test invalid high scores
      const invalidHighCharacter = {
        ...testCharacter,
        abilities: {
          ...testCharacter.abilities,
          strength: { value: 25, modifier: 7 },
        },
      };
      expect(hasValidAbilityScores(invalidHighCharacter)).toBe(false);

      // Test invalid low scores
      const invalidLowCharacter = {
        ...testCharacter,
        abilities: {
          ...testCharacter.abilities,
          strength: { value: 1, modifier: -4 },
        },
      };
      expect(hasValidAbilityScores(invalidLowCharacter)).toBe(false);
    });

    it("validates race eligibility based on ability requirements", () => {
      const elfRace: Race = {
        id: "elf",
        name: "Elf",
        description: "Graceful and magical",
        physicalDescription: "Tall and slender",
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

      expect(isRaceEligible(testCharacter, elfRace)).toBe(true);

      // Test with character that doesn't meet requirements
      const lowIntCharacter = {
        ...testCharacter,
        abilities: {
          ...testCharacter.abilities,
          intelligence: { value: 8, modifier: -1 },
        },
      };
      expect(isRaceEligible(lowIntCharacter, elfRace)).toBe(false);
    });

    it("performs cascade validation when race changes", () => {
      const character: Character = {
        ...testCharacter,
        race: "elf",
        class: ["fighter", "magic-user"], // Multi-class elf
        spells: [
          {
            name: "Magic Missile",
            level: {
              "magic-user": 1,
              cleric: null,
              druid: null,
              paladin: null,
              spellcrafter: null,
              illusionist: null,
              necromancer: null,
            },
            range: "150'",
            duration: "instantaneous",
            description: "Test spell",
          },
        ],
      };

      const humanRace: Race = {
        id: "human",
        name: "Human",
        description: "Versatile and adaptable",
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

      // Humans can't multi-class, so class should be cleared
      expect(result.class).toEqual([]);
      expect(result.spells).toEqual([]);
    });
  });

  describe("Spellcasting System Mechanics", () => {
    it("correctly identifies spellcasting classes", () => {
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

      const multiClass: Character = {
        ...createEmptyCharacter(),
        class: ["fighter", "magic-user"],
      };
      expect(canCastSpells(multiClass)).toBe(true);
    });

    it("determines correct spell system types", () => {
      const magicUser: Character = { ...createEmptyCharacter(), class: ["magic-user"] };
      const illusionist: Character = { ...createEmptyCharacter(), class: ["illusionist"] };
      const cleric: Character = { ...createEmptyCharacter(), class: ["cleric"] };
      const fighter: Character = { ...createEmptyCharacter(), class: ["fighter"] };

      expect(getCharacterSpellSystemType(magicUser)).toBe("magic-user");
      expect(getCharacterSpellSystemType(illusionist)).toBe("magic-user");
      expect(getCharacterSpellSystemType(cleric)).toBe("cleric");
      expect(getCharacterSpellSystemType(fighter)).toBe("none");
    });
  });

  describe("Hit Die and Level Mechanics", () => {
    it("calculates correct hit dice for different classes", () => {
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

      const cleric: Character = {
        ...createEmptyCharacter(),
        class: ["cleric"],
        race: "human",
      };
      expect(calculateHitDie(cleric)).toBe("1d6");

      const thief: Character = {
        ...createEmptyCharacter(),
        class: ["thief"],
        race: "human",
      };
      expect(calculateHitDie(thief)).toBe("1d4");
    });

    it("handles multi-class hit dice correctly", () => {
      const multiClass: Character = {
        ...createEmptyCharacter(),
        class: ["fighter", "magic-user"],
        race: "elf", // Elves can multi-class
      };

      // Elves have hit dice restriction to d6 max, so even fighter/magic-user gets d6
      expect(calculateHitDie(multiClass)).toBe("1d6");
    });

    it("returns null for characters without classes", () => {
      const noClass: Character = {
        ...createEmptyCharacter(),
        class: [],
      };
      expect(calculateHitDie(noClass)).toBe(null);
    });
  });

  describe("Game Constants and Mechanics", () => {
    it("has correct BFRPG ability modifier thresholds", () => {
      const modifiers = GAME_MECHANICS.ABILITY_MODIFIERS;

      expect(modifiers).toEqual([
        { max: 3, modifier: -3 },
        { max: 5, modifier: -2 },
        { max: 8, modifier: -1 },
        { max: 12, modifier: 0 },
        { max: 15, modifier: 1 },
        { max: 17, modifier: 2 },
      ]);

      expect(GAME_MECHANICS.DEFAULT_HIGH_MODIFIER).toBe(3);
    });

    it("has correct armor class defaults", () => {
      expect(GAME_MECHANICS.DEFAULT_UNARMORED_AC).toBe(11);
    });

    it("has correct movement rates", () => {
      expect(GAME_MECHANICS.DEFAULT_MOVEMENT_RATE).toBe("40'");
      expect(GAME_MECHANICS.LEATHER_ARMOR_MOVEMENT).toBe("30'");
      expect(GAME_MECHANICS.METAL_ARMOR_MOVEMENT).toBe("20'");
    });

    it("has correct starting gold mechanics", () => {
      expect(GAME_MECHANICS.STARTING_GOLD_DICE).toBe("3d6");
      expect(GAME_MECHANICS.STARTING_GOLD_MULTIPLIER).toBe(10);
    });
  });

  describe("Advanced Validation Scenarios", () => {
    it("handles custom classes and races", () => {
      const customCharacter: Character = {
        ...createEmptyCharacter(),
        race: "custom-dragonborn",
        class: ["custom-paladin"],
      };

      // Custom classes should be treated as non-spellcasting by default
      expect(canCastSpells(customCharacter)).toBe(false);
      expect(getCharacterSpellSystemType(customCharacter)).toBe("custom");
    });

    it("validates complex multi-class scenarios", () => {
      const complexMultiClass: Character = {
        ...createEmptyCharacter(),
        race: "elf",
        class: ["fighter", "magic-user", "thief"], // Triple class
        abilities: {
          strength: { value: 15, modifier: 1 },
          dexterity: { value: 16, modifier: 2 },
          constitution: { value: 14, modifier: 1 },
          intelligence: { value: 16, modifier: 2 },
          wisdom: { value: 12, modifier: 0 },
          charisma: { value: 10, modifier: 0 },
        },
      };

      expect(canCastSpells(complexMultiClass)).toBe(true);
      expect(hasValidAbilityScores(complexMultiClass)).toBe(true);
    });
  });
});