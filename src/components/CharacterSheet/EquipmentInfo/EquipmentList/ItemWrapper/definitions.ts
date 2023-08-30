import { EquipmentItem } from "../../../../EquipmentStore/definitions";

export type ItemWrapperProps = {
  item: EquipmentItem;
  handleAttack?: boolean;
  handleAttackClick?: (item: EquipmentItem) => void;
  handleCustomDelete: (item: EquipmentItem) => void;
};
