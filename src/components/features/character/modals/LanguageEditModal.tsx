import { useCallback, useState, useEffect } from "react";
import { Modal } from "@/components/modals";
import { LanguageSelector } from "@/components/features/character/creation";
import { Button } from "@/components/ui";
import { HorizontalRule } from "@/components/ui/composite";
import type { Character } from "@/types";

interface LanguageEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  onCharacterChange: (character: Character) => void;
}

export default function LanguageEditModal({
  isOpen,
  onClose,
  character,
  onCharacterChange,
}: LanguageEditModalProps) {
  // Local state for editing
  const [localCharacter, setLocalCharacter] = useState<Character>(character);
  const [isSaving, setIsSaving] = useState(false);

  // Reset local state when modal opens with new character data
  useEffect(() => {
    if (isOpen) {
      setLocalCharacter(character);
      setIsSaving(false);
    }
  }, [isOpen, character]);

  const handleLocalCharacterChange = useCallback(
    (updatedCharacter: Character) => {
      // Update local state only, don't save to Firebase yet
      setLocalCharacter(updatedCharacter);
    },
    []
  );

  const handleSave = useCallback(async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      // Save to Firebase and close modal
      onCharacterChange(localCharacter);
      onClose();
    } finally {
      setIsSaving(false);
    }
  }, [localCharacter, onCharacterChange, onClose, isSaving]);

  const handleCancel = useCallback(() => {
    // Close modal without saving
    onClose();
  }, [onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Edit Languages"
      size="lg"
    >
      <>
        <LanguageSelector
          character={localCharacter}
          onCharacterChange={handleLocalCharacterChange}
        />

        <div className="mt-6">
          <HorizontalRule />
        </div>

        {/* Modal Action Buttons */}
        <div
          className="flex gap-3 pt-6"
          role="group"
          aria-label="Modal actions"
        >
          <Button variant="ghost" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </>
    </Modal>
  );
}
