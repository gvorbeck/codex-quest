import { useState } from "react";
import { Modal } from "@/components/modals";
import { Button, TextInput, FormField } from "@/components/ui/core/primitives";
import { Icon } from "@/components/ui/core/display";
import { TextHeader } from "@/components/ui/composite/TextHeader";
import { roller, getErrorMessage } from "@/utils";
import { useNotificationContext } from "@/hooks";

interface DiceRollerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DiceRollerModal({
  isOpen,
  onClose,
}: DiceRollerModalProps) {
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
          <TextHeader
            variant="h5"
            size="md"
            underlined={false}
            className="flex items-center gap-2 mb-2"
          >
            <Icon name="dice" size="sm" />
            Roll Result: {result.total}
          </TextHeader>
          <div className="text-sm text-zinc-300 space-y-1">
            <div>
              <strong>Formula:</strong> {result.formula}
            </div>
            <div>
              <strong>Breakdown:</strong> {result.breakdown}
            </div>
            {result.rolls.length > 0 && (
              <div>
                <strong>Individual Rolls:</strong> [{result.rolls.join(", ")}]
              </div>
            )}
          </div>
        </div>
      );

      showSuccess(resultMessage, {
        title: `Rolled ${result.formula}`,
        dismissible: true,
      });

      // Clear the input after successful roll
      setDiceNotation("");
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Invalid dice notation");
      showError(errorMessage!, {
        title: "Roll Failed",
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Dice Roller" size="md">
      <div className="space-y-6">
        <FormField
          label="Dice Notation"
          hint="Examples: 1d20, 3d6+2, 4d6L (drop lowest), 2d20K (keep highest)"
        >
          <TextInput
            value={diceNotation}
            onChange={setDiceNotation}
            onKeyDown={handleKeyPress}
            placeholder="e.g., 3d6, 1d20+5, 4d6L"
            disabled={isRolling}
            aria-label="Enter dice notation"
          />
        </FormField>

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
