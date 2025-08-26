import { useState, useCallback } from "react";
import { FloatingActionButton } from "@/components/ui/inputs/FloatingActionButton";
import { DiceRollerModal } from "@/components/ui/feedback";

interface UseDiceRollerReturn {
  isOpen: boolean;
  openRoller: () => void;
  closeRoller: () => void;
  DiceRollerFAB: React.ComponentType<{ disabled?: boolean }>;
  DiceRollerModal: React.ComponentType;
}

export function useDiceRoller(): UseDiceRollerReturn {
  const [isOpen, setIsOpen] = useState(false);

  const openRoller = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeRoller = useCallback(() => {
    setIsOpen(false);
  }, []);

  const DiceRollerFAB = useCallback(({ disabled }: { disabled?: boolean }) => (
    <div className="fixed bottom-6 right-6 z-40">
      <FloatingActionButton
        onClick={openRoller}
        aria-label="Open dice roller"
        tooltip="Roll Dice"
        variant="primary"
        size="md"
        disabled={disabled}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          {/* Dice outline */}
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
          {/* Dice dots (5 pattern) */}
          <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor"/>
          <circle cx="16.5" cy="7.5" r="1.5" fill="currentColor"/>
          <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
          <circle cx="7.5" cy="16.5" r="1.5" fill="currentColor"/>
          <circle cx="16.5" cy="16.5" r="1.5" fill="currentColor"/>
        </svg>
      </FloatingActionButton>
    </div>
  ), [openRoller]);

  const DiceRollerModalComponent = useCallback(() => (
    <DiceRollerModal
      isOpen={isOpen}
      onClose={closeRoller}
    />
  ), [isOpen, closeRoller]);

  return {
    isOpen,
    openRoller,
    closeRoller,
    DiceRollerFAB,
    DiceRollerModal: DiceRollerModalComponent,
  };
}