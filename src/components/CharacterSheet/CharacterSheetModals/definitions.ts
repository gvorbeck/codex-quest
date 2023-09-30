import {
  CharacterData,
  EquipmentItem,
  SetCharacterData,
} from "../../../data/definitions";

export type CharacterSheetModalsProps = {
  characterData: CharacterData;
  handleCancel: () => void;
  isAddCustomEquipmentModalOpen: boolean;
  isAddEquipmentModalOpen: boolean;
  isAttackModalOpen: boolean;
  isCheatSheetModalOpen: boolean;
  isDiceRollerModalOpen: boolean;
  isLevelUpModalOpen: boolean;
  setCharacterData: SetCharacterData;
  weapon: EquipmentItem | undefined;
};
