import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AbilityScoreStep from "@/components/features/character/creation/AbilityScoreStep";
import { createEmptyCharacter } from "@/utils";
import type { Character } from "@/types";

// Mock the dice roller for deterministic tests
vi.mock("@/utils/mechanics", () => ({
  roller: vi.fn(() => ({
    total: 15,
    rolls: [5, 5, 5],
    formula: "3d6",
    breakdown: "5, 5, 5",
  })),
  GAME_MECHANICS: {
    ABILITY_MODIFIERS: [
      { max: 3, modifier: -3 },
      { max: 5, modifier: -2 },
      { max: 8, modifier: -1 },
      { max: 12, modifier: 0 },
      { max: 15, modifier: 1 },
      { max: 17, modifier: 2 },
    ],
    DEFAULT_HIGH_MODIFIER: 3,
  },
}));

describe("Character Creation Integration Tests", () => {
  let mockCharacter: Character;
  const mockOnCharacterChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockCharacter = createEmptyCharacter();
  });

  describe("Ability Score Flow", () => {
    it("completes full ability score generation and validation flow", async () => {
      const user = userEvent.setup();

      render(
        <AbilityScoreStep
          character={mockCharacter}
          onCharacterChange={mockOnCharacterChange}
        />
      );

      // Step 1: Initial state should show roll button
      expect(screen.getByRole("button", { name: /roll all abilities/i })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /flip all scores/i })).not.toBeInTheDocument();

      // Step 2: Roll all abilities
      await user.click(screen.getByRole("button", { name: /roll all abilities/i }));

      // Verify all ability scores were set
      expect(mockOnCharacterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          abilities: expect.objectContaining({
            strength: { value: 15, modifier: 1 },
            dexterity: { value: 15, modifier: 1 },
            constitution: { value: 15, modifier: 1 },
            intelligence: { value: 15, modifier: 1 },
            wisdom: { value: 15, modifier: 1 },
            charisma: { value: 15, modifier: 1 },
          }),
        })
      );

      // Step 3: Re-render with rolled scores to test flip functionality
      const characterWithScores: Character = {
        ...mockCharacter,
        abilities: {
          strength: { value: 15, modifier: 1 },
          dexterity: { value: 12, modifier: 0 },
          constitution: { value: 8, modifier: -1 },
          intelligence: { value: 18, modifier: 3 },
          wisdom: { value: 10, modifier: 0 },
          charisma: { value: 6, modifier: -1 },
        },
      };

      render(
        <AbilityScoreStep
          character={characterWithScores}
          onCharacterChange={mockOnCharacterChange}
        />
      );

      // Step 4: Flip button should now be available
      expect(screen.getByRole("button", { name: /flip all scores/i })).toBeInTheDocument();

      // Step 5: Test flip functionality
      await user.click(screen.getByRole("button", { name: /flip all scores/i }));

      expect(mockOnCharacterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          abilities: expect.objectContaining({
            strength: { value: 6, modifier: -1 }, // 21 - 15 = 6 (6-8 range = -1)
            dexterity: { value: 9, modifier: 0 }, // 21 - 12 = 9 (9-12 range = 0)
            constitution: { value: 13, modifier: 1 }, // 21 - 8 = 13
            intelligence: { value: 3, modifier: -3 }, // 21 - 18 = 3
            wisdom: { value: 11, modifier: 0 }, // 21 - 10 = 11
            charisma: { value: 15, modifier: 1 }, // 21 - 6 = 15
          }),
        })
      );
    });

    it("handles edge cases in ability score ranges", async () => {
      const user = userEvent.setup();

      // Character with edge case scores
      const edgeCaseCharacter: Character = {
        ...mockCharacter,
        abilities: {
          strength: { value: 3, modifier: -3 }, // Minimum
          dexterity: { value: 18, modifier: 3 }, // Maximum
          constitution: { value: 8, modifier: -1 }, // Boundary case
          intelligence: { value: 9, modifier: 0 }, // Boundary case
          wisdom: { value: 12, modifier: 0 }, // Boundary case
          charisma: { value: 13, modifier: 1 }, // Boundary case
        },
      };

      render(
        <AbilityScoreStep
          character={edgeCaseCharacter}
          onCharacterChange={mockOnCharacterChange}
        />
      );

      // Should display all modifiers correctly
      expect(screen.getByText("Modifier: -3")).toBeInTheDocument();
      expect(screen.getByText("Modifier: +3")).toBeInTheDocument();
      expect(screen.getAllByText("Modifier: -1")).toHaveLength(1);
      expect(screen.getAllByText("Modifier: +0")).toHaveLength(2);
      expect(screen.getByText("Modifier: +1")).toBeInTheDocument();

      // Test flip with edge cases
      await user.click(screen.getByRole("button", { name: /flip all scores/i }));

      expect(mockOnCharacterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          abilities: expect.objectContaining({
            strength: { value: 18, modifier: 3 }, // 21 - 3 = 18
            dexterity: { value: 3, modifier: -3 }, // 21 - 18 = 3
            constitution: { value: 13, modifier: 1 }, // 21 - 8 = 13
            intelligence: { value: 12, modifier: 0 }, // 21 - 9 = 12
            wisdom: { value: 9, modifier: 0 }, // 21 - 12 = 9
            charisma: { value: 8, modifier: -1 }, // 21 - 13 = 8
          }),
        })
      );
    });
  });

  describe("Accessibility Flow", () => {
    it("provides proper accessibility features throughout the flow", async () => {
      render(
        <AbilityScoreStep
          character={mockCharacter}
          onCharacterChange={mockOnCharacterChange}
        />
      );

      // Check for proper ARIA labels
      expect(
        screen.getByRole("group", { name: /ability score generation controls/i })
      ).toBeInTheDocument();

      // Check that all ability score inputs have proper labels
      expect(screen.getByLabelText(/strength/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/dexterity/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/constitution/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/intelligence/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/wisdom/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/charisma/i)).toBeInTheDocument();
    });
  });

  describe("State Persistence", () => {
    it("maintains character state between re-renders", async () => {
      const user = userEvent.setup();

      const { rerender } = render(
        <AbilityScoreStep
          character={mockCharacter}
          onCharacterChange={mockOnCharacterChange}
        />
      );

      // Roll abilities
      await user.click(screen.getByRole("button", { name: /roll all abilities/i }));

      // Get the updated character from the callback
      const updatedCharacter = mockOnCharacterChange.mock.calls[0]?.[0];

      // Re-render with updated character
      rerender(
        <AbilityScoreStep
          character={updatedCharacter}
          onCharacterChange={mockOnCharacterChange}
        />
      );

      // Verify the scores are still displayed
      expect(screen.getByText("Ability Scores Summary")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /flip all scores/i })).toBeInTheDocument();
    });
  });

  describe("Information Display", () => {
    it("shows contextual information based on current state", async () => {
      const user = userEvent.setup();

      render(
        <AbilityScoreStep
          character={mockCharacter}
          onCharacterChange={mockOnCharacterChange}
        />
      );

      // Initially should show rolling instructions
      expect(screen.getByText(/Roll 3d6 for each ability score/)).toBeInTheDocument();

      // Roll abilities
      await user.click(screen.getByRole("button", { name: /roll all abilities/i }));

      // Re-render with scores
      const characterWithScores: Character = {
        ...mockCharacter,
        abilities: {
          strength: { value: 15, modifier: 1 },
          dexterity: { value: 12, modifier: 0 },
          constitution: { value: 8, modifier: -1 },
          intelligence: { value: 18, modifier: 3 },
          wisdom: { value: 10, modifier: 0 },
          charisma: { value: 6, modifier: -1 },
        },
      };

      render(
        <AbilityScoreStep
          character={characterWithScores}
          onCharacterChange={mockOnCharacterChange}
        />
      );

      // Should now show flip information
      expect(screen.getByText("Flip Scores Information")).toBeInTheDocument();
      expect(screen.getByText(/You can flip all ability scores/)).toBeInTheDocument();
    });
  });
});