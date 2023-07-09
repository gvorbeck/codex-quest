interface ModalProps {
  handleCancel: () => void;
}
export interface DiceRollerModalProps extends ModalProps {
  isDiceRollerModalOpen: boolean;
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
