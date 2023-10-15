import { RadioChangeEvent, Switch } from "antd";
import RangeRadioGroup from "../RangeRadioGroup/RangeRadioGroup";
import AttackButtons from "../AttackButtons/AttackButtons";
import AmmoSelect from "../AmmoSelect/AmmoSelect";
import {
  AttackType,
  CharacterData,
  EquipmentItem,
} from "../../../data/definitions";

type WeaponTypeBothProps = {
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
  handleCancel,
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
            handleCancel={handleCancel}
          />
        </>
      ) : (
        <AttackButtons
          weapon={attackingWeapon}
          damage={damage}
          attack={attack}
          type="melee"
          className="mt-2"
          handleCancel={handleCancel}
        />
      )}
    </div>
  );
}
