import { ReactElement } from "react";
import { EquipmentItem } from "../definitions";

export interface EquipmentRadioProps {
  item: EquipmentItem;
  equipmentItemDescription: ReactElement;
  disabled?: boolean;
  inputDisabled: boolean;
}
