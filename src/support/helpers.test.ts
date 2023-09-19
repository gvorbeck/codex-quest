// import { getClassType, isStandardRace, getDisabledClasses } from "./helpers";
// import { ClassNamesTwo } from "../data/classes";
// import { RaceNamesTwo } from "../data/races";
// import { Abilities } from "../components/CreateCharacter/CharacterAbilities/definitions";

// // getClassType
// test('returns "standard" for a single standard class', () => {
//   expect(getClassType(ClassNamesTwo.FIGHTER)).toBe("standard");
// });

// test('returns "combination" for a class string with two standard classes', () => {
//   const classString = `${ClassNamesTwo.FIGHTER} ${ClassNamesTwo.MAGICUSER}`;
//   expect(getClassType(classString)).toBe("combination");
// });

// test('returns "custom" for a class string with one standard class and a custom class', () => {
//   const classString = `${ClassNamesTwo.FIGHTER} Foo`;
//   expect(getClassType(classString)).toBe("custom");
// });

// test('returns "custom" for a class string with a completely custom class', () => {
//   expect(getClassType("Foo")).toBe("custom");
// });

// // isStandardRace
// test('returns "true" for a standard Race', () => {
//   expect(isStandardRace(RaceNamesTwo.DWARF)).toBe(true);
// });

// test('returns "false" for a non-standard Race', () => {
//   expect(isStandardRace("Foo Bar")).toBe(false);
// });

// // getDisabledClasses
// const abilities = {
//   scores: {
//     strength: 9,
//     intelligence: 9,
//     wisdom: 9,
//     constitution: 9,
//     dexterity: 9,
//     charisma: 9,
//   },
//   modifiers: {
//     strength: "+0",
//     intelligence: "+0",
//     wisdom: "+0",
//     constitution: "+0",
//     dexterity: "+0",
//     charisma: "+0",
//   },
// };
// test(`returns "['Illusionist']"`, () => {
//   expect(
//     getDisabledClasses(RaceNamesTwo.HUMAN, abilities as Abilities)
//   ).toEqual(["Illusionist"]);
// });

// test(`returns "['Assassin', 'Barbarian', 'Illusionist', 'Magic-User']"`, () => {
//   expect(
//     getDisabledClasses(RaceNamesTwo.HALFLING, abilities as Abilities)
//   ).toEqual(["Assassin", "Barbarian", "Illusionist", "Magic-User"]);
// });

// test(`returns correct Classes`, () => {
//   expect(getDisabledClasses(RaceNamesTwo.ELF, abilities as Abilities)).toEqual([
//     "Assassin",
//     "Barbarian",
//     "Illusionist",
//   ]);
// });
