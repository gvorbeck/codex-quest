import { DiceTypes, EquipmentItem } from "../definitions";
import { EquipmentCategories } from "../definitions";
import { ClassSetup } from "./definitions";
import equipmentItems from "../equipmentItems.json";

export const illusionist: ClassSetup = {
  name: "Illusionist",
  minimumAbilityRequirements: { intelligence: 13 },
  hitDice: DiceTypes.D4,
  hitDiceModifier: 1,
  availableEquipmentCategories: [
    EquipmentCategories.DAGGERS,
    EquipmentCategories.GENERAL,
    EquipmentCategories.OTHERWEAPONS,
    EquipmentCategories.BEASTS,
    EquipmentCategories.BARDING,
    EquipmentCategories.IMPROVISED,
  ],
  specificEquipmentItems: [[EquipmentCategories.OTHERWEAPONS], ["cudgel"]],
  experiencePoints: [
    0, 2500, 5000, 10000, 20000, 40000, 80000, 150000, 300000, 450000, 600000,
    750000, 900000, 1050000, 1200000, 1350000, 1500000, 1650000, 1800000,
    1950000,
  ],
  attackBonus: [0, 1, 1, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7],
  savingThrows: [
    [
      1,
      {
        deathRayOrPoison: 13,
        magicWands: 14,
        paralysisOrPetrify: 13,
        dragonBreath: 16,
        spells: 15,
      },
    ],
    [
      3,
      {
        deathRayOrPoison: 13,
        magicWands: 14,
        paralysisOrPetrify: 13,
        dragonBreath: 15,
        spells: 14,
      },
    ],
    [
      5,
      {
        deathRayOrPoison: 12,
        magicWands: 13,
        paralysisOrPetrify: 12,
        dragonBreath: 15,
        spells: 13,
      },
    ],
    [
      7,
      {
        deathRayOrPoison: 12,
        magicWands: 12,
        paralysisOrPetrify: 11,
        dragonBreath: 14,
        spells: 13,
      },
    ],
    [
      9,
      {
        deathRayOrPoison: 11,
        magicWands: 11,
        paralysisOrPetrify: 10,
        dragonBreath: 14,
        spells: 12,
      },
    ],
    [
      11,
      {
        deathRayOrPoison: 11,
        magicWands: 10,
        paralysisOrPetrify: 9,
        dragonBreath: 13,
        spells: 11,
      },
    ],
    [
      13,
      {
        deathRayOrPoison: 10,
        magicWands: 10,
        paralysisOrPetrify: 9,
        dragonBreath: 13,
        spells: 11,
      },
    ],
    [
      15,
      {
        deathRayOrPoison: 10,
        magicWands: 9,
        paralysisOrPetrify: 8,
        dragonBreath: 12,
        spells: 10,
      },
    ],
    [
      17,
      {
        deathRayOrPoison: 9,
        magicWands: 8,
        paralysisOrPetrify: 7,
        dragonBreath: 12,
        spells: 9,
      },
    ],
    [
      19,
      {
        deathRayOrPoison: 9,
        magicWands: 7,
        paralysisOrPetrify: 6,
        dragonBreath: 11,
        spells: 9,
      },
    ],
    [
      20,
      {
        deathRayOrPoison: 8,
        magicWands: 6,
        paralysisOrPetrify: 5,
        dragonBreath: 11,
        spells: 8,
      },
    ],
  ],
  spellBudget: [
    [2, 0, 0, 0, 0, 0],
    [3, 0, 0, 0, 0, 0],
    [3, 1, 0, 0, 0, 0],
    [3, 2, 0, 0, 0, 0],
    [3, 2, 1, 0, 0, 0],
    [4, 2, 2, 0, 0, 0],
    [4, 2, 2, 1, 0, 0],
    [4, 3, 2, 2, 0, 0],
    [4, 3, 2, 2, 1, 0],
    [5, 3, 3, 2, 2, 0],
    [5, 4, 3, 2, 2, 1],
    [5, 4, 3, 3, 2, 2],
    [5, 4, 4, 3, 2, 2],
    [5, 4, 4, 3, 3, 2],
    [6, 4, 4, 3, 3, 2],
    [6, 5, 4, 3, 3, 2],
    [6, 5, 4, 4, 3, 3],
    [7, 5, 4, 4, 3, 3],
    [7, 5, 5, 4, 3, 3],
    [7, 5, 5, 4, 4, 3],
  ],
  startingSpells: ["Read Magic"],
  startingEquipment: [
    equipmentItems.find((item) =>
      item.name.toLowerCase().startsWith("spellbook"),
    )! as EquipmentItem,
  ],
  details: {
    description:
      "(Illusionists Release 9)\n\nIllusionists are “specialist” Magic-Users who focus on the creation and manipulation of illusions, whether visual, auditory, or mental, and at higher levels quasi-real things made of tangible shadow. Though “normal” Magic-Users can create illusions, those created by a true Illusionist are superior in quality and realism.\n\nThe Prime Requisite for an Illusionist is Intelligence. The Illusionist is required to have an Intelligence score of 13 or higher. Illusionists are poor fighters, with fighting ability equivalent to normal Magic-Users. Likewise they are no more hardy than standard Magic-Users (d4 hit die). They may not wear any armor of any sort or use shields. Like other Magic-Users, they can utilize a walking staff (or cudgel) or dagger, and of course they may use magical weapons of those types. Otherwise, Illusionists can generally be treated as equivalent to Magic-Users for any situation not covered here.\n\nBecause of their expertise at creating and understanding illusions, Illusionists always gain an additional +2 on saves vs. any sort of illusion or phantasm.\n\nIllusionists produce magic much like other types of Magic-Users, but have different spell choices. They can learn spells from each other so long as the spells are available to both classes. Like other Magic-Users, a first level Illusionist begins play knowing read magic and one other spell of first level, recorded within a spell book. The GM may roll for the spell, assign it as they see fit, or allow the player to choose it, at their option. See the Illusionist Spells section below for more details.",
    specials: [
      "**Illusionists** begins play knowing Read Magic and one other spell of first level.",
      "Because of their expertise at creating and understanding illusions, **Illusionists** always gain an additional +2 on saves vs. any sort of illusion or phantasm.",
      "**Illusionists** produce magic much like other types of Magic-Users, but have different spell choices. They can learn spells from each other so long as the spells are available to both classes. Illusionists may learn spells by being taught directly by another Illusionist or by studying another Illusionist's spellbook. The Illusionist may also learn appropriate spells from standard Magic-Users (or other arcane casters, if used); the spell always being at the level as it appears on the Illusionist Spell List.  If being taught, a spell can be learned in a single day; researching another Illusionist's spellbook takes one day per spell level. Either way, the spell learned must be transcribed into the Illusionist's own spellbook, at a cost of 500 gp per spell level transcribed.",
      "Like other Magic-Users, a first level **Illusionist** begins play knowing Read Magic and one other spell of first level, recorded within a spell book",
    ],
    restrictions: [
      "**Illusionists** may not wear any armor of any sort or use shields.",
      "**Illusionists**, like other Magic-Users, can utilize a walking staff (or cudgel) or dagger, and of course they may use magical weapons of those types.",
    ],
  },
};
