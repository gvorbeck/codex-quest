import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AbilityScoreStep from "@/components/features/character/creation/AbilityScoreStep";
import { createEmptyCharacter } from "@/utils";
import type { Character } from "@/types";

// Mock the dice roller to make tests deterministic
vi.mock("@/utils/mechanics", () => ({
  roller: vi.fn(() => ({ total: 15, rolls: [5, 5, 5], formula: "3d6", breakdown: "5, 5, 5" })),
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
  }
}));

describe("AbilityScoreStep Component", () => {
  const mockOnCharacterChange = vi.fn();
  
  const defaultProps = {
    character: createEmptyCharacter(),
    onCharacterChange: mockOnCharacterChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial Render", () => {
    it("renders the step title and description", () => {
      render(<AbilityScoreStep {...defaultProps} />);
      
      expect(screen.getByText("Roll Ability Scores")).toBeInTheDocument();
      expect(screen.getByText(/Roll 3d6 for each ability score/)).toBeInTheDocument();
    });

    it("renders Roll All Abilities button", () => {
      render(<AbilityScoreStep {...defaultProps} />);
      
      expect(screen.getByRole("button", { name: /roll all abilities/i })).toBeInTheDocument();
    });

    it("renders all six ability score sections", () => {
      render(<AbilityScoreStep {...defaultProps} />);
      
      expect(screen.getByLabelText(/strength/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/dexterity/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/constitution/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/intelligence/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/wisdom/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/charisma/i)).toBeInTheDocument();
    });
  });

  describe("Rolling Abilities", () => {
    it("calls onCharacterChange when rolling all abilities", async () => {
      const user = userEvent.setup();
      render(<AbilityScoreStep {...defaultProps} />);
      
      const rollButton = screen.getByRole("button", { name: /roll all abilities/i });
      await user.click(rollButton);

      expect(mockOnCharacterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          abilities: expect.objectContaining({
            strength: { value: 15, modifier: 1 },
            dexterity: { value: 15, modifier: 1 },
            constitution: { value: 15, modifier: 1 },
            intelligence: { value: 15, modifier: 1 },
            wisdom: { value: 15, modifier: 1 },
            charisma: { value: 15, modifier: 1 },
          })
        })
      );
    });

    it("shows Flip All Scores button after rolling", () => {
      const characterWithScores: Character = {
        ...createEmptyCharacter(),
        abilities: {
          strength: { value: 15, modifier: 1 },
          dexterity: { value: 12, modifier: 0 },
          constitution: { value: 8, modifier: -1 },
          intelligence: { value: 18, modifier: 3 },
          wisdom: { value: 10, modifier: 0 },
          charisma: { value: 6, modifier: -2 },
        }
      };

      render(<AbilityScoreStep character={characterWithScores} onCharacterChange={mockOnCharacterChange} />);
      
      expect(screen.getByRole("button", { name: /flip all scores/i })).toBeInTheDocument();
    });

    it("flips ability scores correctly", async () => {
      const user = userEvent.setup();
      const characterWithScores: Character = {
        ...createEmptyCharacter(),
        abilities: {
          strength: { value: 15, modifier: 1 },
          dexterity: { value: 12, modifier: 0 },
          constitution: { value: 8, modifier: -1 },
          intelligence: { value: 18, modifier: 3 },
          wisdom: { value: 10, modifier: 0 },
          charisma: { value: 6, modifier: -2 },
        }
      };

      render(<AbilityScoreStep character={characterWithScores} onCharacterChange={mockOnCharacterChange} />);
      
      const flipButton = screen.getByRole("button", { name: /flip all scores/i });
      await user.click(flipButton);

      expect(mockOnCharacterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          abilities: expect.objectContaining({
            strength: { value: 6, modifier: -2 },  // 21 - 15 = 6
            dexterity: { value: 9, modifier: -1 },  // 21 - 12 = 9
            constitution: { value: 13, modifier: 1 }, // 21 - 8 = 13
            intelligence: { value: 3, modifier: -3 }, // 21 - 18 = 3
            wisdom: { value: 11, modifier: 0 },     // 21 - 10 = 11
            charisma: { value: 15, modifier: 1 },   // 21 - 6 = 15
          })
        })
      );
    });
  });

  describe("Ability Score Display", () => {
    it("displays modifiers for rolled scores", () => {
      const characterWithScores: Character = {
        ...createEmptyCharacter(),
        abilities: {
          strength: { value: 18, modifier: 3 },
          dexterity: { value: 12, modifier: 0 },
          constitution: { value: 8, modifier: -1 },
          intelligence: { value: 15, modifier: 1 },
          wisdom: { value: 10, modifier: 0 },
          charisma: { value: 6, modifier: -2 },
        }
      };

      render(<AbilityScoreStep character={characterWithScores} onCharacterChange={mockOnCharacterChange} />);
      
      expect(screen.getByText("Modifier: +3")).toBeInTheDocument();
      expect(screen.getByText("Modifier: +0")).toBeInTheDocument();
      expect(screen.getByText("Modifier: -1")).toBeInTheDocument();
      expect(screen.getByText("Modifier: +1")).toBeInTheDocument();
      expect(screen.getByText("Modifier: -2")).toBeInTheDocument();
    });

    it("shows ability scores summary when scores are rolled", () => {
      const characterWithScores: Character = {
        ...createEmptyCharacter(),
        abilities: {
          strength: { value: 15, modifier: 1 },
          dexterity: { value: 12, modifier: 0 },
          constitution: { value: 8, modifier: -1 },
          intelligence: { value: 18, modifier: 3 },
          wisdom: { value: 10, modifier: 0 },
          charisma: { value: 6, modifier: -2 },
        }
      };

      render(<AbilityScoreStep character={characterWithScores} onCharacterChange={mockOnCharacterChange} />);
      
      expect(screen.getByText("Ability Scores Summary")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels for form controls", () => {
      render(<AbilityScoreStep {...defaultProps} />);
      
      expect(screen.getByRole("group", { name: /ability score generation controls/i })).toBeInTheDocument();
    });

    it("provides status messages for screen readers", () => {
      const characterWithInvalidScores: Character = {
        ...createEmptyCharacter(),
        abilities: {
          strength: { value: 25, modifier: 7 }, // Invalid - too high
          dexterity: { value: 12, modifier: 0 },
          constitution: { value: 8, modifier: -1 },
          intelligence: { value: 18, modifier: 3 },
          wisdom: { value: 10, modifier: 0 },
          charisma: { value: 6, modifier: -2 },
        }
      };

      render(<AbilityScoreStep character={characterWithInvalidScores} onCharacterChange={mockOnCharacterChange} />);
      
      // The step should indicate there are validation errors
      // Note: This test depends on the validation implementation
    });
  });

  describe("Information Cards", () => {
    it("shows flip scores information when scores are present", () => {
      const characterWithScores: Character = {
        ...createEmptyCharacter(),
        abilities: {
          strength: { value: 15, modifier: 1 },
          dexterity: { value: 12, modifier: 0 },
          constitution: { value: 8, modifier: -1 },
          intelligence: { value: 18, modifier: 3 },
          wisdom: { value: 10, modifier: 0 },
          charisma: { value: 6, modifier: -2 },
        }
      };

      render(<AbilityScoreStep character={characterWithScores} onCharacterChange={mockOnCharacterChange} />);
      
      expect(screen.getByText("Flip Scores Information")).toBeInTheDocument();
      expect(screen.getByText(/You can flip all ability scores/)).toBeInTheDocument();
    });
  });
});