import { useState } from "react";
import { Modal } from "../base";
import { Button } from "@/components/ui/inputs";
import { TextInput } from "@/components/ui/inputs";
import { Icon, TextHeader } from "@/components/ui/display";
import { roller } from "@/utils/dice";
import { useNotificationContext } from "@/hooks/useNotificationContext";

interface DiceRollerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DiceRollerModal({ isOpen, onClose }: DiceRollerModalProps) {
  const [diceNotation, setDiceNotation] = useState("");
  const [isRolling, setIsRolling] = useState(false);
  const { showSuccess, showError } = useNotificationContext();

  const handleRoll = async () => {
    if (!diceNotation.trim()) {
      showError("Please enter dice notation (e.g., 3d6, 1d20+5)");
      return;
    }

    setIsRolling(true);
    
    try {
      const result = roller(diceNotation.trim());
      
      // Create a detailed result message
      const resultMessage = (
        <div className="text-left">
          <TextHeader variant="h5" size="md" underlined={false} className="flex items-center gap-2 mb-2">
            <Icon name="dice" size="sm" />
            Roll Result: {result.total}
          </TextHeader>
          <div className="text-sm text-zinc-300 space-y-1">
            <div><strong>Formula:</strong> {result.formula}</div>
            <div><strong>Breakdown:</strong> {result.breakdown}</div>
            {result.rolls.length > 0 && (
              <div><strong>Individual Rolls:</strong> [{result.rolls.join(", ")}]</div>
            )}
          </div>
        </div>
      );

      showSuccess(resultMessage, {
        title: `Rolled ${result.formula}`,
        dismissible: true
      });

      // Clear the input after successful roll
      setDiceNotation("");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Invalid dice notation";
      showError(errorMessage, {
        title: "Roll Failed"
      });
    } finally {
      setIsRolling(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleRoll();
    }
  };

  const handleClose = () => {
    setDiceNotation("");
    setIsRolling(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Dice Roller"
      size="md"
    >
      <div className="space-y-6">
        <div>
          <label
            htmlFor="dice-notation"
            className="block text-sm font-medium text-zinc-200 mb-2"
          >
            Dice Notation
          </label>
          <TextInput
            id="dice-notation"
            value={diceNotation}
            onChange={setDiceNotation}
            onKeyDown={handleKeyPress}
            placeholder="e.g., 3d6, 1d20+5, 4d6L"
            disabled={isRolling}
            aria-label="Enter dice notation"
            aria-describedby="dice-notation-help"
          />
          <div id="dice-notation-help" className="mt-2 text-xs text-zinc-400">
            Examples: <span className="font-mono">1d20</span>, <span className="font-mono">3d6+2</span>, <span className="font-mono">4d6L</span> (drop lowest), <span className="font-mono">2d20K</span> (keep highest)
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isRolling}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleRoll}
            loading={isRolling}
            loadingText="Rolling..."
            disabled={!diceNotation.trim()}
            className="min-w-[100px]"
          >
            <div className="flex items-center gap-2">
              <Icon name="dice" size="sm" />
              Roll
            </div>
          </Button>
        </div>
      </div>
    </Modal>
  );
}