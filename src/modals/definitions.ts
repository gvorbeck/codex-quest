import { CharacterData } from "../components/types";

interface ModalProps {
  handleCancel: () => void;
}
export interface DiceRollerModalProps extends ModalProps {
  isDiceRollerModalOpen: boolean;
}

export interface AddEquipmentModalProps extends ModalProps {
  isAddEquipmentModalOpen: boolean;
  setCharacter: (character: CharacterData) => void;
  character: CharacterData;
}

export interface AddCustomEquipmentModalProps extends ModalProps {
  isAddCustomEquipmentModalOpen: boolean;
  setCharacter: (character: CharacterData) => void;
  character: CharacterData;
}

export interface SpellCheckboxGroupProps {
  characterClass: string;
  level: number;
  max: number;
  checkedSpells: string[];
  setCheckedSpells: (checkedSpells: string[]) => void;
  checkedSpellsCount: number[];
  setCheckedSpellsCount: (checkedSpellsCount: number[]) => void;
  unrestricted?: boolean;
}
