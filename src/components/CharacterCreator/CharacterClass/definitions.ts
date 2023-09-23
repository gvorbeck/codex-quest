import { CharacterDataStatePair, SpellType } from "../../definitions";

export interface CharacterClassProps extends CharacterDataStatePair {
  comboClass: boolean;
  setComboClass: (comboClass: boolean) => void;
  checkedClasses: string[];
  setCheckedClasses: (checkedClasses: string[]) => void;
  selectedSpell: SpellType | null;
  setSelectedSpell: (spell: SpellType | null) => void;
}
