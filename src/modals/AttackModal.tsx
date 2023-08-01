import {
  Button,
  Modal,
  Radio,
  RadioChangeEvent,
  Select,
  Switch,
  notification,
} from "antd";
import {} from "../components/definitions";
import { useState } from "react";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import CloseIcon from "../components/CloseIcon/CloseIcon";
import {
  AttackModalProps,
  AttackButtonsProps,
  RangeRadioButtons,
  AmmoSelectProps,
} from "./definitions";
import equipmentItems from "../data/equipment-items.json";
import { EquipmentItem } from "../components/EquipmentStore/definitions";

const roller = new DiceRoller();

function AttackButtons({
  weapon,
  damage,
  attack,
  type,
  className,
  ammo,
  isMissile,
}: AttackButtonsProps) {
  const isButtonDisabled =
    type === "missile" && isMissile && !ammo && !weapon.damage;

  return (
    <div className={className}>
      <Button
        type="primary"
        onClick={() => attack(type)}
        disabled={isButtonDisabled}
      >
        Attack Roll
      </Button>
      <Button
        type="default"
        onClick={() => {
          if (weapon.type === "missile") {
            console.log("foo", weapon);
            ammo?.damage && damage(ammo.damage);
          } else {
            console.log("bar");
            weapon.damage && damage(weapon.damage);
          }
        }}
        className="ml-2"
        disabled={isButtonDisabled}
      >
        Damage Roll
      </Button>
    </div>
  );
}

function RangeRadioGroup({
  missileRangeBonus,
  handleRangeChange,
  missileRangeValues,
}: RangeRadioButtons) {
  return (
    <Radio.Group
      value={missileRangeBonus}
      onChange={handleRangeChange}
      className="flex flex-col gap-2 mt-2"
    >
      <Radio value={1}>Short Range (+1): {missileRangeValues[0]}'</Radio>
      <Radio value={0}>Medium Range (+0): {missileRangeValues[1]}'</Radio>
      <Radio value={-2}>Long Range (-2): {missileRangeValues[2]}'</Radio>
    </Radio.Group>
  );
}

function AmmoSelect({ ammo, equipment, setAmmo }: AmmoSelectProps) {
  const options = ammo
    .map((ammoItem) => {
      const item = equipment.find((item) => item.name === ammoItem);
      return item
        ? { value: ammoItem, label: `${ammoItem} (${item.amount})` }
        : null;
    })
    .filter(
      (option): option is { value: string; label: string } => option !== null
    );

  const handleAmmoChange = (value: string) => {
    const selectedAmmoItem = equipment.find((item) => item.name === value);
    if (selectedAmmoItem) {
      setAmmo(selectedAmmoItem);
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      <label htmlFor="ammo">Ammunition</label>
      <Select id="ammo" options={options} onChange={handleAmmoChange} />
    </div>
  );
}

export default function AttackModal({
  isAttackModalOpen,
  handleCancel,
  attackBonus,
  characterData,
  weapon,
}: AttackModalProps) {
  const [isMissile, setisMissile] = useState(false);
  const [missileRangeBonus, setMissileRangeBonus] = useState(0);
  const [ammo, setAmmo] = useState<EquipmentItem | undefined>(undefined);

  const [api, contextHolder] = notification.useNotification();

  const openAttackNotification = (result: string) => {
    api.open({
      message: "Attack Roll",
      description: `${result} (+2 if attacking from behind)`,
      duration: 0,
      className: "!bg-seaBuckthorn",
      closeIcon: <CloseIcon />,
    });
  };

  const openDamageNotification = (result: string) => {
    api.open({
      message: "Damage Roll",
      description: `${result}`,
      duration: 0,
      className: "!bg-seaBuckthorn",
      closeIcon: <CloseIcon />,
    });
  };

  const handleSwitchChange = () => setisMissile(!isMissile);
  const handleRangeChange = (e: RadioChangeEvent) => {
    setMissileRangeBonus(e.target.value);
  };

  const attack = (type: "melee" | "missile") => {
    let roll = "1d20";

    if (characterData) {
      const strength = Number(characterData.abilities.modifiers.strength);
      const dexterity = Number(characterData.abilities.modifiers.dexterity);
      const halflingBonus =
        characterData.race.toLowerCase() === "halfling" ? "+1" : "";

      roll +=
        type === "melee"
          ? `+${strength + attackBonus}`
          : `+${dexterity + attackBonus}${halflingBonus}+${missileRangeBonus}`;
    }

    openAttackNotification(roller.roll(roll).output);
  };

  const damage = (roll: string, ammo: string = "") =>
    openDamageNotification(
      `${ammo !== "" ? ammo.toUpperCase() + ": " : ""}${
        roller.roll(roll).output
      }`
    );

  const attackingWeapon =
    equipmentItems.find((item) => item.name === weapon?.name) || weapon;

  console.log(attackingWeapon, isMissile);

  return (
    <>
      {contextHolder}
      <Modal
        title={`Attack with ${attackingWeapon?.name || "weapon"}`}
        open={isAttackModalOpen}
        onCancel={handleCancel}
        footer={false}
        closeIcon={<CloseIcon />}
      >
        {attackingWeapon ? (
          <div>
            {attackingWeapon.type === "melee" && (
              <AttackButtons
                weapon={attackingWeapon}
                damage={damage}
                attack={attack}
                type="melee"
                className="mt-2"
              />
            )}
            {attackingWeapon.type === "missile" && attackingWeapon.range && (
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
            )}
            {attackingWeapon.type === "both" && (
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
            )}
          </div>
        ) : (
          <p>No weapon selected</p>
        )}
      </Modal>
    </>
  );
}
