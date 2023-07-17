import {
  Button,
  Modal,
  Radio,
  RadioChangeEvent,
  Switch,
  notification,
} from "antd";
import { AttackButtonsProps, RangeRadioButtons } from "../components/types";
import { useState } from "react";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import ModalCloseIcon from "./ModalCloseIcon/ModalCloseIcon";
import { AttackModalProps } from "./definitions";

const roller = new DiceRoller();

function AttackButtons({
  weapon,
  damage,
  attack,
  type,
  className,
}: AttackButtonsProps) {
  return (
    <div className={className}>
      <Button type="primary" onClick={() => attack(type)}>
        Attack Roll
      </Button>
      <Button
        type="default"
        onClick={() => weapon.damage && damage(weapon.damage)}
        className="ml-2"
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

export default function AttackModal({
  isAttackModalOpen,
  handleCancel,
  attackBonus,
  characterData,
  weapon,
}: AttackModalProps) {
  const [isMissile, setisMissile] = useState(false);
  const [missileRangeBonus, setMissileRangeBonus] = useState(0);

  const [api, contextHolder] = notification.useNotification();

  const openAttackNotification = (result: string) => {
    api.open({
      message: "Attack Roll",
      description: `${result} (+2 if attacking from behind)`,
      duration: 0,
      className: "!bg-seaBuckthorn",
    });
  };

  const openDamageNotification = (result: string) => {
    api.open({
      message: "Damage Roll",
      description: `${result}`,
      duration: 0,
      className: "!bg-seaBuckthorn",
    });
  };

  const handleSwitchChange = () => setisMissile(!isMissile);
  const handleRangeChange = (e: RadioChangeEvent) => {
    setMissileRangeBonus(e.target.value);
  };

  let missileRangeValues = [0, 0, 0];
  switch (weapon?.name) {
    case "Longbow":
      missileRangeValues = [70, 140, 210];
      break;
    case "Shortbow":
      missileRangeValues = [50, 100, 150];
      break;
    case "Heavy Crossbow":
      missileRangeValues = [80, 160, 240];
      break;
    case "Light Crossbow":
      missileRangeValues = [60, 120, 180];
      break;
    case "Oil":
    case "Holy Water":
      missileRangeValues = [10, 30, 50];
      break;
    case "Sling":
    case "Hand Crossbow":
      missileRangeValues = [30, 60, 90];
      break;
    case "Spear":
    case "Warhammer":
    case "Hand Axe":
    case "Dagger":
    case "Silver† Dagger":
    case "Blowgun":
    case "Dart/Throwing Blade":
    case "Boar Spear":
    case "Fork":
    case "Trident":
      missileRangeValues = [10, 20, 30];
      break;
    case "Bola":
    case "Javelin":
      missileRangeValues = [20, 40, 60];
      break;
    case "Net":
      missileRangeValues = [10, 15, 20];
      break;
    default:
      missileRangeValues = [0, 0, 0];
      break;
  }

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

  const damage = (roll: string) =>
    openDamageNotification(roller.roll(roll).output);

  return (
    <>
      {contextHolder}
      <Modal
        title={`Attack with ${weapon?.name || "weapon"}`}
        open={isAttackModalOpen}
        onCancel={handleCancel}
        footer={false}
        closeIcon={<ModalCloseIcon />}
      >
        {weapon ? (
          <div>
            {weapon.type === "melee" && (
              <AttackButtons
                weapon={weapon}
                damage={damage}
                attack={attack}
                type="melee"
                className="mt-2"
              />
            )}
            {weapon.type === "missile" && (
              <>
                <RangeRadioGroup
                  missileRangeBonus={missileRangeBonus}
                  handleRangeChange={handleRangeChange}
                  missileRangeValues={missileRangeValues}
                />
                <AttackButtons
                  weapon={weapon}
                  damage={damage}
                  attack={attack}
                  type="missile"
                  className="mt-2"
                />
              </>
            )}
            {weapon.type === "both" && (
              <div>
                <Switch
                  unCheckedChildren="Melee Attack"
                  checkedChildren="Missile Attack"
                  onChange={handleSwitchChange}
                />
                {isMissile ? (
                  <>
                    <RangeRadioGroup
                      missileRangeBonus={missileRangeBonus}
                      handleRangeChange={handleRangeChange}
                      missileRangeValues={missileRangeValues}
                    />
                    <AttackButtons
                      weapon={weapon}
                      damage={damage}
                      attack={attack}
                      type="missile"
                      className="mt-2"
                    />
                  </>
                ) : (
                  <AttackButtons
                    weapon={weapon}
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
