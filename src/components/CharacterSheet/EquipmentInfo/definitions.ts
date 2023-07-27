import { EquipmentItem } from "../../EquipmentStore/definitions";
import { CharacterData } from "../../definitions";

export interface EquipmentInfoProps {
  userIsOwner: boolean;
  showAddEquipmentModal: () => void;
  showAddCustomEquipmentModal: () => void;
  characterData: CharacterData;
  setCharacterData: (characterData: CharacterData) => void;
  handleCustomDelete: (item: EquipmentItem) => void;
  setWeapon?: (weapon: string) => void;
  showAttackModal?: () => void;
  updateAC: () => void;
}
