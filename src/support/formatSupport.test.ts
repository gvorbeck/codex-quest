import { RaceNames } from "../data/definitions";
import { getItemCost, getCarryingCapacity } from "./formatSupport";

describe("getItemCost", () => {
  let item = {
    costValue: 10,
    costCurrency: "gp",
    amount: 2,
    name: "foo",
    category: "bar",
  };

  test("should calculate cost for items in gold", () => {
    expect(getItemCost(item)).toBe(20);
  });

  test("should calculate cost for items in silver", () => {
    item.costCurrency = "sp";
    expect(getItemCost(item)).toBe(2);
  });

  test("should calculate cost for items in copper", () => {
    item.costCurrency = "cp";
    expect(getItemCost(item)).toBe(0.2);
  });

  test("should handle zero amount", () => {
    item.amount = 0;
    expect(getItemCost(item)).toBe(0);
  });
});

describe("getCarryingCapacity", () => {
  test("should return a capacity object", () => {
    expect(getCarryingCapacity(3, RaceNames.ELF)).toEqual({
      heavy: 60,
      light: 25,
    });
  });

  test("should return a capacity object", () => {
    expect(getCarryingCapacity(5, RaceNames.ELF)).toEqual({
      heavy: 90,
      light: 35,
    });
  });

  test("should return a capacity object", () => {
    expect(getCarryingCapacity(8, RaceNames.ELF)).toEqual({
      heavy: 120,
      light: 50,
    });
  });

  test("should return a capacity object", () => {
    expect(getCarryingCapacity(12, RaceNames.ELF)).toEqual({
      heavy: 150,
      light: 60,
    });
  });

  test("should return a capacity object", () => {
    expect(getCarryingCapacity(15, RaceNames.ELF)).toEqual({
      heavy: 165,
      light: 65,
    });
  });

  test("should return a capacity object", () => {
    expect(getCarryingCapacity(17, RaceNames.ELF)).toEqual({
      heavy: 180,
      light: 70,
    });
  });

  test("should return a capacity object", () => {
    expect(getCarryingCapacity(18, RaceNames.ELF)).toEqual({
      heavy: 195,
      light: 80,
    });
  });

  test("should return a smaller capacity object for a race with `hasLowCapacities`", () => {
    expect(getCarryingCapacity(5, RaceNames.GNOME)).toEqual({
      heavy: 60,
      light: 30,
    });
  });
});
