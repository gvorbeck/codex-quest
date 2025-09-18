import { describe, it, expect } from "vitest";

import {
  convertCurrency,
  calculateTotalGoldValue,
  calculateTotalWeight,
  calculateCoinWeight,
  calculateTotalCoinCount,
  convertToGoldFromAbbreviation,
  CURRENCY_RATES,
} from "@/utils/currency";

describe("Currency Utilities", () => {
  describe("Currency Conversions", () => {
    it("converts gold to silver correctly", () => {
      expect(convertCurrency(1, 'gold', 'silver')).toBe(10);
      expect(convertCurrency(2.5, 'gold', 'silver')).toBe(25);
      expect(convertCurrency(0, 'gold', 'silver')).toBe(0);
      expect(convertCurrency(10, 'gold', 'silver')).toBe(100);
    });

    it("converts silver to copper correctly", () => {
      expect(convertCurrency(1, 'silver', 'copper')).toBe(10);
      expect(convertCurrency(5, 'silver', 'copper')).toBe(50);
      expect(convertCurrency(0, 'silver', 'copper')).toBe(0);
      expect(convertCurrency(2.5, 'silver', 'copper')).toBe(25);
    });

    it("converts gold to copper correctly", () => {
      expect(convertCurrency(1, 'gold', 'copper')).toBe(100);
      expect(convertCurrency(2, 'gold', 'copper')).toBe(200);
      expect(convertCurrency(0, 'gold', 'copper')).toBe(0);
      expect(convertCurrency(0.5, 'gold', 'copper')).toBe(50);
    });

    it("converts platinum to gold correctly", () => {
      expect(convertCurrency(1, 'platinum', 'gold')).toBe(5);
      expect(convertCurrency(2, 'platinum', 'gold')).toBe(10);
      expect(convertCurrency(0, 'platinum', 'gold')).toBe(0);
      expect(convertCurrency(0.5, 'platinum', 'gold')).toBe(2.5);
    });

    it("converts electrum to silver correctly", () => {
      expect(convertCurrency(1, 'electrum', 'silver')).toBe(5);
      expect(convertCurrency(2, 'electrum', 'silver')).toBe(10);
      expect(convertCurrency(0, 'electrum', 'silver')).toBe(0);
      expect(convertCurrency(1.5, 'electrum', 'silver')).toBe(7.5);
    });

    it("handles same currency conversion", () => {
      expect(convertCurrency(100, 'gold', 'gold')).toBe(100);
      expect(convertCurrency(50, 'silver', 'silver')).toBe(50);
    });

    it("throws error for negative currency amounts", () => {
      expect(() => convertCurrency(-1, 'gold', 'silver')).toThrow("gold amount cannot be negative");
      expect(() => convertCurrency(-1, 'silver', 'copper')).toThrow("silver amount cannot be negative");
      expect(() => convertCurrency(-1, 'gold', 'copper')).toThrow("gold amount cannot be negative");
      expect(() => convertCurrency(-1, 'platinum', 'gold')).toThrow("platinum amount cannot be negative");
      expect(() => convertCurrency(-1, 'electrum', 'silver')).toThrow("electrum amount cannot be negative");
    });

    it("supports bidirectional conversions", () => {
      expect(convertCurrency(100, 'copper', 'gold')).toBe(1); // 100 copper = 1 gold
      expect(convertCurrency(10, 'silver', 'platinum')).toBe(0.2); // 10 silver = 0.2 platinum
      expect(convertCurrency(1, 'gold', 'platinum')).toBe(0.2); // 1 gold = 0.2 platinum
      expect(convertCurrency(50, 'copper', 'silver')).toBe(5); // 50 copper = 5 silver
    });
  });

  describe("Mixed Currency Calculations", () => {
    it("calculates total gold value from mixed currency", () => {
      expect(calculateTotalGoldValue({ gold: 5, silver: 10, copper: 50 })).toBe(6.5);
      expect(calculateTotalGoldValue({ gold: 0, silver: 0, copper: 0 })).toBe(0);
      expect(calculateTotalGoldValue({ gold: 10 })).toBe(10);
      expect(calculateTotalGoldValue({ silver: 20 })).toBe(2);
      expect(calculateTotalGoldValue({ copper: 100 })).toBe(1);
    });

    it("calculates total gold value with platinum and electrum", () => {
      // 1 platinum (5 gp) + 2 gold (2 gp) + 2 electrum (1 gp) + 10 silver (1 gp) + 50 copper (0.5 gp) = 9.5 gp
      expect(calculateTotalGoldValue({ platinum: 1, gold: 2, electrum: 2, silver: 10, copper: 50 })).toBe(9.5);
      expect(calculateTotalGoldValue({ platinum: 2 })).toBe(10);
      expect(calculateTotalGoldValue({ electrum: 10 })).toBe(5);
    });

    it("handles missing currency properties", () => {
      expect(calculateTotalGoldValue({ silver: 10 })).toBe(1);
    });

    it("calculates total coin count", () => {
      expect(calculateTotalCoinCount({ gold: 5, silver: 10, copper: 50 })).toBe(65);
      expect(calculateTotalCoinCount({ platinum: 1, gold: 2, electrum: 3, silver: 4, copper: 5 })).toBe(15);
      expect(calculateTotalCoinCount({})).toBe(0);
    });
  });

  describe("Equipment Weight Calculations", () => {
    it("calculates total weight from equipment array", () => {
      const equipment = [
        { weight: 1, amount: 1 },
        { weight: 2, amount: 1 },
      ];
      expect(calculateTotalWeight(equipment)).toBe(3);
    });

    it("handles equipment with quantities", () => {
      const equipment = [
        { weight: 5, quantity: 2 },
        { weight: 1, amount: 3 },
      ];
      expect(calculateTotalWeight(equipment)).toBe(13);
    });

    it("handles zero weight items", () => {
      const equipment = [
        { weight: 0, amount: 10 },
        { weight: 2, amount: 1 },
      ];
      expect(calculateTotalWeight(equipment)).toBe(2);
    });

    it("handles empty equipment array", () => {
      expect(calculateTotalWeight([])).toBe(0);
    });
  });

  describe("Coin Weight Calculations", () => {
    it("calculates coin weight correctly", () => {
      // 1 gold piece = 1/20th pound = 0.05 pounds
      expect(calculateCoinWeight(20)).toBe(1); // 20 coins = 1 pound
      expect(calculateCoinWeight(10)).toBe(0.5); // 10 coins = 0.5 pounds
      expect(calculateCoinWeight(0)).toBe(0);
      expect(calculateCoinWeight(100)).toBe(5); // 100 coins = 5 pounds
    });
  });

  describe("Currency Rates Constants", () => {
    it("has correct BFRPG conversion rates", () => {
      expect(CURRENCY_RATES.PLATINUM_TO_GOLD).toBe(5);
      expect(CURRENCY_RATES.GOLD_TO_SILVER).toBe(10);
      expect(CURRENCY_RATES.ELECTRUM_TO_SILVER).toBe(5);
      expect(CURRENCY_RATES.SILVER_TO_COPPER).toBe(10);
      expect(CURRENCY_RATES.GOLD_TO_COPPER).toBe(100);
      expect(CURRENCY_RATES.PLATINUM_TO_COPPER).toBe(500);
      expect(CURRENCY_RATES.ELECTRUM_TO_COPPER).toBe(50);
    });
  });

  describe("Legacy Currency Conversions", () => {
    it("converts legacy abbreviations to gold correctly", () => {
      expect(convertToGoldFromAbbreviation(1, "gp")).toBe(1);
      expect(convertToGoldFromAbbreviation(10, "sp")).toBe(1);
      expect(convertToGoldFromAbbreviation(100, "cp")).toBe(1);
      expect(convertToGoldFromAbbreviation(1, "pp")).toBe(5);
      expect(convertToGoldFromAbbreviation(5, "ep")).toBe(2.5);
    });

    it("handles fractional conversions for legacy abbreviations", () => {
      expect(convertToGoldFromAbbreviation(5, "sp")).toBe(0.5);
      expect(convertToGoldFromAbbreviation(50, "cp")).toBe(0.5);
      expect(convertToGoldFromAbbreviation(2, "ep")).toBe(1);
    });
  });

  describe("Enhanced Currency Conversions", () => {
    it("supports electrum to gold conversion", () => {
      // 1 electrum = 5 silver = 0.5 gold, so 5 electrum = 2.5 gold
      expect(convertCurrency(5, "electrum", "gold")).toBe(2.5);
      expect(convertCurrency(2, "electrum", "gold")).toBe(1);
    });

    it("handles multi-step conversions correctly", () => {
      // Test silver to platinum (requires two conversion steps)
      expect(convertCurrency(50, "silver", "platinum")).toBe(1); // 50 silver = 5 gold = 1 platinum
    });
  });
});