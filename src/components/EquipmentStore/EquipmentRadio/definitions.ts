import { ReactElement } from "react";
import { EquipmentItem } from "../../../data/definitions";

export interface EquipmentRadioProps {
  item: EquipmentItem;
  equipmentItemDescription: ReactElement;
  disabled?: boolean;
  inputDisabled: boolean;
}
