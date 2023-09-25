import { ClassNames } from "../definitions";
import { RaceSetup } from "./definitions";

export const faun: RaceSetup = {
  name: "Faun",
  allowedStandardClasses: [...(Object.values(ClassNames) as ClassNames[])],
  minimumAbilityRequirements: { constitution: 9 },
  maximumAbilityRequirements: { charisma: 15 },
  savingThrows: {
    deathRayOrPoison: 4,
    magicWands: 4,
    paralysisOrPetrify: 4,
    spells: 4,
    dragonBreath: 3,
  },
  details: {
    description:
      "(New Races Release 2)\n\nFauns are a fey-related race that resemble a sort of strange cross of goat with that of a small human or elf-like being. Standing only about 4’ to 5’ tall, they have a human-like torso and head, but the legs and feet of a goat. One can find Fauns with other small features reminisce of goats such as small horns or large ears. Fauns share the Halfling love of simple agrarian life, especially with respect to vineyards, as they prize wine (among other brews) above most things in life. Fauns love frivolity and are often quite adept at musical pursuits.\n\n**Restrictions**: Fauns can choose any class. A Faun will typically follow the tenets of nature deities, and Clerics and Druids (if allowed by the GM) can be found equally in their societies. A Faun must have a minimum Constitution score of 9, and is limited to a maximum Charisma score of 15, generally accounted to overly gregarious personalities and lack of inhibitions. Fauns may not wear typical human-style footwear.\n\n**Special Abilities**: Fauns have Darkvision out to 30’. They are resistant to charm-like effects from fey beings, getting a +4 bonus on relevant saves. This includes charms of dryads, nixies, and similar beings (GM’s decision when necessary).\n\n**Saving Throws**: Like Dwarves, Fauns save at +4 vs. Death Ray or Poison, Magic Wands, Paralysis or Petrify, and Spells, and at +3 vs. Dragon Breath.",
    specials: [
      "**Fauns** have Darkvision out to 30’.",
      "**Fauns** are resistant to charm-like effects from fey beings, getting a +4 bonus on relevant saves. This includes charms of dryads, nixies, and similar beings (GM’s decision when necessary).",
    ],
    restrictions: ["**Fauns** may not wear typical human-style footwear."],
  },
};
