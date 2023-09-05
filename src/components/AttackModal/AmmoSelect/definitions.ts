import { EquipmentItem } from "../../EquipmentStore/definitions";

export type AmmoSelectProps = {
  ammo: string[] | undefined;
  equipment: EquipmentItem[];
  setAmmo: (ammo: EquipmentItem) => void;
};
