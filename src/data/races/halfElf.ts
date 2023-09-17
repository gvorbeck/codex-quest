import { ClassNames } from "../definitions";
import { RaceSetup } from "./definitions";

export const halfElf: RaceSetup = {
  name: "Half-Elf",
  allowedStandardClasses: [
    ClassNames.CLERIC,
    ClassNames.CUSTOM,
    ClassNames.DRUID,
    ClassNames.FIGHTER,
    ClassNames.ILLUSIONIST,
    ClassNames.MAGICUSER,
    ClassNames.SPELLCRAFTER,
    ClassNames.THIEF,
    ClassNames.NECROMANCER,
    ClassNames.RANGER,
    ClassNames.PALADIN,
    ClassNames.SCOUT,
  ],
  allowedCombinationClasses: [
    ClassNames.MAGICUSER,
    ClassNames.THIEF,
    ClassNames.FIGHTER,
  ],
  minimumAbilityRequirements: { intelligence: 9 },
  maximumAbilityRequirements: { constitution: 17 },
  savingThrows: {
    magicWands: 1,
    spells: 1,
  },
  details: {
    description:
      "(Half Humans Release 5)\n\nHalf-elves are the result of crossbreeding between elves and humans. An average half-elf male stands around 5 ft. 6 in. in height, with females averaging an inch shorter. They have pointed ears, but their features tend to favor the human parent a bit more than the elf. Half-elves are well tolerated by humans in most cases, but are often shunned (or at best, ignored) by elven society.\n\n**Restrictions**: Half-elves may become members of any class or combination allowed to elves. They are required to have a minimum Intelligence of 9, and like elves they may not have Constitution scores higher than 17. They do not suffer from the elven hit dice limit.\n\n**Special Abilities**: Half-elves have Darkvision with a 30 foot range. They are able to find secret doors on a 1-2 on 1d6, but do not find secret doors on a cursory examination as elves do. Half-elves gain a bonus of +5% on all earned experience, except if the half-elf is a member of a combination class.\n\n**Saving Throws**: Half-elves save at +1 vs. Magic Wands and Spells.",
    specials: [
      "**Half-elves** have Darkvision with a 30 foot range.",
      "**Half-elves** are able to find secret doors on a 1-2 on 1d6, but do not find secret doors on a cursory examination as elves do.",
      "**Half-elves** gain a bonus of +5% on all earned experience, except if the half-elf is a member of a combination class.",
    ],
    restrictions: [],
  },
};
