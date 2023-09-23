import { gnome } from "./gnome";
import { dwarf } from "./dwarf";
import { elf } from "./elf";
import { halfling } from "./halfling";
import { human } from "./human";
import { RaceSetup } from "./definitions";
import { halfElf } from "./halfElf";
import { halfOgre } from "./halfOgre";
import { halfOrc } from "./halfOrc";
import { RaceNames } from "../definitions";
import { bisren } from "./bisren";

const customPlaceholder = {
  name: "Custom",
  allowedStandardClasses: [],
};

export const races: { [key in RaceNames]: RaceSetup } = {
  [RaceNames.DWARF]: dwarf,
  [RaceNames.ELF]: elf,
  [RaceNames.GNOME]: gnome,
  [RaceNames.HALFLING]: halfling,
  [RaceNames.HUMAN]: human,
  [RaceNames.CUSTOM]: customPlaceholder,
  [RaceNames.HALFELF]: halfElf,
  [RaceNames.HALFOGRE]: halfOgre,
  [RaceNames.HALFORC]: halfOrc,
  [RaceNames.BISREN]: bisren,
};
