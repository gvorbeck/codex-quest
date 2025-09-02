import { useState } from "react";
import Modal from "../base/Modal";
import { Button, Typography, TextInput, Callout } from "@/components/ui";
import { Icon } from "@/components/ui/display";

interface DeleteCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  characterName: string;
  isDeleting?: boolean;
}

export default function DeleteCharacterModal({
  isOpen,
  onClose,
  onConfirm,
  characterName,
  isDeleting = false,
}: DeleteCharacterModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const expectedText = "DELETE";
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
      title="Permanent Deletion"
      size="md"
    >
      <div className="space-y-6">
        {/* Warning Section */}
        <Callout
          variant="error"
          title="You're about to destroy this character forever"
          size="lg"
        >
          <Typography variant="body" className="leading-relaxed">
            <strong className="text-amber-300">"{characterName}"</strong> and
            all their adventures, equipment, and memories will be lost to the
            void. This action cannot be undone, reversed, or recovered by any
            magic known to mortals.
          </Typography>
        </Callout>

        {/* Atmospheric flavor text */}
        <Callout variant="neutral" size="sm">
          <Typography
            variant="helper"
            className="text-zinc-400 italic text-center leading-relaxed"
          >
            "When an adventurer's tale ends, the echoes of their deeds fade from
            tavern songs, their name forgotten by the very realms they once
            protected..."
          </Typography>
        </Callout>

        {/* Confirmation Input */}
        <div className="space-y-4">
          <Typography
            variant="body"
            className="text-zinc-300"
            id="confirm-description"
          >
            To confirm this irreversible action, type{" "}
            <code className="px-2 py-1 bg-zinc-800 border border-zinc-600 rounded text-red-400 font-mono text-sm">
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
              aria-label="Type DELETE to confirm character deletion"
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
            loadingText="Banishing to the Void..."
            className="flex-1"
            aria-describedby={
              !isConfirmValid ? "confirm-description" : undefined
            }
          >
            <Icon name="trash" size="sm" />
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
