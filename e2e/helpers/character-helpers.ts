// E2E test helpers for character creation flows and form interactions
import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

/**
 * Navigate to the character generator page
 */
export async function navigateToCharacterGenerator(page: Page) {
  await page.goto("/");

  // Try to find character creation entry point
  const createButton = page
    .getByRole("button", { name: /create/i })
    .or(page.getByRole("link", { name: /create/i }))
    .or(page.getByText(/character/i))
    .first();

  if (await createButton.isVisible()) {
    await createButton.click();
  } else {
    // Navigate directly to character generator
    await page.goto("/character-generator");
  }

  // Wait for character creation interface to load
  await expect(
    page.getByText(/ability score/i)
      .or(page.getByText(/roll/i))
      .or(page.getByText(/character/i))
  ).toBeVisible();
}

/**
 * Roll ability scores in the character creation flow
 */
export async function rollAbilityScores(page: Page) {
  const rollButton = page.getByRole("button", {
    name: /roll all abilities/i,
  });

  if (await rollButton.isVisible()) {
    await rollButton.click();

    // Wait for scores to appear
    await expect(page.getByText(/strength/i)).toBeVisible();
    await expect(page.getByText(/modifier/i).first()).toBeVisible();
  }
}

/**
 * Select a race during character creation
 */
export async function selectRace(page: Page, raceName: string) {
  // Wait for race selection interface
  await expect(page.getByText(/race/i)).toBeVisible();

  const raceOption = page
    .getByText(new RegExp(raceName, "i"))
    .or(page.locator(`[data-testid*='${raceName.toLowerCase()}']`))
    .or(page.locator(`button:has-text('${raceName}')`))
    .first();

  if (await raceOption.isVisible()) {
    await raceOption.click();
    await expect(raceOption).toBeVisible();
  }
}

/**
 * Select a class during character creation
 */
export async function selectClass(page: Page, className: string) {
  // Wait for class selection interface
  await expect(page.getByText(/class/i)).toBeVisible();

  const classOption = page
    .getByText(new RegExp(className, "i"))
    .or(page.locator(`[data-testid*='${className.toLowerCase()}']`))
    .or(page.locator(`button:has-text('${className}')`))
    .first();

  if (await classOption.isVisible()) {
    await classOption.click();

    // Verify class details appear (like hit die for fighters)
    if (className.toLowerCase() === "fighter") {
      await expect(
        page.getByText(/hit die/i).or(page.getByText(/d8/i))
      ).toBeVisible();
    }
  }
}

/**
 * Enter character name
 */
export async function enterCharacterName(page: Page, name: string) {
  // Wait for name input field
  await expect(page.getByText(/name/i)).toBeVisible();

  const nameInput = page
    .getByLabel(/name/i)
    .or(page.locator("input[placeholder*='name']"))
    .or(page.locator("input[type='text']"))
    .first();

  if (await nameInput.isVisible()) {
    await nameInput.fill(name);
    await expect(nameInput).toHaveValue(name);
  }
}

/**
 * Navigate to next step in character creation
 */
export async function goToNextStep(page: Page) {
  const nextButton = page
    .getByRole("button", { name: /next/i })
    .or(page.getByRole("button", { name: /continue/i }));

  if (await nextButton.isVisible()) {
    await nextButton.click();
    await page.waitForTimeout(500); // Allow UI to transition
  }
}

/**
 * Complete character creation
 */
export async function finishCharacterCreation(page: Page) {
  const finishButton = page
    .getByRole("button", { name: /finish/i })
    .or(page.getByRole("button", { name: /create character/i }))
    .or(page.getByRole("button", { name: /save/i }));

  if (await finishButton.isVisible()) {
    await finishButton.click();

    // Wait for completion - look for success indicators
    await expect(
      page.getByText(/character.*created/i)
        .or(page.getByText(/success/i))
        .or(page.getByText(/character.*sheet/i))
    ).toBeVisible({ timeout: 10000 });
  }
}

/**
 * Complete basic character creation flow
 */
export async function createBasicCharacter(
  page: Page,
  name: string,
  race: string = "Human",
  characterClass: string = "Fighter"
) {
  await navigateToCharacterGenerator(page);

  // Step 1: Roll ability scores
  await rollAbilityScores(page);
  await goToNextStep(page);

  // Step 2: Select race
  await selectRace(page, race);
  await goToNextStep(page);

  // Step 3: Select class
  await selectClass(page, characterClass);
  await goToNextStep(page);

  // Step 4: Enter name
  await enterCharacterName(page, name);

  // Step 5: Complete creation
  await finishCharacterCreation(page);

  // Verify character was created successfully
  await expect(
    page.getByText(name)
      .or(page.getByText(/character.*created/i))
      .or(page.getByText(/success/i))
  ).toBeVisible();
}

/**
 * Navigate to equipment selection
 */
export async function navigateToEquipment(page: Page) {
  const equipmentLink = page
    .getByText(/equipment/i)
    .or(page.getByText(/gear/i))
    .or(page.getByText(/items/i))
    .first();

  if (await equipmentLink.isVisible()) {
    await equipmentLink.click();
  } else {
    await page.goto("/equipment");
  }

  // Wait for equipment interface to load
  await expect(
    page.getByText(/equipment/i)
      .or(page.getByText(/gear/i))
      .or(page.getByText(/items/i))
  ).toBeVisible();
}

/**
 * Add equipment item
 */
export async function addEquipmentItem(page: Page, itemName: string) {
  const addButton = page
    .getByRole("button", { name: /add/i })
    .or(page.getByText(/add item/i))
    .or(page.getByText(/add equipment/i))
    .first();

  if (await addButton.isVisible()) {
    await addButton.click();

    // Wait for equipment selection interface
    await expect(
      page.getByText(/select/i)
        .or(page.getByText(/choose/i))
        .or(page.getByText(/weapon/i))
        .or(page.locator("[role='dialog']"))
    ).toBeVisible();

    // Find and select the item
    const item = page.getByText(new RegExp(itemName, "i")).first();
    if (await item.isVisible()) {
      await item.click();

      // Verify item was added
      await expect(page.getByText(new RegExp(itemName, "i"))).toBeVisible();
    }
  }
}

/**
 * Wait for responsive viewport change
 */
export async function setResponsiveViewport(page: Page, width: number, height: number) {
  await page.setViewportSize({ width, height });
  await expect(page.locator("body")).toBeVisible();
}
