import { DiceTypes } from "../definitions";
import { EquipmentCategories } from "../definitions";
import { ClassSetup } from "./definitions";

export const paladin: ClassSetup = {
  name: "Paladin",
  minimumAbilityRequirements: {
    strength: 9,
    wisdom: 11,
    charisma: 11,
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
  startingSpells: ["Protection from Evil*", "Detect Evil*"],
  spellBudget: [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0],
    [2, 0, 0, 0, 0, 0],
    [2, 1, 0, 0, 0, 0],
    [2, 2, 0, 0, 0, 0],
    [3, 2, 0, 0, 0, 0],
    [3, 3, 0, 0, 0, 0],
    [4, 3, 0, 0, 0, 0],
    [4, 4, 0, 0, 0, 0],
    [5, 4, 0, 0, 0, 0],
    [5, 5, 0, 0, 0, 0],
    [6, 5, 0, 0, 0, 0],
  ],
  powers: [
    {
      name: "Turn Undead",
      costValue: 0,
      costCurrency: "gp",
      category: "weapons",
      damage: "2d6",
      amount: 1,
      type: "power",
      noDelete: true,
      minLevel: 2,
    },
  ],
  details: {
    description:
      "(Rangers and Paladins Release 4)\n\n**Requirements**: To become a Paladin, a character must have at least a Strength score of 9, a Wisdom score of 11, and a Charisma score of 11. There are no racial restrictions for the Paladin. They may use any weapon and may wear any armor or shield. If your GM is using the nine alignments option/supplement, you must either be Lawful Good or Chaotic Evil.\n\n**Special Abilities**: Paladins emanate an aura equivalent to the spell **protection from evil** (or good, depending on the Paladin's particular faith) in a 10' radius. The Paladin can also **detect evil** (or good, as above) at will, as the spell.\n\nOnce per day, per level, a Paladin can make his or her nonmagical melee weapon or attack form equivalent to a magic weapon for purposes of hitting creatures only able to be struck with a silver or magical weapon. This effect lasts for a turn.\n\nOnce per day, the paladin can **Lay on Hands** to any wounded character and heal 2 points of damage; add the Paladin's Charisma bonus to this figure. On each oddnumbered level (3rd, 5th, etc.) the Paladin may do this one additional time per day (so, twice per day at 3rd level, three times per day at 5th level, etc.) Starting at 7th level, the Paladin may choose to **cure disease** (as the spell) instead of providing healing as above. At 11th level, the Paladin may also substitute **neutralize poison**.\n\nA Paladin can Turn (or command) undead as if a Cleric of a level equal to half his or her own, rounded down, starting at 2nd level.\n\nPaladins gain the ability to cast appropriate Clerical spells at level 10. For purposes of spell effects that vary based on the Cleric's level, use one-half the Paladin's level, rounded down.\n\nA Paladin must tithe, giving a minimum of 10% of all treasures gained or other profits as an offering to his or her deity.\n\nA Paladin must obey a code of honor, as defined by the Game Master, and must try to perform duties assigned by his or her deity or religious hierarchy. If the Paladin breaks the code, all powers granted are taken away, and the character must atone for his or her actions as soon as possible. Until the Paladin successfully atones, as defined by the Game Master, he or she is considered an ordinary Fighter.",
    restrictions: [
      "A **Paladin** must tithe, giving a minimum of 10% of all treasures gained or other profits as an offering to his or her deity.",
      "A **Paladin** must obey a code of honor, as defined by the Game Master, and must try to perform duties assigned by his or her deity or religious hierarchy. If the Paladin breaks the code, all powers granted are taken away, and the character must atone for his or her actions as soon as possible. Until the Paladin successfully atones, as defined by the Game Master, he or she is considered an ordinary Fighter.",
    ],
    specials: [
      "**Paladins** emanate an aura equivalent to the spell **protection from evil** (or good, depending on the Paladin's particular faith) in a 10' radius.",
      "The **Paladin** can also **detect evil** (or good, as above) at will, as the spell.",
      "Once per day, per level, a **Paladin** can make his or her nonmagical melee weapon or attack form equivalent to a magic weapon for purposes of hitting creatures only able to be struck with a silver or magical weapon. This effect lasts for a turn.",
      "Once per day, the paladin can Lay on Hands to any wounded character and heal 2 points of damage; add the Paladin's Charisma bonus to this figure. On each oddnumbered level (3rd, 5th, etc.) the Paladin may do this one additional time per day (so, twice per day at 3rd level, three times per day at 5th level, etc.).",
      "Starting at 7th level, the **Paladin** may choose to cure disease (as the spell) instead of providing healing as above. At 11th level, the Paladin may also substitute neutralize poison.",
      "A **Paladin** can Turn (or command) undead as if a Cleric of a level equal to half his or her own, rounded down, starting at 2nd level.",
    ],
  },
};
