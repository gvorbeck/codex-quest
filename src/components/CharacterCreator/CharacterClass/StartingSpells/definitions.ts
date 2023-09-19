import { CharacterData, SpellType } from "../../../definitions";

export type StartingSpellsProps = {
  characterData: CharacterData;
  setCharacterData: (characterData: CharacterData) => void;
  selectedSpell: SpellType | null;
  setSelectedSpell: (spell: SpellType | null) => void;
  setModalName: (modalName: string) => void;
  setModalDescription: (modalDescription: string) => void;
  setIsModalOpen: (isModalOpen: boolean) => void;
};
