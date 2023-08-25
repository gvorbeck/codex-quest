import { gnome } from "./gnome";
import { dwarf } from "./dwarf";
import { elf } from "./elf";
import { halfling } from "./halfling";
import { human } from "./human";
import { RaceSetup } from "./definitions";
import { halfElf } from "./halfElf";
import { halfOgre } from "./halfOgre";
import { halfOrc } from "./halfOrc";

export enum RaceNamesTwo {
  DWARF = "Dwarf",
  ELF = "Elf",
  GNOME = "Gnome",
  HALFLING = "Halfling",
  HUMAN = "Human",
  CUSTOM = "Custom",
  HALFELF = "Half-Elf",
  HALFOGRE = "Half-Ogre",
  HALFORC = "Half-Orc",
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
  [RaceNamesTwo.HALFELF]: halfElf,
  [RaceNamesTwo.HALFOGRE]: halfOgre,
  [RaceNamesTwo.HALFORC]: halfOrc,
  // ... other races
};
