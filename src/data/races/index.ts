import { gnome } from "./gnome";
import { RaceSetup } from "./definitions";

export enum RaceNamesTwo {
  DWARF = "Dwarf",
  ELF = "Elf",
  GNOME = "Gnome",
  HALFLING = "Halfling",
  HUMAN = "Human",
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
  [RaceNamesTwo.DWARF]: customPlaceholder,
  [RaceNamesTwo.ELF]: customPlaceholder,
  [RaceNamesTwo.GNOME]: gnome,
  [RaceNamesTwo.HALFLING]: customPlaceholder,
  [RaceNamesTwo.HUMAN]: customPlaceholder,
  [RaceNamesTwo.CUSTOM]: customPlaceholder,
  // ... other races
};
