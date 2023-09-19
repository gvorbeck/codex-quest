import { DiceTypes } from "../definitions";
import { ClassNames } from "../definitions";
import { RaceSetup } from "./definitions";

export const elf: RaceSetup = {
  name: "Elf",
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
  maximumHitDice: DiceTypes.D6,
  savingThrows: {
    magicWands: 2,
    paralysisOrPetrify: 1,
    spells: 2,
  },
  details: {
    description:
      "Elves are a slender race, with both males and females standing around five feet tall and weighing around 130 pounds. Most have dark hair, with little or no body or facial hair. They have pointed ears and delicate features. Elves are lithe and graceful. They have keen eyesight and hearing. Elves are typically inquisitive, passionate, self-assured, and sometimes haughty. Their typical lifespan is a dozen centuries or more.\n\n**Restrictions**: Elves may become Clerics, Fighters, Magic-Users or Thieves; they are also allowed to combine the classes of Fighter and Magic-User, and of Magic-User and Thief. They are required to have a minimum Intelligence of 9. Due to their generally delicate nature, they may not have a Constitution higher than 17. Elves never roll larger than six-sided dice (d6) for hit points.\n\n**Special Abilities**: All Elves have Darkvision with a 60' range. They are able to find secret doors more often than normal (1-2 on 1d6 rather than the usual 1 on 1d6). An Elf is so observant that one has a 1 on 1d6 chance to find a secret door with a cursory look. Elves are immune to the paralyzing attack of ghouls. Also, they are less likely to be surprised in combat, reducing the chance of surprise by 1 in 1d6.\n\n**Saving Throws**: Elves save at +1 vs. Paralysis or Petrify, and +2 vs. Magic Wands and Spells.",
    specials: [
      "All **Elves** have Darkvision with a 60' range.",
      "**Elves** are able to find secret doors more often than normal (1-2 on 1d6 rather than the usual 1 on 1d6.",
      "An **Elf** is so observant that one has a 1 on 1d6 chance to find a secret door with a cursory look.",
      "**Elves** are immune to the paralyzing attack of ghouls.",
      "**Elves** are less likely to be surprised in combat, reducing the chance of surprise by 1 in 1d6.",
    ],
    restrictions: [],
  },
};
