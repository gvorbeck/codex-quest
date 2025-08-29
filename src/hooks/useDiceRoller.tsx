import { useCallback } from "react";
import { FloatingActionButton } from "@/components/ui/inputs/FloatingActionButton";
import { DiceRollerModal } from "@/components/ui/feedback";
import { Icon } from "@/components/ui";
import { useModal } from "./useModal";

interface UseDiceRollerReturn {
  isOpen: boolean;
  openRoller: () => void;
  closeRoller: () => void;
  DiceRollerFAB: React.ComponentType<{ disabled?: boolean }>;
  DiceRollerModal: React.ComponentType;
}

export function useDiceRoller(): UseDiceRollerReturn {
  const { isOpen, open: openRoller, close: closeRoller } = useModal();

  const DiceRollerFAB = useCallback(
    ({ disabled }: { disabled?: boolean }) => (
      <div className="fixed bottom-6 right-6 z-40">
        <FloatingActionButton
          onClick={openRoller}
          aria-label="Open dice roller"
          tooltip="Roll Dice"
          variant="primary"
          size="md"
          disabled={disabled}
        >
          <Icon name="dice" size="lg" aria-hidden={true} />
        </FloatingActionButton>
      </div>
    ),
    [openRoller]
  );

  const DiceRollerModalComponent = useCallback(
    () => <DiceRollerModal isOpen={isOpen} onClose={closeRoller} />,
    [isOpen, closeRoller]
  );

  return {
    isOpen,
    openRoller,
    closeRoller,
    DiceRollerFAB,
    DiceRollerModal: DiceRollerModalComponent,
  };
}
