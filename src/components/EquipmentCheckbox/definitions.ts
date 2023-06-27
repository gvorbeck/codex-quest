import { ReactElement } from "react";
import { EquipmentItem } from "../EquipmentStore/definitions";

export interface EquipmentCheckboxProps {
  disabled?: boolean;
  item: EquipmentItem;
  className?: string;
  onCheckboxCheck: (item?: EquipmentItem, checked?: boolean) => void;
  onAmountChange: (item?: EquipmentItem) => void;
  playerHasItem: boolean;
  equipmentItemDescription: ReactElement;
  inputDisabled: boolean;
}
