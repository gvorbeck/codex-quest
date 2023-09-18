import { RadioChangeEvent } from "antd";
import { EquipmentItem } from "../../EquipmentStore/definitions";
import { CharacterData } from "../../definitions";

export type WeaponTypeBothProps = {
  handleSwitchChange: (switchChange: boolean) => void;
  isMissile: boolean;
  missileRangeBonus: number;
  handleRangeChange: (e: RadioChangeEvent) => void;
  attackingWeapon: EquipmentItem;
  characterData: CharacterData | undefined;
  damage: (roll: string, ammo?: string) => void;
  attack: (type: "melee" | "missile") => void;
  ammo: EquipmentItem | undefined;
  setAmmo: React.Dispatch<React.SetStateAction<EquipmentItem | undefined>>;
  handleCancel: () => void;
};
