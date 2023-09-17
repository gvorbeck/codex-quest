import { gnome } from "./gnome";
import { dwarf } from "./dwarf";
import { elf } from "./elf";
import { halfling } from "./halfling";
import { human } from "./human";
import { RaceSetup } from "./definitions";
import { halfElf } from "./halfElf";
import { halfOgre } from "./halfOgre";
import { halfOrc } from "./halfOrc";
import { RaceNamesTwo } from "../definitions";

const customPlaceholder = {
  name: "Custom",
  allowedStandardClasses: [],
};

export const races: { [key in RaceNamesTwo]: RaceSetup } = {
  [RaceNamesTwo.DWARF]: dwarf,
  [RaceNamesTwo.ELF]: elf,
  [RaceNamesTwo.GNOME]: gnome,
  [RaceNamesTwo.HALFLING]: halfling,
  [RaceNamesTwo.HUMAN]: human,
  [RaceNamesTwo.CUSTOM]: customPlaceholder,
  [RaceNamesTwo.HALFELF]: halfElf,
  [RaceNamesTwo.HALFOGRE]: halfOgre,
  [RaceNamesTwo.HALFORC]: halfOrc,
};
