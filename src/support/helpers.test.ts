import { CharacterData, ClassNames, RaceNames } from "../data/definitions";
import {
  equipmentItemIsDisabled,
  getArmorClass,
  getClassType,
  getEnabledClasses,
  getHitDice,
  getHitPointsModifier,
  getSavingThrows,
  getSavingThrowsWeight,
  getSpecialAbilityRaceOverrides,
  isStandardRace,
  // useDebounce,
} from "./helpers";
// import React, { useState, useEffect } from "react";
// import { renderHook } from "@testing-library/react";
import equipmentItems from "../data/equipmentItems.json";

let characterData: CharacterData = {
  savingThrows: {
    dragonBreath: 0,
    paralysisOrPetrify: 0,
    magicWands: 0,
    spells: 0,
    deathRayOrPoison: 0,
  },
  desc: [""],
  xp: 0,
  // Commented out for testing purposes
  // wearing: {
  //   armor: "",
  //   shield: "",
  // },
  name: "asd",
  equipment: [
    {
      AC: 15,
      costValue: 80,
      category: "armor",
      name: "Brigandine Armor",
      weight: 30,
      amount: 1,
      costCurrency: "gp",
    },
  ],
  weight: 30,
  hp: {
    points: 8,
    dice: "d8",
    desc: "",
    max: 8,
  },
  race: "Foo",
  restrictions: {
    class: [],
    race: [],
  },
  gold: 0,
  spells: [
    {
      level: {
        paladin: 2,
        "magic-user": null,
        cleric: 2,
        necromancer: null,
        illusionist: null,
        druid: 2,
      },
      description:
        "This spell allows the caster to charm one or more animals, in much the same fashion as charm person, at a rate of 1 hit die per caster level. The caster may decide which individual animals out of a mixed group are to be affected first; excess hit dice of effect are ignored. No saving throw is allowed, either for normal or giant-sized animals, but creatures of more fantastic nature (as determined by the GM) are allowed a save vs. Spells to resist. When the duration expires, the animals will resume normal activity immediately. \n\nThis spell does not grant the caster any special means of communication with the affected animals; if combined with speak with animals, this spell becomes significantly more useful.",
      duration: "level+1d4 rounds",
      range: "60'",
      name: "Charm Animal",
    },
  ],
  avatar: "",
  level: 1,
  specials: {
    class: [],
    race: [],
  },
  class: ["Bar"],
  abilities: {
    modifiers: {
      charisma: "+0",
      constitution: "+0",
      wisdom: "+0",
      strength: "+1",
      intelligence: "+1",
      dexterity: "+0",
    },
    scores: {
      intelligence: 13,
      strength: 13,
      charisma: 12,
      constitution: 10,
      dexterity: 10,
      wisdom: 11,
    },
  },
};

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

describe("getEnabledClasses", () => {
  // This test will break any time a new class is added, so... maybe not the best test.
  test("should return a list of enabled classNames based on character race selection and ability scores", () => {
    expect(
      getEnabledClasses(RaceNames.DWARF, {
        strength: 9,
        intelligence: 9,
        wisdom: 6,
        constitution: 11,
        dexterity: 11,
        charisma: 8,
      })
    ).toEqual([
      ClassNames.BARBARIAN,
      ClassNames.FIGHTER,
      ClassNames.THIEF,
      ClassNames.CUSTOM,
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

describe("getArmorClass", () => {
  test("a normal starting AC", () => {
    expect(getArmorClass(characterData, () => console.log("ignore"))).toBe(11);
  });

  test("a race with a non-normal starting AC", () => {
    characterData.race = RaceNames.CHELONIAN;
    expect(getArmorClass(characterData, () => console.log("ignore"))).toBe(13);
  });

  test("a character with a properly formatted `wearing` property", () => {
    characterData.wearing = {
      armor: "",
      shield: "",
    };
    expect(getArmorClass(characterData, () => console.log("ignore"))).toBe(13);
  });

  test("a 'melee' type", () => {
    expect(
      getArmorClass(characterData, () => console.log("ignore"), "melee")
    ).toBe(13);
  });

  test("a 'missile' type", () => {
    expect(
      getArmorClass(characterData, () => console.log("ignore"), "missile")
    ).toBe(13);
  });
});

describe("equipmentItemIsDisabled", () => {
  const longbow = equipmentItems.filter((item) => item.name === "Longbow")[0];
  test("custom class has nothing disabled", () => {
    expect(equipmentItemIsDisabled(["foo"], RaceNames.HUMAN, longbow)).toBe(
      false
    );
  });

  test("races with `noLargeEquipment`", () => {
    expect(
      equipmentItemIsDisabled([ClassNames.CLERIC], RaceNames.GNOME, longbow)
    ).toBe(true);
  });

  test("classes with `noLargeEquipment`", () => {
    expect(
      equipmentItemIsDisabled([ClassNames.SCOUT], RaceNames.HUMAN, longbow)
    ).toBe(true);
  });

  test("classes with specific items restrictions (`specificEquipmentItems`)", () => {
    expect(
      equipmentItemIsDisabled([ClassNames.CLERIC], RaceNames.HUMAN, longbow)
    ).toBe(true);
  });
});

describe("getHitDice", () => {
  test("hit dice for level one standard class", () => {
    expect(getHitDice(1, [ClassNames.FIGHTER], "d8")).toBe("1d8");
  });

  test("high level hit dice for class with x2 multiplier suffix", () => {
    expect(getHitDice(11, [ClassNames.FIGHTER], "d8")).toBe("9d8+4");
  });

  test("high level hit dice for class with x1 multiplier suffix", () => {
    expect(getHitDice(11, [ClassNames.MAGICUSER], "d4")).toBe("9d4+2");
  });

  test("get hit dice for custom class", () => {
    expect(getHitDice(11, ["foo"], "d8")).toBe("9d8");
  });
});

describe("getAttackBonus", () => {});

describe("getMovement", () => {});
