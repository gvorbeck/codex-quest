import { EquipmentItem } from "../../../EquipmentStore/definitions";
import { CharacterData, SetCharacterData } from "../../../definitions";

export interface EquipmentListProps {
  characterData: CharacterData;
  setCharacterData: SetCharacterData;
  categories: string[];
  handleCustomDelete: (item: EquipmentItem) => void;
  handleAttack?: boolean;
  handleAttackClick?: (item: EquipmentItem) => void;
  updateAC?: () => void;
}
