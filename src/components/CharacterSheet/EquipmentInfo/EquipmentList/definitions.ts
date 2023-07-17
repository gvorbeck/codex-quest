import { EquipmentItem } from "../../../EquipmentStore/definitions";
import { CharacterData } from "../../../types";

export interface EquipmentListProps {
  characterData: CharacterData;
  setCharacterData: (characterData: CharacterData) => void;
  categories: string[];
  handleCustomDelete: (item: EquipmentItem) => void;
  handleAttack?: boolean;
  handleAttackClick?: (item: EquipmentItem) => void;
  updateAC?: () => void;
}
