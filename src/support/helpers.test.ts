import { getClassType, isStandardRace } from "./helpers";

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
