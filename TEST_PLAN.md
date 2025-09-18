# Testing Implementation Plan

**BFRPG Character Generator - Comprehensive Testing Strategy**

## **Overview**

This document outlines our two-layer testing approach for the character creation system, combining fast unit/integration tests with visual end-to-end validation.

## **Testing Architecture**

### **Layer 1: Vitest + React Testing Library**

- **Purpose**: Business logic, utility functions, component behavior
- **Speed**: Very fast (milliseconds) - runs during development
- **Scope**: Character validation, spell calculations, currency conversions, component interactions
- **Mocking**: Heavy Firebase mocking for isolated testing

### **Layer 2: Playwright End-to-End**

- **Purpose**: Full user workflows with visual confirmation
- **Speed**: Slower (seconds) but comprehensive - runs before deployment
- **Scope**: Complete character creation wizard, button clicks, form flows
- **Mocking**: Minimal - tests real integrations with mock Firebase mode

## **Implementation Strategy**

### **Phase 1: Setup & Configuration (1 hour)**

**Install Dependencies:**

```bash
# Unit/Integration testing
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event

# E2E visual testing
npm install -D @playwright/test
npx playwright install
```

**Project Structure:**

```
src/
├── __tests__/              # Vitest unit tests
│   ├── utils/
│   │   ├── character.test.ts
│   │   ├── currency.test.ts
│   │   └── validation.test.ts
│   └── components/
│       ├── AbilityScoreStep.test.tsx
│       └── RaceStep.test.tsx
├── test/
│   ├── setup.ts            # Vitest setup & global mocks
│   └── mocks/
│       ├── firebase.ts     # Firebase service mocking
│       └── character-data.ts
└── e2e/                    # Playwright tests
    ├── character-creation.spec.ts
    ├── equipment-selection.spec.ts
    └── helpers/
        └── character-helpers.ts
```

### **Phase 2: Proof of Concept Implementation (3-4 hours)**

We'll implement a focused set of tests to demonstrate both testing approaches working together.

#### **Vitest Tests (Business Logic & Components)**

**Target Files for Unit Testing:**

1. `src/utils/currency.ts` - Currency conversion logic
2. `src/utils/character.ts` - Character validation helpers
3. `src/components/features/character/creation/AbilityScoreStep.tsx` - Stats rolling component

**Example Test Structure:**

```typescript
// src/__tests__/utils/currency.test.ts - PROOF OF CONCEPT
describe("Currency Utilities", () => {
  it("converts gold to silver correctly", () => {
    expect(goldToSilver(1)).toBe(10);
    expect(goldToSilver(2.5)).toBe(25);
  });

  it("calculates total weight from equipment", () => {
    const equipment = [
      { name: "Sword", weight: 3, quantity: 1 },
      { name: "Shield", weight: 5, quantity: 1 },
    ];
    expect(calculateTotalWeight(equipment)).toBe(8);
  });
});
```

#### **Playwright Tests (Visual User Flows)**

**Target Flows for E2E Testing:**

1. **Basic Character Creation** - Race selection → Class selection → Name → Save
2. **Equipment Selection** - Add items, see weight/cost update visually
3. **Stat Rolling** - Click roll button, verify numbers appear

**Example E2E Test:**

```typescript
// e2e/character-creation.spec.ts - PROOF OF CONCEPT
test("creates basic human fighter", async ({ page }) => {
  await page.goto("/character-generator");

  // Visual confirmation of race selection
  await page.getByTestId("race-human").click();
  await expect(page.getByText("Human")).toBeVisible();

  // Visual confirmation of class selection
  await page.getByTestId("next-step").click();
  await page.getByTestId("class-fighter").click();
  await expect(page.getByText("Hit Die: d8")).toBeVisible();

  // Visual confirmation of character creation
  await page.getByTestId("character-name").fill("Test Fighter");
  await page.getByTestId("finish-character").click();

  // Verify character was created and displays correctly
  await expect(page).toHaveURL(/\/character-sheet/);
  await expect(page.getByText("Test Fighter")).toBeVisible();
});
```

## **Proof of Concept File List**

### **Phase 2A: Vitest Setup & Unit Tests (2 hours)**

**Files to Create:**

1. `vitest.config.ts` - Vitest configuration with path aliases
2. `src/test/setup.ts` - Global test setup and mocks
3. `src/__tests__/utils/currency.test.ts` - Currency calculation tests
4. `src/__tests__/utils/character.test.ts` - Character helper function tests
5. `src/__tests__/components/AbilityScoreStep.test.tsx` - Component interaction test

**Files to Examine for Testing:**

- `src/utils/currency.ts` - Already has testable pure functions
- `src/utils/character.ts` - Character validation and helper functions
- `src/components/features/character/creation/AbilityScoreStep.tsx` - Interactive component

### **Phase 2B: Playwright Setup & E2E Tests (2 hours)**

**Files to Create:**

1. `playwright.config.ts` - Playwright configuration
2. `e2e/character-creation.spec.ts` - Basic character creation flow
3. `e2e/equipment-selection.spec.ts` - Equipment interaction testing
4. `e2e/helpers/character-helpers.ts` - Reusable E2E test helpers

**Target User Flows:**

- **Race/Class Selection Flow** - Basic wizard navigation with visual feedback
- **Equipment Selection Flow** - Add items and see cost/weight updates
- **Character Save Flow** - Complete character creation and verify persistence

## **Configuration Files**

### **vitest.config.ts**

```typescript
import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
```

### **playwright.config.ts**

```typescript
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run dev",
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
});
```

## **Expected Outcomes**

After implementing this proof of concept, you'll be able to:

### **Vitest Outcomes**

- ✅ Run `npm run test` to see fast unit tests
- ✅ Test business logic without UI complexity
- ✅ See immediate feedback during development
- ✅ Mock Firebase for isolated testing

### **Playwright Outcomes**

- ✅ Run `npx playwright test --ui` to see visual test execution
- ✅ Watch character creation wizard run automatically
- ✅ See exactly where UI breaks occur with screenshots
- ✅ Time-travel through test steps to debug issues

## **Success Metrics**

**Technical Metrics:**

- ✅ Unit tests run in <500ms total
- ✅ E2E tests complete character creation in <30 seconds
- ✅ Tests catch character validation bugs
- ✅ Visual confirmation of all UI interactions

**Developer Experience:**

- ✅ 15-minute manual testing → 30-second automated verification
- ✅ Confidence to refactor character creation components
- ✅ Clear visual feedback when tests fail
- ✅ Easy to add tests for new features

## **Next Steps After Proof of Concept**

1. **Expand Unit Test Coverage** - Add tests for spell system, validation chains
2. **Add More E2E Flows** - Multi-class characters, equipment packs, spell selection
3. **Integrate with CI** - Run tests automatically on pull requests
4. **Add Visual Regression Testing** - Screenshot comparison for UI consistency

## **Testing Commands**

```bash
# Run unit tests (development)
npm run test

# Run unit tests with coverage
npm run test:coverage

# Run E2E tests headless
npx playwright test

# Run E2E tests with visual UI
npx playwright test --ui

# Run specific test file
npm run test currency.test.ts
npx playwright test character-creation
```

---

_This testing strategy balances comprehensive coverage with practical implementation time, focusing on high-value scenarios that prevent user-breaking bugs while maintaining fast development feedback loops._
