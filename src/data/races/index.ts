import { gnome } from "./gnome";
import { RaceSetup } from "./definitions"; // Make sure to import or define RaceSetup

export enum RaceNamesTwo {
  // DWARF = "Dwarf",
  // ELF = "Elf",
  GNOME = "Gnome",
  // HALFLING = "Halfling",
  // HUMAN = "Human",
  CUSTOM = "Custom",
}

type Races = {
  [key in RaceNamesTwo]: RaceSetup;
};

export const races: Races = {
  // [RaceNamesTwo.DWARF]: dwarf, // assuming you have a dwarf object
  // [RaceNamesTwo.ELF]: elf, // assuming you have an elf object
  [RaceNamesTwo.GNOME]: gnome,
  [RaceNamesTwo.CUSTOM]: {},
  // ... other races
};
