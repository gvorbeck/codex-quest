import { EquipmentItem } from "../../EquipmentStore/definitions";
import { CharacterData, SetCharacterData } from "../../definitions";

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
