import { EquipmentItem } from "../../EquipmentStore/definitions";
import { CharacterData } from "../../types";

export interface EquipmentInfoProps {
  userIsOwner: boolean;
  showAddEquipmentModal: () => void;
  showAddCustomEquipmentModal: () => void;
  characterData: CharacterData;
  setCharacterData: (characterData: CharacterData) => void;
  handleCustomDelete: (item: EquipmentItem) => void;
  setWeapon?: (weapon: EquipmentItem) => void;
  showAttackModal?: () => void;
  updateAC: () => void;
}
