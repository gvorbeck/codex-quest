import { DiceTypes } from "../definitions";
import { ClassNames } from "../definitions";
import { RaceSetup } from "./definitions";

export const halfling: RaceSetup = {
  name: "Halfling",
  allowedStandardClasses: [
    ClassNames.CLERIC,
    ClassNames.CUSTOM,
    ClassNames.DRUID,
    ClassNames.FIGHTER,
    ClassNames.THIEF,
    ClassNames.RANGER,
    ClassNames.PALADIN,
    ClassNames.SCOUT,
  ],
  rangedBonus: 1,
  hasLowCapacity: true,
  additionalAttackBonus: "+1",
  minimumAbilityRequirements: { dexterity: 9 },
  maximumAbilityRequirements: { strength: 17 },
  maximumHitDice: DiceTypes.D6,
  noLargeEquipment: true,
  savingThrows: {
    deathRayOrPoison: 4,
    magicWands: 4,
    paralysisOrPetrify: 4,
    spells: 4,
    dragonBreath: 3,
  },
  details: {
    description:
      "Halflings are small, slightly stocky folk who stand around three feet tall and weigh about 60 pounds. They have curly brown hair on their heads and feet, but rarely have facial hair. They are usually fair skinned, often with ruddy cheeks. Halflings are remarkably rugged for their small size. They are dexterous and nimble, capable of moving quietly and remaining very still. They usually go barefoot. Halflings are typically outgoing, unassuming and goodnatured. They live about a hundred years.\n\n**Restrictions**: Halflings may become Clerics, Fighters or Thieves. They are required to have a minimum Dexterity of 9. Due to their small stature, they may not have a Strength higher than 17. Halflings never roll larger than six-sided dice (d6) for hit points regardless of class. Halflings may not use Large weapons, and must wield Medium weapons with both hands.\n\n**Special Abilities**: Halflings are unusually accurate with all sorts of ranged weapons, gaining a +1 attack bonus when employing them. When attacked in melee by creatures larger than man-sized, Halflings gain a +2 bonus to their Armor Class. Halflings are quick-witted, adding +1 to Initiative die rolls. In their preferred forest terrain, they are able to hide very effectively; so long as they remain still there is only a 10% chance they will be detected. Even indoors, in dungeons or in nonpreferred terrain they are able to hide such that there is only a 30% chance of detection. Note that a Halfling Thief will roll only once, using either the Thief ability or the Halfling ability, whichever is better.\n\n**Saving Throws**: Halflings save at +4 vs. Death Ray or Poison, Magic Wands, Paralysis or Petrify, and Spells, and at +3 vs. Dragon Breath.",
    specials: [
      "**Halflings** are unusually accurate with all sorts of ranged weapons, gaining a +1 attack bonus when employing them.",
      "When attacked in melee by creatures larger than man-sized, **Halflings** gain a +2 bonus to their Armor Class.",
      "**Halflings** are quick-witted, adding +1 to Initiative die rolls.",
      "In their preferred forest terrain, **Halflings** are able to hide very effectively; so long as they remain still there is only a 10% chance they will be detected. Even indoors, in dungeons or in non- preferred terrain they are able to hide such that there is only a 30% chance of detection. Note that a **Halfling Thief** will roll only once, using either the **Thief** ability or the **Halfling** ability, whichever is better.",
    ],
    restrictions: [
      "**Halflings** may not use Large weapons, and must wield Medium weapons with both hands.",
    ],
  },
};
