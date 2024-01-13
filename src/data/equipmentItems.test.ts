import { AttackTypes } from "../support/stringSupport";
import equipmentItems from "./equipmentItems.json";

describe("equipmentItems", () => {
  test("every items has a unique name", () => {
    const itemNames = equipmentItems.map((item) => item.name);
    const uniqueItemNames = [...new Set(itemNames)];
    expect(itemNames.length).toBe(uniqueItemNames.length);
  });

  test("every item's `costCurrency` is either 'cp', 'sp', or 'gp'", () => {
    const currencies = equipmentItems.map((item) => item.costCurrency);
    const uniqueCurrencies = [...new Set(currencies)].sort();
    expect(uniqueCurrencies).toEqual(["cp", "gp", "sp"]);
  });

  test("every item's `costValue` are typeof 'number' greater than -1", () => {
    const values = equipmentItems.map((item) => item.costValue);
    const uniqueValues = [...new Set(values)];
    expect(uniqueValues).toEqual(
      expect.arrayContaining(
        values.filter((value) => typeof value === "number" && value > -1),
      ),
    );
  });

  test("every item's `amount` value is 1", () => {
    const amounts = equipmentItems.map((item) => item.amount);
    const uniqueAmounts = [...new Set(amounts)];
    expect(uniqueAmounts).toEqual([1]);
  });

  test("every item that has a `category` value of 'general-equipment' also has a `subCategory` property with a string value", () => {
    const generalEquipment = equipmentItems.filter(
      (item) => item.category === "general-equipment",
    );
    const subCategories = generalEquipment.map((item) => item.subCategory);
    expect(subCategories.length).toBe(generalEquipment.length);
    expect(
      subCategories.every((subCategory) => typeof subCategory === "string"),
    ).toBe(true);
  });

  test("every item that has a `size` property has a value of 'S', 'M', or 'L'", () => {
    const sizes = equipmentItems.map((item) => item.size);
    const uniqueSizes = [...new Set(sizes)].sort();
    expect(uniqueSizes).toEqual(["L", "M", "S"]);
  });

  test("every item that has a `type` property has a value of 'melee', 'missile', or 'both'", () => {
    const types = equipmentItems.map((item) => item.type);
    const uniqueTypes = [...new Set(types)].sort();
    expect(uniqueTypes).toEqual([
      AttackTypes.BOTH,
      AttackTypes.MELEE,
      AttackTypes.MISSILE,
    ]);
  });

  test("every item that has a `weight` property has a value of typeof 'number' greater than -1", () => {
    const weights = equipmentItems.map((item) => {
      if (item.weight !== undefined) {
        return item.weight;
      }
      return 0;
    });
    const uniqueWeights = [...new Set(weights)];
    expect(uniqueWeights.every((weight) => typeof weight === "number")).toBe(
      true,
    );
  });
});
