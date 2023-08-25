import { getClassType } from "./helpers";
import { ClassNamesTwo } from "../data/classes";

test('returns "standard" for a single standard class', () => {
  expect(getClassType(ClassNamesTwo.FIGHTER)).toBe("standard");
});

test('returns "combination" for a class string with two standard classes', () => {
  const classString = `${ClassNamesTwo.FIGHTER} ${ClassNamesTwo.MAGICUSER}`;
  expect(getClassType(classString)).toBe("combination");
});

test('returns "custom" for a class string with one standard class and a custom class', () => {
  const classString = `${ClassNamesTwo.FIGHTER} Foo`;
  expect(getClassType(classString)).toBe("custom");
});

test('returns "custom" for a class string with a completely custom class', () => {
  expect(getClassType("Foo")).toBe("custom");
});
