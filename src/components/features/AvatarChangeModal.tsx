import { Modal } from "@/components/ui";
import { AvatarSelector } from "@/components/features";
import type { Character } from "@/types/character";

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
      <AvatarSelector character={character} onCharacterChange={onCharacterChange} />
    </Modal>
  );
}