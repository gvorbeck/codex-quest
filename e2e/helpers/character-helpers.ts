// Placeholder for E2E test helpers
// Reusable functions for character creation flows, form interactions, etc.

import type { Page } from "@playwright/test";

export async function createBasicCharacter(page: Page, name: string) {
  // Character creation helper will be implemented in Phase 2
  await page.waitForTimeout(1); // Placeholder to use parameters
  void name; // Acknowledge parameter usage
}

export async function navigateToCharacterGenerator(page: Page) {
  // Navigation helper will be implemented in Phase 2
  await page.waitForTimeout(1); // Placeholder to use parameter
}