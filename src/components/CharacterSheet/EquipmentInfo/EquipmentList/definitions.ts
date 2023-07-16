import { EquipmentItem } from "../../../EquipmentStore/definitions";
import { CharacterData } from "../../../types";

export interface EquipmentListProps {
  characterData: CharacterData;
  setCharacterData: (characterData: CharacterData) => void;
  categories: string[];
  handleCustomDelete: (item: EquipmentItem) => void;
  handleAttack?: boolean;
  handleAttackClick?: (item: EquipmentItem) => void;
  attackBonus?: number;
  setWeapon?: (weapon: EquipmentItem) => void;
  showAttackModal?: () => void;
  updateAC?: () => void;
  // calculatedAC?: number;
  // setCalculatedAC?: (ac: number) => void;
  // radios?: boolean;
}

// export interface ItemDescriptionProps {
//   item: EquipmentItem;
//   hideAmount?: boolean;
//   hideTrash?: boolean;
// }
