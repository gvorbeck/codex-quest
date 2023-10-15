import { DiceTypes } from "../definitions";
import { EquipmentCategories } from "../definitions";
import { ClassSetup } from "./definitions";

export const ranger: ClassSetup = {
  name: "Ranger",
  minimumAbilityRequirements: {
    strength: 9,
    wisdom: 11,
    dexterity: 11,
  },
  hitDice: DiceTypes.D8,
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
    0, 2200, 4400, 8800, 17600, 35200, 70400, 132000, 264000, 396000, 528000,
    660000, 792000, 924000, 1056000, 1188000, 1320000, 1452000, 1584000,
    1716000,
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
  specialAbilities: {
    titles: ["Move SIlently", "Hide", "Tracking"],
    stats: [
      [0],
      [25, 10, 40],
      [30, 15, 44],
      [35, 20, 48],
      [40, 25, 52],
      [45, 30, 56],
      [50, 35, 60],
      [55, 40, 64],
      [60, 45, 68],
      [65, 50, 72],
      [68, 53, 75],
      [71, 56, 78],
      [74, 59, 81],
      [77, 62, 84],
      [80, 65, 87],
      [83, 68, 90],
      [85, 69, 91],
      [87, 70, 92],
      [89, 71, 93],
      [91, 72, 94],
      [93, 73, 95],
    ],
  },
  details: {
    description:
      "(Rangers and Paladins Release 4)\n\nRangers are specialized warriors who roam the borderlands, where their mission is to keep the beasts and monsters of the untamed lands at bay. They generally operate alone or in small groups, and rely on stealth and surprise to meet their objectives.\n\n**Requirements**: To become a Ranger, a character must have a Strength score of 9 or higher (just as with any Fighter), a Wisdom of 11 or higher, and a Dexterity of 11 or higher. They may use any weapon and may wear any armor, but note that some of the Ranger’s special talents and abilities are unavailable when wearing heavier than leather armor. Humans, Elves, and Halflings may become Rangers. If the Half-Humans supplement is used, Half-Elves and Half-Orcs may also become Rangers.\n\n**Special Abilities**: Rangers can Move Silently, Hide, and Track when in wilderness areas, at percentages given in the table below. Apply a -20% penalty when attempting these abilities in urban areas. Move Silently and Hide may not be used in armor heavier than leather (unless the Thief Options supplement is in use, in which case the adjustments in that supplement should be applied).\n\nWhen tracking, the Ranger must roll once per hour traveled or lose the trail.\n\nA Ranger must declare a chosen enemy. Against this chosen enemy, the Ranger gets a bonus of +3 to damage. This enemy might be a certain category of creature such as giants, humanoids, or dragons. With the GM's permission, the list might include rival organizations, nations, or similar agencies.\n\nRangers are always expert bowmen. When using any regular bow (shortbow or longbow, but not crossbow), a Ranger adds +2 to his or her Attack Bonus. At 5th level, a Ranger may fire three arrows every two rounds (a 3/2 rate of fire). This means one attack on every odd round, two on every even round, with the second attack coming at the end of the round. At 9th level, the Ranger may fire two arrows every round, with the second attack coming at the end of the round.",
    specials: [
      "**Rangers** may use any weapon and may wear any armor, but note that some of the Ranger’s special talents and abilities are unavailable when wearing heavier than leather armor.",
      "**Rangers** can Move Silently, Hide, and Track when in wilderness areas.",
      "A **Ranger** must declare a chosen enemy. Against this chosen enemy, the Ranger gets a bonus of +3 to damage. This enemy might be a certain category of creature such as giants, humanoids, or dragons. With the GM's permission, the list might include rival organizations, nations, or similar agencies.",
      "**Rangers** are always expert bowmen. When using any regular bow (shortbow or longbow, but not crossbow), a Ranger adds +2 to his or her Attack Bonus. At 5th level, a Ranger may fire three arrows every two rounds (a 3/2 rate of fire). This means one attack on every odd round, two on every even round, with the second attack coming at the end of the round. At 9th level, the Ranger may fire two arrows every round, with the second attack coming at the end of the round.",
    ],
    restrictions: [
      "**Rangers** get a -20% penalty when attempting these abilities in urban areas.",
      "Move Silently and Hide may not be used by **Rangers** in armor heavier than leather",
      "When tracking, the **Ranger** must roll once per hour traveled or lose the trail.",
    ],
  },
};
