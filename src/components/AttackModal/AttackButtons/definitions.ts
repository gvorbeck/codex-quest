import { EquipmentItem } from "../../EquipmentStore/definitions";

export type AttackButtonsProps = {
  weapon: EquipmentItem;
  damage?: (damage: string) => void;
  attack: (attack: "melee" | "missile") => void;
  type: "melee" | "missile";
  ammo?: EquipmentItem;
  isMissile?: boolean;
  handleCancel: () => void;
};
