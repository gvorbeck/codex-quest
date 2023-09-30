import { Spell } from "../data/definitions";
// import { SavingThrowsType } from "./CharacterSheet/SavingThrows/definitions";
// import { Abilities } from "./CharacterCreator/CharacterAbilities/definitions";
// import { EquipmentItem } from "./EquipmentStore/definitions";

// interface HP {
//   dice: string;
//   points: number;
//   max: number;
//   desc: string;
// }

// interface SpecialRestriction {
//   race: string[];
//   class: string[];
// }

export type Capacity = { light: number; heavy: number };
export type CapacityMap = Record<string, Capacity>;

export type SpellItem = {
  name: string;
};

export type SavingThrows = {
  deathRayOrPoison: number;
  magicWands: number;
  paralysisOrPetrify: number;
  dragonBreath: number;
  spells: number;
};
