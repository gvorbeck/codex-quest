import { ClassNames, RaceNames } from "../data/definitions";
import {
  getClassType,
  getDisabledClasses,
  getHitPointsModifier,
  getSavingThrows,
  getSavingThrowsWeight,
  getSpecialAbilityRaceOverrides,
  isStandardRace,
  useDebounce,
} from "./helpers";
import React, { useState, useEffect } from "react";
import { renderHook } from "@testing-library/react";

describe("getClassType", () => {
  test('should return "none" if characterClass is an empty array', () => {
    expect(getClassType([])).toBe("none");
  });

  test('should return "none" if characterClass is an array with an empty string', () => {
    expect(getClassType([""])).toBe("none");
  });

  test('should return "combination" if characterClass is an array with more than one element of documented classes', () => {
    expect(getClassType(["Fighter", "Magic-User"])).toBe("combination");
  });

  test('should return "custom" if characterClass is an array with at least one element of undocumented classes', () => {
    expect(getClassType(["Fighter", "Poodle"])).toBe("custom");
  });

  test('should return "combination" if characterClass is a string with a space, and each piece is a documented class', () => {
    expect(getClassType(["Fighter Magic-User"])).toBe("combination");
  });

  test('should return "custom" if characterClass is a string with a space, and any piece is not a documented class', () => {
    expect(getClassType(["Fighter Garrett"])).toBe("custom");
  });

  test('should return "standard" if characterClass is a string that is a documented class', () => {
    expect(getClassType(["Fighter"])).toBe("standard");
  });

  test('should return "custom" if characterClass is a string that is not a documented class', () => {
    expect(getClassType(["foo"])).toBe("custom");
  });
});

describe("isStandardRace", () => {
  test('should return "true" if a characterRace is a string that is a documented class', () => {
    expect(isStandardRace("Human")).toBe(true);
  });

  test('should return "false" if a characterRace is a string that is not a documented class', () => {
    expect(isStandardRace("Banana")).toBe(false);
  });
});

describe("getDisabledClasses", () => {
  // This test will break any time a new class is added, so... maybe not the best test.
  test("should return a list of disabled classNames based on character race and ability scores", () => {
    expect(
      getDisabledClasses(RaceNames.DWARF, {
        scores: {
          strength: 9,
          intelligence: 9,
          wisdom: 6,
          constitution: 11,
          dexterity: 11,
          charisma: 8,
        },
        modifiers: {
          strength: "+0",
          intelligence: "+0",
          wisdom: "-1",
          constitution: "+0",
          dexterity: "+0",
          charisma: "-1",
        },
      })
    ).toEqual([
      "Assassin",
      "Cleric",
      "Druid",
      "Illusionist",
      "Magic-User",
      "Necromancer",
      "Ranger",
      "Paladin",
      "Scout",
      "Spellcrafter",
    ]);
  });
});

describe("getSavingThrows", () => {
  test("should return a list of saving throws based on character class and level", () => {
    expect(getSavingThrows(ClassNames.FIGHTER, 1)).toEqual({
      deathRayOrPoison: 12,
      dragonBreath: 15,
      magicWands: 13,
      paralysisOrPetrify: 14,
      spells: 17,
    });
  });
});

describe("getSavingThrowsWeight", () => {
  test("should return a number, or weight, of all the saving throw values for a class at a certain level", () => {
    expect(getSavingThrowsWeight(getSavingThrows(ClassNames.FIGHTER, 1))).toBe(
      71
    );
  });
});

// jest.mock("react", () => ({
//   useState: jest.fn(),
//   useEffect: jest.fn(),
// }));

// it("should debounce the value", async () => {
//   const { result } = renderHook(() => {
//     const debouncedValue = useDebounce("initial value", 100);

//     return debouncedValue;
//   });

//   // Wait for the delay to pass.
//   await new Promise((resolve) => setTimeout(resolve, 100));

//   // Assert that the debouncedValue state is set correctly.
//   expect(result.current).toBe("initial value");
// });

describe("getHitPointsModifier", () => {
  test("should return an appropriate modifier given an array of one standard class name", () => {
    expect(getHitPointsModifier([ClassNames.FIGHTER])).toBe(2);
  });

  test("should return an appropriate modifier given an array of multiple standard class name", () => {
    expect(
      getHitPointsModifier([ClassNames.FIGHTER, ClassNames.MAGICUSER])
    ).toBe(2);
  });

  test("should return a '0' modifier given an array of non-standard class name", () => {
    expect(getHitPointsModifier(["foo"])).toBe(0);
  });

  test("should return a '0' modifier given an empty array", () => {
    expect(getHitPointsModifier([])).toBe(0);
  });
});

describe("getSpecialAbilityRaceOverrides", () => {
  test("should provide the overrides for a race that has them", () => {
    expect(getSpecialAbilityRaceOverrides(RaceNames.BISREN)).toEqual([
      [
        "Thief",
        {
          "Move Silently": "ADD 20% to this roll if IN DOORS/URBAN SETTING",
          "Open Locks": "ADD 10% to this roll",
          "Pick Pockets": "ADD 10% to this roll",
          "Remove Traps":
            "ADD 10% to this roll IF INDOORS, DEDUCT 20% IF OUTDOORS",
        },
      ],
    ]);
  });
});
