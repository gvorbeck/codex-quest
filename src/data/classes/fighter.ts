import { DiceTypes } from "../definitions";
import { EquipmentCategories } from "../definitions";
import { ClassSetup } from "./definitions";

export const fighter: ClassSetup = {
  name: "Fighter",
  minimumAbilityRequirements: { strength: 9 },
  hitDice: DiceTypes.D8,
  hitDiceModifier: 2,
  customRules: [
    {
      title: "Weapon Specialization Option",
      description:
        'Under this rule, the player of a Fighter may choose a weapon in which the character is especially skilled. Specialization only applies to "true" Fighters, and not to any subclasses thereof which may appear in this or any other supplement, unless otherwise noted.\n\nAt first level, the player applies one **rank** of specialization to the chosen weapon. This choice must be quite specific; for instance, a specialization in the longsword will give no bonuses when using a shortsword.\n\nEvery third level after first (that is, 4th, 7th, 10th, etc.) the player applies another rank of specialization. Each new rank may be applied to an existing specialization, or to a new specialization.\n\nFor instance, at first level Darion\'s player assigns a rank to longsword. Darion gains a bonus of +1 on attack rolls when using a longsword. At 4th level, the player may assign the new rank to longsword, giving a bonus of +1 on attack rolls and +1 on damage; or, the rank may be applied to a new weapon, such as the longbow, in which case both weapons have +1 on attack rolls but no bonus to damage.\n\nAs indicated in the Attacks Per Round column, at higher ranks of specialization the Fighter is allowed to attack more than one time per round. 3/2 means that the character may attack three time in every two rounds, once in the oddnumbered round and twice in the even-numbered round. At 2/1 the Fighter is allowed to attack with the specialized weapon two times per round. Additional attacks always come after all other attacks are resolved; that is, the Fighter attacks once on his or her Initiative number, then again after all “first” attacks are done. If more than one weapon specialist is involved in a battle, count Initiative down twice, once for “first” attacks and again for “second” attacks.\n\n| Rank | Combat Bonuses | Attacks per Round | --- | --- | --- | 1 | +1 / +0 | 1 / 1 | 2 | +1 / +1 | 1 / 1 | 3 | +2 / +1 | 3 / 2 | 4 | +2 / +2 | 3 / 2 | 5 | +3 / +2 | 2 / 1 | 6 | +3 / +3 | 2 / 1 |',
    },
  ],
  availableEquipmentCategories: [
    EquipmentCategories.AMMUNITION,
    EquipmentCategories.ARMOR,
    EquipmentCategories.SHIELDS,
    EquipmentCategories.AXES,
    EquipmentCategories.BEASTS,
    EquipmentCategories.BARDING,
    EquipmentCategories.BOWS,
    EquipmentCategories.DAGGERS,
    EquipmentCategories.HAMMERMACE,
    EquipmentCategories.GENERAL,
    EquipmentCategories.OTHERWEAPONS,
    EquipmentCategories.SWORDS,
    EquipmentCategories.SPEARSPOLES,
    EquipmentCategories.IMPROVISED,
    EquipmentCategories.SLINGHURLED,
    EquipmentCategories.CHAINFLAIL,
  ],
  experiencePoints: [
    0, 2000, 4000, 8000, 16000, 32000, 64000, 120000, 240000, 360000, 480000,
    600000, 720000, 840000, 960000, 1080000, 1200000, 1320000, 1440000, 1560000,
  ],
  attackBonus: [
    0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 6, 7, 7, 8, 8, 8, 9, 9, 10, 10, 10,
  ],
  savingThrows: [
    [
      1,
      {
        deathRayOrPoison: 12,
        magicWands: 13,
        paralysisOrPetrify: 14,
        dragonBreath: 15,
        spells: 17,
      },
    ],
    [
      3,
      {
        deathRayOrPoison: 11,
        magicWands: 12,
        paralysisOrPetrify: 14,
        dragonBreath: 15,
        spells: 16,
      },
    ],
    [
      5,
      {
        deathRayOrPoison: 11,
        magicWands: 11,
        paralysisOrPetrify: 13,
        dragonBreath: 14,
        spells: 15,
      },
    ],
    [
      7,
      {
        deathRayOrPoison: 10,
        magicWands: 11,
        paralysisOrPetrify: 12,
        dragonBreath: 14,
        spells: 15,
      },
    ],
    [
      9,
      {
        deathRayOrPoison: 9,
        magicWands: 10,
        paralysisOrPetrify: 12,
        dragonBreath: 13,
        spells: 14,
      },
    ],
    [
      11,
      {
        deathRayOrPoison: 9,
        magicWands: 9,
        paralysisOrPetrify: 11,
        dragonBreath: 12,
        spells: 13,
      },
    ],
    [
      13,
      {
        deathRayOrPoison: 8,
        magicWands: 9,
        paralysisOrPetrify: 10,
        dragonBreath: 12,
        spells: 13,
      },
    ],
    [
      15,
      {
        deathRayOrPoison: 7,
        magicWands: 8,
        paralysisOrPetrify: 10,
        dragonBreath: 11,
        spells: 12,
      },
    ],
    [
      17,
      {
        deathRayOrPoison: 7,
        magicWands: 7,
        paralysisOrPetrify: 9,
        dragonBreath: 10,
        spells: 11,
      },
    ],
    [
      19,
      {
        deathRayOrPoison: 6,
        magicWands: 7,
        paralysisOrPetrify: 8,
        dragonBreath: 10,
        spells: 11,
      },
    ],
    [
      20,
      {
        deathRayOrPoison: 5,
        magicWands: 6,
        paralysisOrPetrify: 8,
        dragonBreath: 9,
        spells: 10,
      },
    ],
  ],
  details: {
    description:
      "**Fighters** include soldiers, guardsmen, barbarian warriors, and anyone else for whom fighting is a way of life. They train in combat, and they generally approach problems head-on, weapon in hand.\n\nNot surprisingly, Fighters are the best at fighting of all the classes. They are also the hardiest, able to take more punishment than any other class. Although they are not skilled in the ways of magic, Fighters can nonetheless use many magic items, including but not limited to magical weapons and armor.\n\nThe Prime Requisite for Fighters is Strength; a character must have a Strength score of 9 or higher to become a Fighter. Members of this class may wear any armor and use any weapon.",
    specials: [
      "Although they are not skilled in the ways of magic, **Fighters** can nonetheless use many magic items, including but not limited to magical weapons and armor.",
      "**Fighters** may wear any armor and use any weapon.",
    ],
    restrictions: [],
  },
};
