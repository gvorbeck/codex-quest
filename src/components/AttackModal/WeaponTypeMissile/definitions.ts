import { RadioChangeEvent } from "antd";
import { AttackType } from "../definitions";
import { CharacterData, EquipmentItem } from "../../../data/definitions";

export type WeaponTypeMissileProps = {
  handleSwitchChange: (switchChange: boolean) => void;
  isMissile: boolean;
  missileRangeBonus: number;
  handleRangeChange: (e: RadioChangeEvent) => void;
  attackingWeapon: EquipmentItem;
  characterData: CharacterData | undefined;
  damage: (roll: string, ammo?: string) => void;
  attack: (type: AttackType) => void;
  ammo: EquipmentItem | undefined;
  setAmmo: React.Dispatch<React.SetStateAction<EquipmentItem | undefined>>;
  handleCancel: () => void;
};
