import { Switch } from "antd";
import RangeRadioGroup from "../RangeRadioGroup/RangeRadioGroup";
import { WeaponTypeBothProps } from "./definitions";
import AttackButtons from "../AttackButtons/AttackButtons";
import AmmoSelect from "../AmmoSelect/AmmoSelect";

export default function WeaponTypeBoth({
  handleSwitchChange,
  isMissile,
  missileRangeBonus,
  handleRangeChange,
  attackingWeapon,
  characterData,
  damage,
  setAmmo,
  attack,
  ammo,
}: WeaponTypeBothProps) {
  return (
    <div>
      <Switch
        unCheckedChildren="Melee Attack"
        checkedChildren="Missile Attack"
        onChange={handleSwitchChange}
        checked={isMissile}
      />
      {isMissile && attackingWeapon.range ? (
        <>
          <RangeRadioGroup
            missileRangeBonus={missileRangeBonus}
            handleRangeChange={handleRangeChange}
            missileRangeValues={attackingWeapon.range}
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
          />
        </>
      ) : (
        <AttackButtons
          weapon={attackingWeapon}
          damage={damage}
          attack={attack}
          type="melee"
          className="mt-2"
        />
      )}
    </div>
  );
}
