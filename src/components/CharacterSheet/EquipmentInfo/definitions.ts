import { EquipmentItem } from "../../EquipmentStore/definitions";
import { CharacterData, SetCharacterData } from "../../definitions";

export interface EquipmentInfoProps {
  userIsOwner: boolean;
  showAddEquipmentModal: () => void;
  showAddCustomEquipmentModal: () => void;
  characterData: CharacterData;
  setCharacterData: SetCharacterData;
  handleCustomDelete: (item: EquipmentItem) => void;
  setWeapon?: (weapon: EquipmentItem) => void;
  showAttackModal?: () => void;
  updateAC: () => void;
}
