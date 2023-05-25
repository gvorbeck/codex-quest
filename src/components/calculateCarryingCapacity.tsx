import { Capacity, CapacityMap } from "./types";

export default function calculateCarryingCapacity(
  strength: number,
  race: string
): Capacity {
  const capacities: CapacityMap = {
    "3": { light: 25, heavy: 60 },
    "4-5": { light: 35, heavy: 90 },
    "6-8": { light: 50, heavy: 120 },
    "9-12": { light: 60, heavy: 150 },
    "13-15": { light: 65, heavy: 165 },
    "16-17": { light: 70, heavy: 180 },
    "18": { light: 80, heavy: 195 },
  };

  const halflingCapacities: CapacityMap = {
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

  return race === "Halfling" ? halflingCapacities[range] : capacities[range];
}
