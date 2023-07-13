import { EquipmentItem } from "../../EquipmentStore/definitions";
import { CharacterDetails } from "../../types";

export interface EquipmentListProps extends CharacterDetails {
  categories: string[] | string;
  handleAttack?: boolean;
  attackBonus?: number;
  setWeapon?: (weapon: EquipmentItem) => void;
  showAttackModal?: () => void;
  calculatedAC?: number;
  setCalculatedAC?: (ac: number) => void;
  radios?: boolean;
}

export interface ItemDescriptionProps {
  item: EquipmentItem;
  hideAmount?: boolean;
  hideTrash?: boolean;
}
