import { describe, it, expect } from "vitest";
import { getClassType, isStandardClass } from "./classSupport";

describe("isStandardClass", () => {
  it("returns true for standard classes", () => {
    expect(isStandardClass(["Cleric"])).toBe(true);
  });
  it("returns false for non-standard classes", () => {
    expect(isStandardClass(["claric"])).toBe(false);
  });
  it("returns false for empty classes", () => {
    expect(isStandardClass([""])).toBe(false);
  });
});

describe("getClassType", () => {
  it("returns 'none' for empty classes", () => {
    expect(getClassType([""])).toStrictEqual(["none"]);
  });
  it("returns 'standard' for standard classes", () => {
    expect(getClassType(["Cleric"])).toStrictEqual(["standard", "base"]);
  });
  it("returns 'combination' for a combination of standard classes", () => {
    expect(getClassType(["Cleric", "Fighter"])).toStrictEqual([
      "combination",
      "base",
    ]);
  });
  it("returns 'combination' for a combination of standard and custom classes", () => {
    expect(getClassType(["Cleric", "Fighter", "Custo"])).toStrictEqual([
      "custom",
    ]);
  });
  it("returns 'custom' for custom classes", () => {
    expect(getClassType(["Sylas"])).toStrictEqual(["custom"]);
  });
  it("returns 'custom' for a combination of custom classes", () => {
    expect(getClassType(["Custom1", "Custom2"])).toStrictEqual(["custom"]);
  });
  it("returns 'combination' for a combination of standard and custom classes", () => {
    expect(getClassType(["Cleric", "Custom"])).toStrictEqual([
      "combination",
      "supplemental",
    ]);
  });
  it("returns 'custom' for a combination of standard, custom, and empty classes", () => {
    expect(getClassType(["Wuntuunt"])).toStrictEqual(["custom"]);
  });
  it("returns 'custom' for a combination of custom and empty classes", () => {
    expect(getClassType(["Risco"])).toStrictEqual(["custom"]);
  });
  it("returns 'custom' for a combination of empty classes", () => {
    expect(getClassType([""])).toStrictEqual(["none"]);
  });
  it("returns 'custom' for a combination of empty classes", () => {
    expect(getClassType([])).toStrictEqual(["none"]);
  });
});
