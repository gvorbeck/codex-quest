import ExpertBowmenSvg from "@/assets/svg/ExpertBowmenSvg";
import { DiceTypes } from "../definitions";
import { EquipmentCategories } from "../definitions";
import { ClassSetup } from "./definitions";
import { iconStrings } from "@/support/stringSupport";
import DualWieldBonusSvg from "@/assets/svg/DualWieldBonusSvg";
import NoSurpriseSvg from "@/assets/svg/NoSurpriseSvg";
import EquipmentLimitsSvg from "@/assets/svg/EquipmentLimitsSvg";
import WeaponLimitsSvg from "@/assets/svg/WeaponLimitsSvg";

export const scout: ClassSetup = {
  name: "Scout",
  minimumAbilityRequirements: { strength: 9, wisdom: 11, dexterity: 11 },
  hitDice: DiceTypes.D6,
  hitDiceModifier: 2,
  availableEquipmentCategories: [
    EquipmentCategories.AMMUNITION,
    EquipmentCategories.ARMOR,
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
  equipmentAttackBonuses: [
    ["shortbow", "+2"],
    ["longbow", "+2"],
  ],
  noLargeEquipment: true,
  specificEquipmentItems: [[EquipmentCategories.ARMOR], ["leather"]],
  experiencePoints: [
    0, 1500, 3000, 6000, 12000, 24000, 48000, 90000, 180000, 270000, 360000,
    450000, 540000, 630000, 720000, 810000, 900000, 990000, 1080000, 1170000,
  ],
  attackBonus: [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8],
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
        deathRayOrPoison: 12,
        magicWands: 14,
        paralysisOrPetrify: 12,
        dragonBreath: 15,
        spells: 14,
      },
    ],
    [
      5,
      {
        deathRayOrPoison: 11,
        magicWands: 13,
        paralysisOrPetrify: 12,
        dragonBreath: 14,
        spells: 13,
      },
    ],
    [
      7,
      {
        deathRayOrPoison: 11,
        magicWands: 13,
        paralysisOrPetrify: 11,
        dragonBreath: 13,
        spells: 13,
      },
    ],
    [
      9,
      {
        deathRayOrPoison: 10,
        magicWands: 12,
        paralysisOrPetrify: 11,
        dragonBreath: 12,
        spells: 12,
      },
    ],
    [
      11,
      {
        deathRayOrPoison: 9,
        magicWands: 12,
        paralysisOrPetrify: 10,
        dragonBreath: 11,
        spells: 11,
      },
    ],
    [
      13,
      {
        deathRayOrPoison: 9,
        magicWands: 10,
        paralysisOrPetrify: 10,
        dragonBreath: 10,
        spells: 11,
      },
    ],
    [
      15,
      {
        deathRayOrPoison: 8,
        magicWands: 10,
        paralysisOrPetrify: 9,
        dragonBreath: 9,
        spells: 10,
      },
    ],
    [
      17,
      {
        deathRayOrPoison: 7,
        magicWands: 9,
        paralysisOrPetrify: 9,
        dragonBreath: 8,
        spells: 9,
      },
    ],
    [
      19,
      {
        deathRayOrPoison: 7,
        magicWands: 9,
        paralysisOrPetrify: 8,
        dragonBreath: 7,
        spells: 9,
      },
    ],
    [
      20,
      {
        deathRayOrPoison: 6,
        magicWands: 8,
        paralysisOrPetrify: 8,
        dragonBreath: 6,
        spells: 8,
      },
    ],
  ],
  specialAbilities: {
    titles: [
      "Move Silently",
      "Hide",
      "Listen",
      "Open Locks",
      "Detect Traps",
      "Climb Walls",
      "Track",
    ],
    stats: [
      [0],
      [10, 10, 25, 50, 10, 30, 40],
      [15, 15, 30, 52, 15, 34, 44],
      [20, 20, 35, 54, 20, 38, 48],
      [25, 25, 40, 56, 25, 42, 52],
      [30, 30, 45, 58, 30, 46, 56],
      [35, 35, 50, 60, 35, 50, 60],
      [40, 40, 55, 62, 40, 54, 64],
      [45, 45, 60, 64, 45, 58, 68],
      [50, 50, 65, 66, 50, 62, 72],
      [53, 53, 68, 68, 53, 65, 75],
      [56, 56, 71, 70, 56, 68, 78],
      [59, 59, 74, 72, 59, 71, 81],
      [62, 62, 77, 74, 62, 74, 84],
      [65, 65, 80, 76, 65, 77, 87],
      [68, 68, 83, 78, 68, 80, 90],
      [69, 69, 85, 79, 69, 83, 91],
      [70, 70, 87, 80, 70, 86, 92],
      [71, 71, 89, 81, 71, 89, 93],
      [72, 72, 91, 82, 72, 92, 94],
      [73, 73, 93, 83, 73, 95, 95],
    ],
  },
  details: {
    description:
      "(Scouts Release 4)\n\nScouts have been toughened by self-sufficiency and isolation from the supplies and comforts of civilized lands, and therefore use a d6 for hit dice. It also takes more training to be a Scout, and therefore Scouts advance at the same rate as Clerics. Scouts should be treated as Thieves for all purposes, except as described herein. Scouts specialize in stealth operations in the wilderness. They are similar to Rangers in some ways, having similar functions and abilities.\n\n**Requirements**: To become a Scout, a character must have a Strength score of 9 or higher, a Wisdom of 11 or higher, and a Dexterity of 11 or higher. They may not wear metal armor as it interferes with stealthy activities, nor may they use shields of any sort. Leather armor is acceptable, however. They may only use small melee weapons, the shortbow, and the longbow. Humans, Elves, and Halflings may become Scouts. If the Half-Humans supplement is used, Half-Elves and Half-Orcs may also become Scouts.\n\n**Special Abilities**: Scouts can Move Silently, Hide, Listen, Open Locks, Detect Traps, Climb Walls, and Track.\n\nWhen tracking, the Scout must roll once per hour traveled or lose the trail.\n\nScouts are able to detect traps, but unlike Thieves they have no special ability to remove them.\n\nScouts cannot pick pockets, as stealing is neither their specialty nor purpose. They usually avoid doing anything that might allow or encourage someone to track them.\n\nUnlike a Thief, a scout gains no bonuses for back stabbing, though normal bonuses for attacking from behind or with surprise are applied.\n\nScouts are always expert bowmen. When using any regular bow (shortbow or longbow, but not crossbow), a Scout adds +2 to his or her Attack Bonus. At 5th level, a Scout may fire three arrows every two rounds (a 3/2 rate of fire). This means one attack on every odd round, two on every even round, with the second attack coming at the end of the round. At 9th level, the Scout may fire two arrows every round, with the second attack coming at the end of the round.\n\nScouts prefer to stay out of direct combat, and therefore practice only with small weapons as they are lighter and easier to carry. They specialize in dual wielding, however prefer to utilize their off-handed weapon as a defensive item, similar to a buckler shield. This must be declared at the start of the round, and in this case no special penalty is applied to the primary weapon, and the off-handed weapon adds an additional +1 to the wielder's AC value against a single melee attacker per round. If the weapon has a magical weapon bonus, it may be applied, but only the base bonus for those weapons with multiple values. If chosen, Scouts may attack with both weapons. In this case, they may attack with their primary weapon with a -2 penalty and their secondary with a -5 penalty to hit. Subtract from this penalty the character's Dexterity bonus, with a minimum penalty of +0 (so a character with 18 Dexterity does not get a +1 bonus to hit this way).\n\nIf a scout is operating alone or greater then 30' away from a party (or in a party composed entirely of scouts), he or she surprises foes on a 1-3 on 1d6.",
    restrictions: [
      "**Scouts** may not wear metal armor as it interferes with stealthy activities, nor may they use shields of any sort. Leather armor is acceptable, however.",
      "**Scouts** may only use small melee weapons, the shortbow, and the longbow.",
      "When tracking, the **Scout** must roll once per hour traveled or lose the trail.",
      "**Scouts** are able to detect traps, but unlike Thieves they have no special ability to remove them.",
      "Unlike a Thief, a **Scout** gains no bonuses for back stabbing, though normal bonuses for attacking from behind or with surprise are applied.",
    ],
    specials: [
      "**Scouts** are always expert bowmen. When using any regular bow (shortbow or longbow, but not crossbow), a Scout adds +2 to his or her Attack Bonus.",
      "**Scouts** specialize in dual wielding, however prefer to utilize their off-handed weapon as a defensive item, similar to a buckler shield. This must be declared at the start of the round, and in this case no special penalty is applied to the primary weapon, and the off-handed weapon adds an additional +1 to the wielder's AC value against a single melee attacker per round. If the weapon has a magical weapon bonus, it may be applied, but only the base bonus for those weapons with multiple values. If chosen, Scouts may attack with both weapons. In this case, they may attack with their primary weapon with a -2 penalty and their secondary with a -5 penalty to hit. Subtract from this penalty the character's Dexterity bonus, with a minimum penalty of +0 (so a character with 18 Dexterity does not get a +1 bonus to hit this way).",
      "If a **Scout** is operating alone or greater then 30' away from a party (or in a party composed entirely of Scouts), he or she surprises foes on a 1-3 on 1d6.",
    ],
  },
  icons: [
    [
      EquipmentLimitsSvg,
      iconStrings.equipmentLimits("No metal armor. No shields."),
    ],
    [
      WeaponLimitsSvg,
      iconStrings.weaponLimits("Small melee weapons, shortbow, longbow"),
    ],
    [ExpertBowmenSvg, "+2 Attack Bonus with Bows (not crossbows)"],
    [DualWieldBonusSvg, "Dual Wield Bonus"],
    [
      NoSurpriseSvg,
      "When more than 30' from party, surprises foes on a 1-3 on 1d6",
    ],
  ],
};
