import { describe, it, expect } from "vitest";
import {
  classSplit,
  getClassSelectOptions,
  getClassType,
  isStandardClass,
} from "./classSupport";
import { CharData } from "@/data/definitions";

describe("isStandardClass", () => {
  it("returns true for standard classes", () => {
    expect(isStandardClass("Cleric")).toBe(true);
  });
  it("returns false for non-standard classes", () => {
    expect(isStandardClass("claric")).toBe(false);
  });
  it("returns false for empty classes", () => {
    expect(isStandardClass("")).toBe(false);
  });
});

describe("classSplit", () => {
  it("splits a string into an array", () => {
    expect(classSplit("Cleric")).toEqual(["Cleric"]);
  });
  it("splits a complex string into an array", () => {
    expect(classSplit("Cleric Fighter")).toEqual(["Cleric", "Fighter"]);
  });
  it("returns an array unchanged", () => {
    expect(classSplit(["Cleric"])).toEqual(["Cleric"]);
  });
});

describe("getClassType", () => {
  it("returns 'none' for empty classes", () => {
    expect(getClassType("")).toBe("none");
  });
  it("returns 'standard' for standard classes", () => {
    expect(getClassType("Cleric")).toBe("standard");
  });
  it("returns 'combination' for a combination of standard classes", () => {
    expect(getClassType("Cleric Fighter")).toBe("combination");
  });
  it("returns 'combination' for a combination of standard and custom classes", () => {
    expect(getClassType("Cleric Fighter Custom")).toBe("combination");
  });
  it("returns 'custom' for custom classes", () => {
    expect(getClassType("Sylas")).toBe("custom");
  });
  it("returns 'custom' for a combination of custom classes", () => {
    expect(getClassType("Custom1 Custom2")).toBe("custom");
  });
  it("returns 'combination' for a combination of standard and custom classes", () => {
    expect(getClassType("Cleric Custom")).toBe("combination");
  });
  it("returns 'custom' for a combination of standard, custom, and empty classes", () => {
    expect(getClassType("Wuntuunt")).toBe("custom");
  });
  it("returns 'custom' for a combination of custom and empty classes", () => {
    expect(getClassType("Risco")).toBe("custom");
  });
  it("returns 'custom' for a combination of empty classes", () => {
    expect(getClassType("")).toBe("none");
  });
  it("returns 'custom' for a combination of empty classes", () => {
    expect(getClassType([])).toBe("none");
  });
});

describe("getClassSelectOptions", () => {
  it("returns the correct list of classes", () => {
    const character = {
      race: "Elf",
      abilities: {
        scores: {
          strength: 12,
          dexterity: 12,
          constitution: 12,
          intelligence: 12,
          wisdom: 12,
          charisma: 12,
        },
      },
    } as unknown as CharData;
    expect(getClassSelectOptions(character)).toEqual([
      { label: "Cleric", value: "Cleric" },
      { label: "Fighter", value: "Fighter" },
      { label: "Magic-User", value: "Magic-User" },
      { label: "Thief", value: "Thief" },
    ]);
  });
  it("returns the correct list of classes", () => {
    const character = {
      race: "Dwarf",
      abilities: {
        scores: {
          strength: 12,
          dexterity: 12,
          constitution: 12,
          intelligence: 12,
          wisdom: 12,
          charisma: 12,
        },
      },
    } as unknown as CharData;
    expect(getClassSelectOptions(character)).toEqual([
      { label: "Cleric", value: "Cleric" },
      { label: "Fighter", value: "Fighter" },
      { label: "Thief", value: "Thief" },
    ]);
  });
});

describe("getEnabledClasses", () => {
  it("returns the correct list of classes", () => {
    const character = {
      race: "Elf",
      abilities: {
        scores: {
          strength: 6,
          dexterity: 12,
          constitution: 12,
          intelligence: 12,
          wisdom: 12,
          charisma: 12,
        },
      },
    } as unknown as CharData;
    expect(getClassSelectOptions(character)).toEqual([
      { label: "Cleric", value: "Cleric" },
      { label: "Magic-User", value: "Magic-User" },
      { label: "Thief", value: "Thief" },
    ]);
  });
  it("returns the correct list of classes", () => {
    const character = {
      race: "Dwarf",
      abilities: {
        scores: {
          strength: 12,
          dexterity: 6,
          constitution: 6,
          intelligence: 6,
          wisdom: 12,
          charisma: 12,
        },
      },
    } as unknown as CharData;
    expect(getClassSelectOptions(character)).toEqual([
      { label: "Cleric", value: "Cleric" },
      { label: "Fighter", value: "Fighter" },
    ]);
  });
});
