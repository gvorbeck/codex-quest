import { Modal, RadioChangeEvent, notification } from "antd";
import { useState } from "react";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import CloseIcon from "../CloseIcon/CloseIcon";
import { AttackModalProps } from "../../modals/definitions";
import equipmentItems from "../../data/equipmentItems.json";
import { EquipmentItem } from "../EquipmentStore/definitions";
import WeaponTypeBoth from "./WeaponTypeBoth/WeaponTypeBoth";
import AttackButtons from "./AttackButtons/AttackButtons";
import WeaponTypeMissile from "./WeaponTypeMissile/WeaponTypeMissile";

const roller = new DiceRoller();

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

  const openAttackNotification = (result: string, hideNote?: boolean) => {
    api.open({
      message: "Attack Roll",
      description: `${result} ${
        !hideNote ? `(+2 if attacking from behind)` : ""
      }`,
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

  const powerAttack = () =>
    openAttackNotification(roller.roll("1d20").output, true);

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
            {attackingWeapon.type === "power" && (
              <AttackButtons
                weapon={attackingWeapon}
                attack={powerAttack}
                damage={damage}
                type="melee"
                className="mt-2"
              />
            )}
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
              <WeaponTypeMissile
                ammo={ammo}
                damage={damage}
                attack={attack}
                attackingWeapon={attackingWeapon}
                characterData={characterData}
                handleRangeChange={handleRangeChange}
                handleSwitchChange={handleSwitchChange}
                isMissile={isMissile}
                missileRangeBonus={missileRangeBonus}
                setAmmo={setAmmo}
              />
            )}
            {attackingWeapon.type === "both" && (
              <WeaponTypeBoth
                attackingWeapon={attackingWeapon}
                handleSwitchChange={handleSwitchChange}
                isMissile={isMissile}
                missileRangeBonus={missileRangeBonus}
                handleRangeChange={handleRangeChange}
                characterData={characterData}
                damage={damage}
                attack={attack}
                ammo={ammo}
                setAmmo={setAmmo}
              />
            )}
          </div>
        ) : (
          <p>No weapon selected</p>
        )}
      </Modal>
    </>
  );
}
