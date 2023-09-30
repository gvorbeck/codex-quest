import { CharacterData, CollapseItem } from "../../../data/definitions";

export interface EquipmentInfoProps {
  userIsOwner: boolean;
  showAddEquipmentModal: () => void;
  showAddCustomEquipmentModal: () => void;
  characterData: CharacterData;
  collapseItems: CollapseItem[];
}
