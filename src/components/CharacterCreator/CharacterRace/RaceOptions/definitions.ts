import { CharacterData } from "../../../definitions";

export type RaceOptionsProps = {
  characterData: CharacterData;
  setCharacterData: (characterData: CharacterData) => void;
  setComboClass: (comboClass: boolean) => void;
  setShowCustomRaceInput: (showCustomRaceInput: boolean) => void;
  setCheckedClasses: (checkedClasses: string[]) => void;
  customRaceInput: string;
};
