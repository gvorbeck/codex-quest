import { EquipmentCategories } from "../definitions";
import { ClassSetup } from "./definitions";
import { DiceTypes } from "../definitions";

export const assassin: ClassSetup = {
  name: "Assassin",
  minimumAbilityRequirements: { dexterity: 9, intelligence: 9 },
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
    0, 1375, 2750, 5500, 11000, 22000, 44000, 82500, 165000, 247500, 330000,
    412500, 495000, 577500, 660000, 742500, 825000, 907500, 990000, 1072500,
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
      "Pick Pockets",
      "Move Silently",
      "Climb Walls",
      "Hide",
      "Listen",
      "Poison",
    ],
    stats: [
      [0],
      [15, 20, 20, 70, 5, 25, 25],
      [19, 25, 25, 72, 10, 29, 30],
      [23, 30, 30, 74, 15, 33, 35],
      [27, 35, 35, 76, 20, 37, 40],
      [31, 40, 40, 78, 25, 41, 45],
      [35, 45, 45, 80, 30, 45, 50],
      [39, 50, 50, 82, 35, 49, 55],
      [43, 55, 55, 84, 40, 53, 60],
      [47, 60, 60, 86, 45, 57, 65],
      [50, 63, 63, 87, 48, 60, 69],
      [53, 66, 66, 88, 51, 63, 73],
      [56, 69, 69, 89, 54, 66, 77],
      [59, 72, 72, 90, 57, 69, 81],
      [62, 75, 75, 91, 60, 72, 85],
      [65, 78, 78, 92, 63, 75, 89],
      [66, 79, 80, 93, 64, 77, 91],
      [67, 80, 82, 94, 65, 79, 93],
      [68, 81, 84, 95, 66, 81, 95],
      [69, 82, 86, 96, 67, 83, 97],
      [70, 83, 88, 97, 68, 85, 99],
    ],
  },
  details: {
    description:
      "(Assassins Release 6)\n\nThere are those who make their living dealing death from the shadows. These people are called assassins. Most are trained by secret guilds or societies; civilized lands generally forbid and destroy such organizations.\n\nAssassins must abide by the same weapon and armor restrictions as Thieves, and use the same attack bonuses and saving throws. A prospective Assassin must have a minimum Dexterity and Intelligence of 9 each. Only humans may become Assassins.\n\nAssassins have several special abilities, as listed on the table below. Some abilities are shared with the Thief class, and are described in the Basic Fantasy RPG Core Rules. Those abilities special to the Assassin class are as follows:\n\n**Poison**: Assassins learn the art of making lethal poisons. Poisons are often quite expensive to make; it is not uncommon for a single application of contact poison to cost 500 gp or more. The GM is advised to take care that poison does not become too much of an easy solution for the Assassin.\n\n**Assassinate**: This is the Assassin's primary special ability. As with the Thief's Sneak Attack ability, any time an Assassin is behind an opponent in melee and it is reasonably likely the opponent doesn't know they are there, an attempt to assassinate may be made. The attack must be carried out with a one-handed piercing weapon, such as a dagger or sword. The attack is rolled at an attack bonus of +4, and if the attack hits, the victim must roll a saving throw vs. Death Ray or be instantly killed. If this saving throw is a success, the victim still suffers normal weapon damage. At the GM's option, characters two or more levels lower than the Assassin may be denied a saving throw.\n\n**Waylay**: An Assassin can attempt to knock out an opponent in a single strike. This is performed in much the same way as the Assassinate ability, but the Assassin must be using a weapon that does subduing damage normally (i.e. a club or cudgel). The attack is rolled at a +4 attack bonus; if the Assassin hits, the victim must make a saving throw vs. Death Ray or be knocked unconscious. If this roll is made, the victim still suffers normal subduing damage. Creatures knocked unconscious by a Waylay attack will remain that way for 2d8 turns if not awakened.\n\nNote that bounty hunters are often Assassins, who use the Waylay ability in the course of their (more or less) lawful activities.",
    specials: [
      "**Assassins** have several special abilities (see table). Some abilities are shared with the Thief class, and are described in the Core Rules.",
      "**Poison**: Assassins learn the art of making lethal poisons. Poisons are often quite expensive to make; it is not uncommon for a single application of contact poison to cost 500 gp or more. The GM is advised to take care that poison does not become too much of an easy solution for the Assassin.",
      "**Assassinate**: This is the Assassin's primary special ability. As with the Thief's Sneak Attack ability, any time an Assassin is behind an opponent in melee and it is reasonably likely the opponent doesn't know he or she is there, an attempt to assassinate may be made. The attack must be carried out with a one-handed piercing weapon, such as a dagger or sword. The attack is rolled at an attack bonus of +4, and if the attack hits, the victim must roll a saving throw vs. Death Ray or be instantly killed. If this saving throw is a success, the victim still suffers normal weapon damage. At the GM's option, characters two or more levels lower than the Assassin may be denied a saving throw.",
      "**Waylay**: An Assassin can attempt to knock out an opponent in a single strike. This is performed in much the same way as the Assassinate ability, but the Assassin must be using a weapon that does subduing damage normally (i.e. a club or cudgel). The attack is rolled at a +4 attack bonus; if the Assassin hits, the victim must make a saving throw vs. Death Ray or be knocked unconscious. If this roll is made, the victim still suffers normal subduing damage. Creatures knocked unconscious by a Waylay attack will remain that way for 2d8 turns if not awakened.\n\nNote that bounty hunters are often Assassins, who use the Waylay ability in the course of their (more or less) lawful activities.",
    ],
    restrictions: [
      "**Assassins** may use any weapon, but may not wear metal armor as it interferes with stealthy activities, nor may they use shields of any sort.",
      "Only humans may become **Assassins**.",
    ],
  },
};
