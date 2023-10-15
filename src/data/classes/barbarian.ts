import { EquipmentCategories } from "../definitions";
import { ClassSetup } from "./definitions";
import { DiceTypes } from "../definitions";

export const barbarian: ClassSetup = {
  name: "Barbarian",
  minimumAbilityRequirements: { strength: 9, dexterity: 9, constitution: 9 },
  hitDice: DiceTypes.D10,
  hitDiceModifier: 2,
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
    0, 2500, 5000, 10000, 20000, 40000, 80000, 150000, 300000, 450000, 600000,
    750000, 900000, 1050000, 1200000, 1350000, 1500000, 1650000, 1800000,
    1950000,
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
      "(Barbarians Release 6)\n\nBarbarians are warriors born in savage lands, far from the mollifying comforts of civilization. Barbarians rely on hardiness, stealth, and foolhardy bravery to beat their enemies.\n\n**Requirements**: In order to qualify to be a Barbarian, a character requires a Strength of 9 or higher, a Dexterity of 9 or higher, and a Constitution of 9 or higher. The class is open to Dwarves, Humans, as well as Half-Ogres and Half-Orcs if those options are available.\n\nBarbarians may use any armor or shields, and may wield any weapons desired.\n\nBarbarians wearing no armor or at most leather armor may employ the following abilities:\n\n**Alertness**: Only a Thief one or more levels higher than the Barbarian can use their Backstab ability on the Barbarian.\n\n**Animal reflexes**: The Barbarian can be surprised only on a roll of 1 on 1d6.\n\n**Hunter**: In the wilderness Barbarians can surprise enemies on a roll of 1-3 on 1d6.\n\n**Runner**: The Barbarian adds 5 feet to their tactical movement.\n\nBarbarians have one additional special ability they can always use, regardless of armor worn:\n\n**Rage**: Once per day a Barbarian can fly into a Rage, which will last ten rounds. While raging, a Barbarian cannot use any abilities that require patience or concentration, nor can they activate magic items of any kind (including potions). Of course, magic items with a continuous effect (like a Ring of Protection) continue to function.\n\nWhile raging, the Barbarian must charge directly into combat with the nearest recognizable enemy. If no enemy is nearby, the Barbarian must end their rage (see below) or else attack the nearest character.\n\nWhile raging, the character temporarily gains a +2 bonus on attack rolls, damage rolls, and saving throws versus mind-altering spells, but suffers a penalty of -2 to armor class.\n\nThe Barbarian may prematurely end their rage with a successful save vs. Spells.\n\nAt the end of the rage, the Barbarian loses the rage modifiers and becomes fatigued, suffering a penalty of -2 to attack rolls, damage, armor class, and saving throws. While fatigued, the Barbarian may not charge nor move at a running rate. This state of fatigue lasts for an hour.\n\nA Barbarian may use this ability up to two times per day at 6th level and three times per day at 12th level.",
    specials: [
      "**Barbarians** may use any armor or shields, and may wield any weapons desired.",
      "**Barbarians** wearing no armor or at most leather armor may employ the following abilities:",
      "**Alertness**: Only a Thief one or more levels higher than the **Barbarian** can use their Backstab ability on the **Barbarian**.",
      "**Animal reflexes**: The **Barbarian** can be surprised only on a roll of 1 on 1d6.",
      "**Hunter**: In the wilderness **Barbarians** can surprise enemies on a roll of 1-3 on 1d6.",
      "**Runner**: The **Barbarian** adds 5 feet to their tactical movement.",
      "**Rage**: Once per day a Barbarian can fly into a Rage, which will last ten rounds. While raging, a Barbarian cannot use any abilities that require patience or concentration, nor can they activate magic items of any kind (including potions). Of course, magic items with a continuous effect (like a Ring of Protection) continue to function.\n\nWhile raging, the Barbarian must charge directly into combat with the nearest recognizable enemy. If no enemy is nearby, the Barbarian must end their rage (see below) or else attack the nearest character.\n\nWhile raging, the character temporarily gains a +2 bonus on attack rolls, damage rolls, and saving throws versus mind-altering spells, but suffers a penalty of -2 to armor class.\n\nThe Barbarian may prematurely end their rage with a successful save vs. Spells.\n\nAt the end of the rage, the Barbarian loses the rage modifiers and becomes fatigued, suffering a penalty of -2 to attack rolls, damage, armor class, and saving throws. While fatigued, the Barbarian may not charge nor move at a running rate. This state of fatigue lasts for an hour.\n\nA Barbarian may use this ability up to two times per day at 6th level and three times per day at 12th level.",
    ],
    restrictions: [],
  },
};
