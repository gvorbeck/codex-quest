import { CharacterData, SetCharacterData } from "../../../../data/definitions";

export type RaceOptionsProps = {
  characterData: CharacterData;
  setCharacterData: SetCharacterData;
  setComboClass: (comboClass: boolean) => void;
  setShowCustomRaceInput: (showCustomRaceInput: boolean) => void;
  setCheckedClasses: (checkedClasses: string[]) => void;
  customRaceInput: string;
};
