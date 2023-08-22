import { ClassNamesTwo } from "../classes";
import { RaceSetup } from "./definitions";

export const dwarf: RaceSetup = {
  name: "Dwarf",
  allowedStandardClasses: [
    ClassNamesTwo.CLERIC,
    ClassNamesTwo.CUSTOM,
    ClassNamesTwo.DRUID,
    ClassNamesTwo.FIGHTER,
    ClassNamesTwo.BARBARIAN,
    ClassNamesTwo.THIEF,
    ClassNamesTwo.ASSASSIN,
  ],
  minimumAbilityRequirements: { constitution: 9 },
  maximumAbilityRequirements: { charisma: 17 },
  savingThrows: {
    deathRayOrPoison: 4,
    magicWands: 4,
    paralysisOrPetrify: 4,
    spells: 4,
    dragonBreath: 3,
  },
  details: {
    description:
      "Dwarves are a short, stocky race; both male and female Dwarves stand around four feet tall and typically weigh around 120 pounds. They take great pride in their beards, sometimes braiding or forking them. Dwarves have stout frames and a strong, muscular build. They are rugged and resilient, with the capacity to endure great hardships. Dwarves are typically practical, stubborn and courageous. They can also be introspective, suspicious and possessive. They have a lifespan of three to four centuries.",
    specials: [
      "All **Dwarves** have Darkvision with a 60' range.",
      "**Dwarves** are able to detect slanting passages, stonework traps, shifting walls and new construction on a roll of 1-2 on 1d6; a search must be performed before this roll may be made.",
    ],
    restrictions: [
      "`**Dwarves** may not employ Large weapons more than four feet in length.",
    ],
  },
};
