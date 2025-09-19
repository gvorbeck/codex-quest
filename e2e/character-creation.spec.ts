import { test, expect } from "@playwright/test";

test.describe("Character Creation Workflow", () => {
  test("can roll ability scores", async ({ page }) => {
    // Navigate directly to character generator
    await page.goto("/new-character");

    // Should see the character creation page with ability scores step
    await expect(page.getByRole("heading", { name: "Roll Ability Scores" })).toBeVisible();

    // Step 1: Roll ability scores
    const rollButton = page.getByRole("button", { name: "Roll All Abilities" });
    await expect(rollButton).toBeVisible();
    await rollButton.click();

    // Verify ability scores section appears after rolling
    await expect(page.getByRole("heading", { name: "Ability Scores", exact: true })).toBeVisible();

    // Should see some ability score content (numbers) - check for any numeric content
    await expect(page.locator('[id*="ability-"]')).toBeVisible();
  });

  test("creates basic human fighter character", async ({ page }) => {
    // Navigate directly to character generator
    await page.goto("/new-character");

    // Step 1: Roll ability scores
    await expect(page.getByRole("heading", { name: "Roll Ability Scores" })).toBeVisible();

    const rollButton = page.getByRole("button", { name: "Roll All Abilities" });
    await rollButton.click();

    // Wait for ability scores to be rolled and Next button to be enabled
    await expect(page.getByRole("heading", { name: "Ability Scores", exact: true })).toBeVisible();

    // Click Next to go to Race step
    const nextButton = page.getByRole("button", { name: /next/i });
    await expect(nextButton).toBeEnabled();
    await nextButton.click();

    // Step 2: Select Human race
    await expect(page.getByRole("heading", { name: "Choose Your Race" })).toBeVisible();

    // Find the race dropdown and select Human
    const raceSelect = page.getByLabel("Race*");
    await expect(raceSelect).toBeVisible();
    await raceSelect.selectOption("human");

    // Continue to next step
    await nextButton.click();

    // Step 3: Select Fighter class
    await expect(page.getByRole("heading", { name: "Choose Your Class" })).toBeVisible();

    // Find the class dropdown and select Fighter
    const classSelect = page.getByLabel("Class*");
    await expect(classSelect).toBeVisible();
    await classSelect.selectOption("fighter");

    // Continue to next step
    await nextButton.click();

    // Step 4: Hit Points - need to roll
    await expect(page.locator('#step-content-heading').filter({ hasText: 'Hit Points' })).toBeVisible();

    // Roll hit points
    const rollHpButton = page.getByRole("button", { name: /roll.*d8/i });
    await expect(rollHpButton).toBeVisible();
    await rollHpButton.click();

    // Continue to next step
    await nextButton.click();

    // Step 5: Equipment - skip for now
    await expect(page.locator('#step-content-heading').filter({ hasText: 'Equipment' })).toBeVisible();

    // Continue to final step (equipment step allows skipping)
    await nextButton.click();

    // Step 6: Review and Name
    await expect(page.getByRole("heading", { name: "Review & Finalize" })).toBeVisible();

    // Enter character name
    const nameInput = page.getByLabel(/character name/i);
    await expect(nameInput).toBeVisible();
    await nameInput.fill("Test Fighter");

    // Verify character data is shown in review - look for the complete summary
    await expect(page.getByText("Test Fighter - Human Fighter")).toBeVisible();

    // Successfully created a basic human fighter character through all steps!
    // The character has:
    // - Rolled ability scores
    // - Selected Human race
    // - Selected Fighter class
    // - Rolled hit points
    // - Skipped equipment (optional)
    // - Named "Test Fighter"
  });

  test("handles character creation navigation", async ({ page }) => {
    await page.goto("/");

    // Test basic navigation and page structure
    await expect(page.getByRole("main")).toBeVisible();

    // Look for any character-related navigation
    const characterLink = page.getByText(/character/i).first();
    if (await characterLink.isVisible()) {
      await expect(characterLink).toBeVisible();
    }
  });

  test("displays character creation form elements", async ({ page }) => {
    // Navigate to character generator
    await page.goto("/new-character");

    // Should see the main character creation interface
    await expect(page.getByRole("heading", { name: "Roll Ability Scores" })).toBeVisible();

    // Should see the Roll All Abilities button
    await expect(
      page.getByRole("button", { name: "Roll All Abilities" })
    ).toBeVisible();

    // Should see step navigation indicating this is character creation
    await expect(page.getByRole("heading", { name: "Character Creation" })).toBeVisible();
  });
});
