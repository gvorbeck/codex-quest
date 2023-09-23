import { EquipmentItem } from "../../EquipmentStore/definitions";
import { AttackType } from "../definitions";

export type AttackButtonsProps = {
  weapon: EquipmentItem;
  damage?: (damage: string) => void;
  attack: (attack: AttackType) => void;
  type: AttackType;
  ammo?: EquipmentItem;
  isMissile?: boolean;
  handleCancel: () => void;
};
