import { EquipmentItem } from "../../../../../data/definitions";

export type ItemWrapperProps = {
  item: EquipmentItem;
  handleAttack?: boolean;
  handleAttackClick?: (item: EquipmentItem) => void;
  handleCustomDelete: (item: EquipmentItem) => void;
};
