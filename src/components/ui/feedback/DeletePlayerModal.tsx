import { useState } from "react";
import Modal from "./Modal";
import { Button, Typography, TextInput, Callout } from "@/components/ui";
import { Icon } from "@/components/ui/display";

interface DeletePlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  playerName: string;
  isDeleting?: boolean;
}

export default function DeletePlayerModal({
  isOpen,
  onClose,
  onConfirm,
  playerName,
  isDeleting = false,
}: DeletePlayerModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const expectedText = "REMOVE";
  const isConfirmValid = confirmText.trim().toUpperCase() === expectedText;

  const handleConfirm = () => {
    if (isConfirmValid && !isDeleting) {
      onConfirm();
      setConfirmText("");
    }
  };

  const handleClose = () => {
    setConfirmText("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Remove Player from Game"
      size="md"
    >
      <div className="space-y-6">
        {/* Warning Section */}
        <Callout
          variant="warning"
          title="You're about to remove this player from the game"
          size="lg"
        >
          <Typography variant="body" className="leading-relaxed">
            <strong className="text-amber-300">"{playerName}"</strong> will be
            removed from this game session. They will no longer appear in the
            player list or have access to game features. This action can be
            reversed by re-adding them to the game.
          </Typography>
        </Callout>

        {/* Atmospheric flavor text */}
        <Callout variant="neutral" size="sm">
          <Typography
            variant="helper"
            className="text-zinc-400 italic text-center leading-relaxed"
          >
            "Sometimes adventurers must part ways, taking different paths on
            their journey. The bonds forged remain, even when the party
            disbands..."
          </Typography>
        </Callout>

        {/* Confirmation Input */}
        <div className="space-y-4">
          <Typography
            variant="body"
            className="text-zinc-300"
            id="confirm-description"
          >
            To confirm removing this player, type{" "}
            <code className="px-2 py-1 bg-zinc-800 border border-zinc-600 rounded text-amber-400 font-mono text-sm">
              {expectedText}
            </code>{" "}
            in the field below:
          </Typography>

          <div className="relative">
            <TextInput
              value={confirmText}
              onChange={setConfirmText}
              placeholder={`Type "${expectedText}" to confirm`}
              disabled={isDeleting}
              error={confirmText.length > 0 && !isConfirmValid}
              className="font-mono"
              aria-label="Type REMOVE to confirm player removal"
              aria-describedby="confirm-description validation-message"
              showClearButton={false}
            />

            {/* Screen reader feedback */}
            <div id="validation-message" className="sr-only" aria-live="polite">
              {confirmText &&
                (isConfirmValid
                  ? "Confirmation text is correct"
                  : "Confirmation text is incorrect")}
            </div>

            {/* Visual validation indicator */}
            {confirmText && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Icon
                  name={isConfirmValid ? "check-circle" : "x-circle"}
                  size="sm"
                  className={
                    isConfirmValid ? "text-lime-400" : "text-yellow-500"
                  }
                  aria-hidden={true}
                />
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isDeleting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmValid || isDeleting}
            loading={isDeleting}
            loadingText="Removing Player..."
            className="flex-1"
            aria-describedby={
              !isConfirmValid ? "confirm-description" : undefined
            }
          >
            <Icon name="trash" size="sm" />
            Remove Player
          </Button>
        </div>
      </div>
    </Modal>
  );
}
