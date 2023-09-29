import { Spell } from "../../../../data/definitions";
import { CharacterData, SetCharacterData } from "../../../definitions";

export type StartingSpellsProps = {
  characterData: CharacterData;
  setCharacterData: SetCharacterData;
  selectedSpell: Spell | null;
  setSelectedSpell: (spell: Spell | null) => void;
  setModalName: (modalName: string) => void;
  setModalDescription: (modalDescription: string) => void;
  setIsModalOpen: (isModalOpen: boolean) => void;
};
