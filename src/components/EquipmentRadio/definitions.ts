import { ReactElement } from "react";
import { EquipmentItem } from "../EquipmentStore/definitions";

export interface EquipmentRadioProps {
  item: EquipmentItem;
  onRadioCheck: () => void;
  equipmentItemDescription: ReactElement;
}
