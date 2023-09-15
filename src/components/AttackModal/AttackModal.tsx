import { Modal, RadioChangeEvent, Typography, notification } from "antd";
import { useState } from "react";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import CloseIcon from "../CloseIcon/CloseIcon";
import { AttackModalProps } from "../../modals/definitions";
import equipmentItems from "../../data/equipmentItems.json";
import { EquipmentItem } from "../EquipmentStore/definitions";
import WeaponTypeBoth from "./WeaponTypeBoth/WeaponTypeBoth";
import AttackButtons from "./AttackButtons/AttackButtons";
import WeaponTypeMissile from "./WeaponTypeMissile/WeaponTypeMissile";
import { CharacterData } from "../definitions";
import { RaceNamesTwo, races } from "../../data/races";

const roller = new DiceRoller();

export default function AttackModal({
  isAttackModalOpen,
  handleCancel,
  attackBonus,
  characterData,
  setCharacterData,
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

  const fireMissile = (missile: EquipmentItem) => {
    // Generate a random number between 0 and 1
    const randomNumber = Math.random();

    // 25% chance to recover fired missile
    if (randomNumber > 0.25) {
      missile.amount = Math.max(0, missile.amount - 1);
    }

    setCharacterData({
      ...characterData,
      equipment:
        characterData?.equipment.map((item) =>
          item.name === missile.name ? missile : item
        ) || [],
    } as CharacterData);
  };

  const attack = (type: "melee" | "missile", missile?: EquipmentItem) => {
    let roll = "1d20";

    if (characterData) {
      const strength = Number(characterData.abilities.modifiers.strength);
      const dexterity = Number(characterData.abilities.modifiers.dexterity);
      const raceAttackBonus =
        races[characterData.race as RaceNamesTwo].additionalAttackBonus || "";

      if (type === "melee") {
        roll += `+${strength + attackBonus}`;
      } else {
        roll += `+${
          dexterity + attackBonus
        }${raceAttackBonus}+${missileRangeBonus}`;
      }

      if (type === "missile" && missile) fireMissile(missile);
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

  const handleAttackCancel = () => {
    handleCancel();
  };

  const RecoveryWarning = () => (
    <Typography.Text type="secondary" className="mt-2 block">
      25% chance to recover your ammunition.
    </Typography.Text>
  );

  return (
    <>
      {contextHolder}
      <Modal
        title={`Attack with ${attackingWeapon?.name || "weapon"}`}
        open={isAttackModalOpen}
        onCancel={handleAttackCancel}
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
                handleCancel={handleCancel}
              />
            )}
            {attackingWeapon.type === "melee" && (
              <AttackButtons
                weapon={attackingWeapon}
                damage={damage}
                attack={attack}
                type="melee"
                className="mt-2"
                handleCancel={handleCancel}
              />
            )}
            {attackingWeapon.type === "missile" && attackingWeapon.range && (
              <>
                <WeaponTypeMissile
                  ammo={ammo}
                  damage={damage}
                  attack={() => attack("missile", ammo)}
                  attackingWeapon={attackingWeapon}
                  characterData={characterData}
                  handleRangeChange={handleRangeChange}
                  handleSwitchChange={handleSwitchChange}
                  isMissile={isMissile}
                  missileRangeBonus={missileRangeBonus}
                  setAmmo={setAmmo}
                  handleCancel={handleCancel}
                />
                <RecoveryWarning />
              </>
            )}
            {attackingWeapon.type === "both" && (
              <>
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
                  handleCancel={handleCancel}
                />
                <RecoveryWarning />
              </>
            )}
          </div>
        ) : (
          <p>No weapon selected</p>
        )}
      </Modal>
    </>
  );
}
