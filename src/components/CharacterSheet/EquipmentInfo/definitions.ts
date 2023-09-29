import { CollapseItem } from "../../../data/definitions";
import { CharacterData } from "../../definitions";

export interface EquipmentInfoProps {
  userIsOwner: boolean;
  showAddEquipmentModal: () => void;
  showAddCustomEquipmentModal: () => void;
  characterData: CharacterData;
  collapseItems: CollapseItem[];
}
