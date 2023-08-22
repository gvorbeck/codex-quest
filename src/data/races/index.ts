import { gnome } from "./gnome";
import { dwarf } from "./dwarf";
import { elf } from "./elf";
import { halfling } from "./halfling";
import { human } from "./human";
import { RaceSetup } from "./definitions";

export enum RaceNamesTwo {
  DWARF = "Dwarf",
  ELF = "Elf",
  GNOME = "Gnome",
  HALFLING = "Halfling",
  HUMAN = "Human",
  CUSTOM = "Custom",
  // ... other races
}

type Races = {
  [key in RaceNamesTwo]: RaceSetup;
};

const customPlaceholder = {
  name: "Custom",
  allowedStandardClasses: [],
};

export const races: Races = {
  [RaceNamesTwo.DWARF]: dwarf,
  [RaceNamesTwo.ELF]: elf,
  [RaceNamesTwo.GNOME]: gnome,
  [RaceNamesTwo.HALFLING]: halfling,
  [RaceNamesTwo.HUMAN]: human,
  [RaceNamesTwo.CUSTOM]: customPlaceholder,
  // ... other races
};
