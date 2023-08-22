import { gnome } from "./gnome";
import { RaceSetup } from "./definitions";

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

const customPlaceholder = {
  name: "",
  allowedStandardClasses: [],
};

export const races: Races = {
  // [RaceNamesTwo.DWARF]: dwarf, // assuming you have a dwarf object
  // [RaceNamesTwo.ELF]: elf, // assuming you have an elf object
  [RaceNamesTwo.GNOME]: gnome,
  [RaceNamesTwo.CUSTOM]: customPlaceholder,
  // ... other races
};
