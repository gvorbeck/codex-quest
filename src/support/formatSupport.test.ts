import { calculateItemCost } from "./formatSupport";

describe("calculateItemCost", () => {
  let item = {
    costValue: 10,
    costCurrency: "gp",
    amount: 2,
    name: "foo",
    category: "bar",
  };

  test("should calculate cost for items in gold", () => {
    const result = calculateItemCost(item);
    expect(result).toBe(20);
  });

  test("should calculate cost for items in silver", () => {
    item.costCurrency = "sp";
    const result = calculateItemCost(item);
    expect(result).toBe(2);
  });

  test("should calculate cost for items in copper", () => {
    item.costCurrency = "cp";
    const result = calculateItemCost(item);
    expect(result).toBe(0.2);
  });

  test("should handle zero amount", () => {
    item.amount = 0;
    const result = calculateItemCost(item);
    expect(result).toBe(0);
  });
});
