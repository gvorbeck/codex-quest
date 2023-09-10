import AmmoSelect from "../AmmoSelect/AmmoSelect";
import AttackButtons from "../AttackButtons/AttackButtons";
import RangeRadioGroup from "../RangeRadioGroup/RangeRadioGroup";
import { WeaponTypeMissileProps } from "./definitions";

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
