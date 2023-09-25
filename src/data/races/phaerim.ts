import { ClassNames } from "../definitions";
import { RaceSetup } from "./definitions";

export const phaerim: RaceSetup = {
  name: "Phaerim",
  allowedStandardClasses: [...(Object.values(ClassNames) as ClassNames[])],
  minimumAbilityRequirements: { dexterity: 9, charisma: 11 },
  maximumAbilityRequirements: { strength: 15 },
  decrementHitDie: true,
  noLargeEquipment: true,
  savingThrows: {
    magicWands: 2,
    paralysisOrPetrify: 1,
    spells: 2,
  },
  details: {
    description:
      "The beautiful Phaerim are related to fey such as booka, pixies, or similar faeries. Phaerim appear to be smaller than normal Elf-like folk, except that they have a pair of wings resembling those of dragonflies or sometimes butterflies. For unknown reasons, there are at least twice as many Phaerim females as there are males. Phaerim stand no taller than the average Halfling (3’) but have a more slight build, seldom being heavier than 40 pounds.\n\n**Restrictions**: Phaerim can be any class but generally gravitate to magical classes. If allowed by the GM, Phaerim will be more likely to pursue classes associated with nature than the standard fare. Thus Rangers and Druids are more common than Fighters and Clerics. Phaerim are required to have a minimum Dexterity score of 9. Phaerim are quite captivating, and must also have a minimum Charisma score of 11. Due to their very small stature, they may not have a Strength score higher than 15. Also size related, Phaerim roll hit dice one size smaller than normal; a d8 would become a d6, a d6 to d4, and a d4 would instead be d3 (d6, 1-2=1, 3-4=2, 5-6=3). Phaerim may not use Large weapons, and must wield Medium weapons with both hands.\n\n**Special Abilities**: Phaerim normally walk like other races, but their most remarkable ability is limited flight while unencumbered (at double the normal movement rates).\n\nPhaerim can fly up to 10 rounds, but must remain grounded an equivalent amount of time after any flight. A lightly-encumbered Phaerim can fly up to 5 rounds but must rest for twice as many rounds as those flown (for instance, a lightly-encumbered flight of 4 rounds requires 8 rounds grounded). Phaerim take half-damage from falls due to their reduced weight and wings.\n\nSimilar to Halflings, Phaerim are able to hide very effectively; so long as they remain still there is only a 10% chance they will be detected outdoors in forested environments. Even indoors, in dungeons, or in nonpreferred terrain they are able to hide such that there is only a 30% chance of detection. Note that a Phaerim Thief will roll for hiding attempts only once, using either the Thief ability or the Phaerim ability, whichever is better.\n\n**Saving Throws**: Like Elves, Phaerim save at +1 vs. Paralysis or Petrify and +2 vs. Magic Wands and Spells.",
    specials: [
      "**Phaerim** can fly up to 10 rounds, but must remain grounded an equivalent amount of time after any flight. A lightly-encumbered Phaerim can fly up to 5 rounds but must rest for twice as many rounds as those flown (for instance, a lightly-encumbered flight of 4 rounds requires 8 rounds grounded).",
      "**Phaerim** take half-damage from falls due to their reduced weight and wings.",
      "Similar to Halflings, **Phaerim** are able to hide very effectively; so long as they remain still there is only a 10% chance they will be detected outdoors in forested environments. Even indoors, in dungeons, or in nonpreferred terrain they are able to hide such that there is only a 30% chance of detection. Note that a Phaerim Thief will roll for hiding attempts only once, using either the Thief ability or the Phaerim ability, whichever is better.",
    ],
    restrictions: [
      "**Phaerim** may not use Large weapons, and must wield Medium weapons with both hands.",
    ],
  },
};
