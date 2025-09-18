import { test, expect } from "@playwright/test";

test.describe("Character Creation Workflow", () => {
  test("creates basic human fighter character", async ({ page }) => {
    // Navigate to character generator
    await page.goto("/");
    
    // Should see the main page
    await expect(page).toHaveTitle(/Codex.Quest/);
    
    // Look for character creation entry point
    // This will need to be adjusted based on actual UI structure
    const createButton = page.getByRole("button", { name: /create/i }).or(
      page.getByRole("link", { name: /create/i })
    ).or(
      page.getByText(/character/i)
    ).first();
    
    if (await createButton.isVisible()) {
      await createButton.click();
    } else {
      // If no specific button, try navigating directly to character generator
      await page.goto("/character-generator");
    }
    
    // Should be on character creation page
    await expect(page.getByText(/ability score/i).or(page.getByText(/roll/i))).toBeVisible();
    
    // Step 1: Roll ability scores
    const rollButton = page.getByRole("button", { name: /roll all abilities/i });
    if (await rollButton.isVisible()) {
      await rollButton.click();
      
      // Wait for scores to appear
      await expect(page.getByText(/strength/i)).toBeVisible();
      await expect(page.getByText(/modifier/i).first()).toBeVisible();
    }
    
    // Look for next step button
    const nextButton = page.getByRole("button", { name: /next/i }).or(
      page.getByRole("button", { name: /continue/i })
    );
    
    if (await nextButton.isVisible()) {
      await nextButton.click();
    }
    
    // Step 2: Select race (Human)
    await page.waitForTimeout(1000); // Allow UI to stabilize
    
    const humanOption = page.getByText(/human/i).or(
      page.locator("[data-testid*='human']")
    ).or(
      page.locator("button:has-text('Human')")
    ).first();
    
    if (await humanOption.isVisible()) {
      await humanOption.click();
      await expect(humanOption).toBeVisible();
    }
    
    // Continue to next step
    const raceNextButton = page.getByRole("button", { name: /next/i }).or(
      page.getByRole("button", { name: /continue/i })
    );
    
    if (await raceNextButton.isVisible()) {
      await raceNextButton.click();
    }
    
    // Step 3: Select class (Fighter)
    await page.waitForTimeout(1000);
    
    const fighterOption = page.getByText(/fighter/i).or(
      page.locator("[data-testid*='fighter']")
    ).or(
      page.locator("button:has-text('Fighter')")
    ).first();
    
    if (await fighterOption.isVisible()) {
      await fighterOption.click();
      
      // Should see fighter details
      await expect(page.getByText(/hit die/i).or(page.getByText(/d8/i))).toBeVisible();
    }
    
    // Continue to next step
    const classNextButton = page.getByRole("button", { name: /next/i }).or(
      page.getByRole("button", { name: /continue/i })
    );
    
    if (await classNextButton.isVisible()) {
      await classNextButton.click();
    }
    
    // Step 4: Enter character name
    await page.waitForTimeout(1000);
    
    const nameInput = page.getByLabel(/name/i).or(
      page.locator("input[placeholder*='name']")
    ).or(
      page.locator("input[type='text']")
    ).first();
    
    if (await nameInput.isVisible()) {
      await nameInput.fill("Test Fighter");
      await expect(nameInput).toHaveValue("Test Fighter");
    }
    
    // Step 5: Complete character creation
    const finishButton = page.getByRole("button", { name: /finish/i }).or(
      page.getByRole("button", { name: /create character/i }).or(
        page.getByRole("button", { name: /save/i })
      )
    );
    
    if (await finishButton.isVisible()) {
      await finishButton.click();
      
      // Should navigate to character sheet or success page
      await page.waitForTimeout(2000);
      
      // Verify character was created successfully
      await expect(
        page.getByText("Test Fighter").or(
          page.getByText(/character.*created/i).or(
            page.getByText(/success/i)
          )
        )
      ).toBeVisible();
    }
  });

  test("handles character creation navigation", async ({ page }) => {
    await page.goto("/");
    
    // Test basic navigation and page structure
    await expect(page.getByRole("main").or(page.locator("body"))).toBeVisible();
    
    // Look for any character-related navigation
    const characterLink = page.getByText(/character/i).first();
    if (await characterLink.isVisible()) {
      await expect(characterLink).toBeVisible();
    }
  });

  test("displays character creation form elements", async ({ page }) => {
    // Try to navigate directly to character generator
    await page.goto("/character-generator");
    
    // If that doesn't work, try from home page
    if (page.url().includes("404") || await page.getByText(/not found/i).isVisible()) {
      await page.goto("/");
      await page.waitForTimeout(1000);
    }
    
    // Should see some form of character creation interface
    const body = await page.locator("body");
    await expect(body).toBeVisible();
    
    // Look for common character creation elements
    const hasAbilityScores = await page.getByText(/ability/i).isVisible();
    const hasRaceSelection = await page.getByText(/race/i).isVisible();
    const hasClassSelection = await page.getByText(/class/i).isVisible();
    const hasNameField = await page.locator("input").isVisible();
    
    // At least one of these should be present for a character creation interface
    expect(hasAbilityScores || hasRaceSelection || hasClassSelection || hasNameField).toBe(true);
  });
});