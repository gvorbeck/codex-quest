import { RadioChangeEvent } from "antd";
import AmmoSelect from "../AmmoSelect/AmmoSelect";
import AttackButtons from "../AttackButtons/AttackButtons";
import RangeRadioGroup from "../RangeRadioGroup/RangeRadioGroup";
import {
  AttackType,
  CharacterData,
  EquipmentItem,
} from "../../../data/definitions";

type WeaponTypeMissileProps = {
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

export default function WeaponTypeMissile({
  missileRangeBonus,
  handleRangeChange,
  attackingWeapon,
  characterData,
  ammo,
  setAmmo,
  damage,
  attack,
  handleCancel,
}: WeaponTypeMissileProps) {
  return (
    <>
      <RangeRadioGroup
        missileRangeBonus={missileRangeBonus}
        handleRangeChange={handleRangeChange}
        missileRangeValues={attackingWeapon.range || []}
      />
      {attackingWeapon.ammo && (
        <AmmoSelect
          ammo={attackingWeapon.ammo}
          equipment={characterData?.equipment || []}
          setAmmo={setAmmo}
        />
      )}
      <AttackButtons
        weapon={attackingWeapon}
        damage={damage}
        attack={attack}
        type="missile"
        className="mt-2"
        ammo={ammo}
        isMissile
        handleCancel={handleCancel}
      />
    </>
  );
}
