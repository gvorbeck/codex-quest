import { CollapseProps } from "antd";
import { CharacterData } from "../../../data/definitions";

export interface EquipmentInfoProps {
  userIsOwner: boolean;
  showAddEquipmentModal: () => void;
  showAddCustomEquipmentModal: () => void;
  characterData: CharacterData;
  collapseItems: CollapseProps["items"];
}
