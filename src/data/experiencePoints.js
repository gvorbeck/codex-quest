import { ClassNames } from "../components/definitions";

const magicUserAndBarbarianAndIllusionist = [
  0, 2500, 5000, 10000, 20000, 40000, 80000, 150000, 300000, 450000, 600000,
  750000, 900000, 1050000, 1200000, 1350000, 1500000, 1650000, 1800000, 1950000,
];

const clericAndDruid = [
  0, 1500, 3000, 6000, 12000, 24000, 48000, 90000, 180000, 270000, 360000,
  450000, 540000, 630000, 720000, 810000, 900000, 990000, 1080000, 1170000,
];

export const levelRequirements = {
  [ClassNames.ASSASSIN]: [
    0, 1375, 2750, 5500, 11000, 22000, 44000, 82500, 165000, 247500, 330000,
    412500, 495000, 577500, 660000, 742500, 825000, 907500, 990000, 1072500,
  ],
  [ClassNames.CLERIC]: clericAndDruid,
  [ClassNames.DRUID]: clericAndDruid,
  [ClassNames.FIGHTER]: [
    0, 2000, 4000, 8000, 16000, 32000, 64000, 120000, 240000, 360000, 480000,
    600000, 720000, 840000, 960000, 1080000, 1200000, 1320000, 1440000, 1560000,
  ],
  [ClassNames.MAGICUSER]: magicUserAndBarbarianAndIllusionist,
  [ClassNames.BARBARIAN]: magicUserAndBarbarianAndIllusionist,
  [ClassNames.ILLUSIONIST]: magicUserAndBarbarianAndIllusionist,
  [ClassNames.THIEF]: [
    0, 1250, 2500, 5000, 10000, 20000, 40000, 75000, 150000, 225000, 300000,
    375000, 450000, 525000, 600000, 675000, 750000, 825000, 900000, 975000,
  ],
};