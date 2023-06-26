import { EquipmentItem } from "../EquipmentStore/definitions";

export interface EquipmentRadioProps {
  item: EquipmentItem;
  onRadioCheck: () => void;
}
