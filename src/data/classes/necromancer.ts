import { DiceTypes, EquipmentItem } from "../definitions";
import { EquipmentCategories } from "../definitions";
import { ClassSetup } from "./definitions";
import equipmentItems from "../equipmentItems.json";

export const necromancer: ClassSetup = {
  name: "Necromancer",
  minimumAbilityRequirements: { intelligence: 11, wisdom: 9 },
  hitDice: DiceTypes.D4,
  hitDiceModifier: 1,
  availableEquipmentCategories: [
    EquipmentCategories.DAGGERS,
    EquipmentCategories.GENERAL,
    EquipmentCategories.OTHERWEAPONS,
    EquipmentCategories.BEASTS,
    EquipmentCategories.BARDING,
    EquipmentCategories.IMPROVISED,
    EquipmentCategories.SWORDS,
  ],
  specificEquipmentItems: [
    [
      EquipmentCategories.OTHERWEAPONS,
      EquipmentCategories.IMPROVISED,
      EquipmentCategories.SWORDS,
    ],
    ["sickle", "scythe", "spade", "scimitar"],
  ],
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
      "(Necromancers Release 10)\n\nNecromancers are Magic-Users who practice necromancy, seeking expertise of the darker side of the arcane. Necromancers are rare due to the unsavory nature of their profession, often living in proximity to graveyards, burial mounds, and other places associated with the dead. They are sometimes known by other terms such as _Bokor_ or even _Death Master_. Regardless of what they are called or the culture they come from, they share certain traits.\n\nNecromancers are poor fighters, with fighting ability equivalent to normal Magic-Users. Likewise they are no more hardy than standard Magic-Users (d4 hit die). They may not wear armor of any sort or use shields, but unlike other Magic-Users they have expanded weapon choices. In addition to the dagger and walking staff, Necromancers can use sickles, scythes, spades, and scimitars, and they can likewise use magical weapons of those types. Otherwise, Necromancers can generally be treated as equivalent to Magic-Users for any situation not covered here.\n\nThe Prime Requisite for Necromancers is Intelligence. In addition to requiring an Intelligence score of 11 or higher, a Necromancer also must have a Wisdom score of at least 9 in order to qualify for the rigors of the class. Although not a requirement, most Necromancers do not score high in looks or Charisma. The class generally attracts those who are persecuted or otherwise disenfranchised with normal society.\n\nNecromancers produce magic much like other types of Magic-Users, but have different spell choices. They can learn spells from each other so long as the spells are available to both classes. Like other Magic-Users, a first level Necromancer begins play knowing **read magic** and one other spell of first level, recorded within a spellbook. The GM may roll for the spell, assign it as he or she sees fit, or allow the player to choose it, at his or her option.",
    specials: [
      "**Necromancers** can use sickles, scythes, spades, and scimitars",
    ],
    restrictions: [
      "**Necromancers** may not wear armor of any sort or use shields",
      "**Necromancers** may not wear armor of any sort or use shields",
    ],
  },
};
