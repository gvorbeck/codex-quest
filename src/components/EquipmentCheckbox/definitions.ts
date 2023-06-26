import { ReactElement } from "react";
import { EquipmentItem } from "../EquipmentStore/definitions";

export interface EquipmentCheckboxProps {
  disabled?: boolean;
  item: EquipmentItem;
  className?: string;
  onCheckboxCheck: () => void;
  onAmountChange: () => void;
  playerHasItem: boolean;
  equipmentItemDescription: ReactElement;
}
