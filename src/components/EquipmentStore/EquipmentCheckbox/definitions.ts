import { ReactElement } from "react";
import { EquipmentItem } from "../definitions";

export interface EquipmentCheckboxProps {
  disabled?: boolean;
  item: EquipmentItem;
  onCheckboxCheck: (item?: EquipmentItem, checked?: boolean) => void;
  onAmountChange: (item?: EquipmentItem) => void;
  playerHasItem: boolean;
  equipmentItemDescription: ReactElement;
  inputDisabled: boolean;
  itemAmount: number;
}
