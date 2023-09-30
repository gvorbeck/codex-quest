import { EquipmentItem } from "../../../data/definitions";

export type AmmoSelectProps = {
  ammo: string[] | undefined;
  equipment: EquipmentItem[];
  setAmmo: (ammo: EquipmentItem) => void;
};
