import { SpellType } from "../../types";
import { CharSteps } from "../definitions";

export interface CharacterClassProps extends CharSteps {
  comboClass: boolean;
  setComboClass: (comboClass: boolean) => void;
  checkedClasses: string[];
  setCheckedClasses: (checkedClasses: string[]) => void;
  selectedSpell: SpellType | null;
  setSelectedSpell: (spell: SpellType | null) => void;
}
