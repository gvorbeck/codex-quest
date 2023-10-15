// import { Capacity, CapacityMap } from "../components/definitions";
import { CharacterData, EquipmentItem, RaceNames } from "../data/definitions";
import { races } from "../data/races";

type Capacity = { light: number; heavy: number };
type CapacityMap = Record<string, Capacity>;

export const getItemCost = (item: EquipmentItem) => {
  let cost = item.costValue;
  if (item.costCurrency === "sp") cost *= 0.1;
  if (item.costCurrency === "cp") cost *= 0.01;
  return cost * item.amount;
};

export const getCarryingCapacity = (
  strength: number,
  race: RaceNames
): Capacity => {
  const capacities: CapacityMap = {
    "3": { light: 25, heavy: 60 },
    "4-5": { light: 35, heavy: 90 },
    "6-8": { light: 50, heavy: 120 },
    "9-12": { light: 60, heavy: 150 },
    "13-15": { light: 65, heavy: 165 },
    "16-17": { light: 70, heavy: 180 },
    "18": { light: 80, heavy: 195 },
  };

  const lowCapacities: CapacityMap = {
    "3": { light: 20, heavy: 40 },
    "4-5": { light: 30, heavy: 60 },
    "6-8": { light: 40, heavy: 80 },
    "9-12": { light: 50, heavy: 100 },
    "13-15": { light: 55, heavy: 110 },
    "16-17": { light: 60, heavy: 120 },
    "18": { light: 65, heavy: 130 },
  };

  let range = "";

  if (strength === 3) {
    range = "3";
  } else if (strength >= 4 && strength <= 5) {
    range = "4-5";
  } else if (strength >= 6 && strength <= 8) {
    range = "6-8";
  } else if (strength >= 9 && strength <= 12) {
    range = "9-12";
  } else if (strength >= 13 && strength <= 15) {
    range = "13-15";
  } else if (strength >= 16 && strength <= 17) {
    range = "16-17";
  } else if (strength === 18) {
    range = "18";
  }

  return races[race]?.hasLowCapacity ? lowCapacities[range] : capacities[range];
};

export function makeChange(characterData: CharacterData) {
  if (characterData) {
    let copper = characterData.gold * 100;
    let goldPieces = Math.floor(copper / 100);
    copper %= 100;
    let silverPieces = Math.floor(copper / 10);
    copper %= 10;
    let copperPieces = copper;

    return {
      gp: Math.round(goldPieces),
      sp: Math.round(silverPieces),
      cp: Math.round(copperPieces),
    };
  } else {
    // default object when characterData is null/undefined
    return { gp: 0, sp: 0, cp: 0 };
  }
}
