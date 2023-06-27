import { ReactElement } from "react";
import { EquipmentItem } from "../definitions";

export interface EquipmentRadioProps {
  item: EquipmentItem;
  onRadioCheck: () => void;
  equipmentItemDescription: ReactElement;
  disabled?: boolean;
}
