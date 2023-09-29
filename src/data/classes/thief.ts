import { DiceTypes } from "../definitions";
import { EquipmentCategories } from "../definitions";
import { ClassSetup } from "./definitions";

export const thief: ClassSetup = {
  name: "Thief",
  minimumAbilityRequirements: { dexterity: 9 },
  hitDice: DiceTypes.D4,
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
  specificEquipmentItems: [[EquipmentCategories.ARMOR], ["leather"]],
  experiencePoints: [
    0, 1250, 2500, 5000, 10000, 20000, 40000, 75000, 150000, 225000, 300000,
    375000, 450000, 525000, 600000, 675000, 750000, 825000, 900000, 975000,
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
      "Open Locks",
      "Remove Traps",
      "Pick Pockets",
      "Move Silently",
      "Climb Walls",
      "Hide",
      "Listen",
    ],
    stats: [
      [0],
      [25, 20, 30, 25, 80, 10, 30],
      [30, 25, 35, 30, 81, 15, 34],
      [35, 30, 40, 35, 82, 20, 38],
      [40, 35, 45, 40, 83, 25, 42],
      [45, 40, 50, 45, 84, 30, 46],
      [50, 45, 55, 50, 85, 35, 50],
      [55, 50, 60, 55, 86, 40, 54],
      [60, 55, 65, 60, 87, 45, 58],
      [65, 60, 70, 65, 88, 50, 62],
      [68, 63, 74, 68, 89, 53, 65],
      [71, 66, 78, 71, 90, 56, 68],
      [74, 69, 82, 74, 91, 59, 71],
      [77, 72, 86, 77, 92, 62, 74],
      [80, 75, 90, 80, 93, 65, 77],
      [83, 78, 94, 83, 94, 68, 80],
      [84, 79, 95, 85, 95, 69, 83],
      [85, 80, 96, 87, 96, 70, 86],
      [86, 81, 97, 89, 97, 71, 89],
      [87, 82, 98, 91, 98, 72, 92],
      [88, 83, 99, 93, 99, 73, 95],
    ],
  },
  details: {
    description:
      'Thieves are those who take what they want or need by stealth, disarming traps and picking locks to get to the gold they crave; or "borrowing" money from pockets, beltpouches, etc. right under the nose of the "mark" without the victim ever knowing.\n\nThieves fight better than Magic-Users but not as well as Fighters. Avoidance of honest work leads Thieves to be less hardy than the other classes, though they do pull ahead of the Magic-Users at higher levels.\n\nThe Prime Requisite for Thieves is Dexterity; a character must have a Dexterity score of 9 or higher to become a Thief. They may use any weapon, but may not wear metal armor as it interferes with stealthy activities, nor may they use shields of any sort. Leather armor is acceptable, however.\n\nThieves have a number of special abilities, described below. One turn (ten minutes) must usually be spent to use any of these abilities, as determined by the GM. The GM may choose to make any of these rolls on behalf of the player to help maintain the proper state of uncertainty. Also note that the GM may apply situational adjustments (plus or minus percentage points) as they see fit; for instance, it\'s obviously harder to climb a wall slick with slime than one that is dry, so the GM might apply a penalty of 20% for the slimy wall.',
    specials: ["**Thieves** have a number of special abilities (see table)."],
    restrictions: [
      "**Thieves** may use any weapon, but may not wear metal armor as it interferes with stealthy activities, nor may they use shields of any sort",
    ],
  },
};
