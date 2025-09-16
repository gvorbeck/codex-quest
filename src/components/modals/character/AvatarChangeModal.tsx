import { Modal } from "@/components/modals";
import { AvatarSelector } from "@/components/character/management";
import type { Character } from "@/types";

interface AvatarChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  onCharacterChange: (character: Character) => void;
}

export default function AvatarChangeModal({
  isOpen,
  onClose,
  character,
  onCharacterChange,
}: AvatarChangeModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Avatar" size="lg">
      <AvatarSelector
        character={character}
        onCharacterChange={onCharacterChange}
      />
    </Modal>
  );
}
