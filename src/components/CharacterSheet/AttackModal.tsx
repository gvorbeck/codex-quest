import {
  Button,
  Modal,
  Radio,
  RadioChangeEvent,
  Space,
  Switch,
  notification,
} from "antd";
import { AttackButtonsProps, AttackModalProps } from "../types";
import { useState } from "react";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";

const roller = new DiceRoller();

const openAttackNotification = (result: number) => {
  notification.open({
    message: "Attack Roll",
    description: `${result} (+2 if attacking from behind)`,
    duration: 0,
    className: "!bg-seaBuckthorn",
  });
};

const openDamageNotification = (result: number) => {
  notification.open({
    message: "Damage Roll",
    description: `${result}`,
    duration: 0,
    className: "!bg-seaBuckthorn",
  });
};

function AttackButtons({ weapon, damage, attack, type }: AttackButtonsProps) {
  return (
    <div>
      <Button type="primary" onClick={() => attack(type)}>
        Attack Roll
      </Button>
      <Button
        type="default"
        onClick={() => weapon.damage && damage(weapon.damage)}
      >
        Damage Roll
      </Button>
    </div>
  );
}

export default function AttackModal({
  isAttackModalOpen,
  handleCancel,
  attackBonus,
  character,
  weapon,
}: AttackModalProps) {
  const [isMissile, setisMissile] = useState(false);
  const [missileRangeBonus, setMissileRangeBonus] = useState(0);

  const handleSwitchChange = () => setisMissile(!isMissile);
  const handleRangeChange = (e: RadioChangeEvent) => {
    setMissileRangeBonus(e.target.value);
  };

  let missileRangeValues = [0, 0, 0];
  switch (weapon.name) {
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
      missileRangeValues = [30, 60, 90];
      break;
    case "Spear":
    case "Warhammer":
    case "Hand Axe":
    case "Dagger":
    case "Silver† Dagger":
      missileRangeValues = [10, 20, 30];
      break;
    default:
      missileRangeValues = [0, 0, 0];
      break;
  }

  const attack = (type: "melee" | "missile") => {
    let result = roller.roll("1d20").total;
    if (type === "melee") {
      result += +character.abilities.modifiers.strength + attackBonus;
    } else {
      result +=
        +character.abilities.modifiers.dexterity +
        attackBonus +
        (character.race === "Halfling" ? 1 : 0) +
        missileRangeBonus;
    }
    openAttackNotification(result);
  };

  const damage = (roll: string) => {
    let result = roller.roll(roll).total;
    openDamageNotification(result);
  };

  return (
    <Modal
      title={`Attack with ${weapon.name}`}
      open={isAttackModalOpen}
      onCancel={handleCancel}
      footer={false}
    >
      {/* {weapon.type === "melee" && <div>hello world</div>} */}
      {weapon.type === "missile" && <div>jello world</div>}
      {weapon.type === "both" && (
        <Space direction="vertical">
          <Switch
            unCheckedChildren="Melee Attack"
            checkedChildren="Missile Attack"
            onChange={handleSwitchChange}
          />
          {isMissile ? (
            <>
              <Radio.Group
                value={missileRangeBonus}
                onChange={handleRangeChange}
              >
                <Radio value={1}>
                  Short Range (+1): {missileRangeValues[0]}'
                </Radio>
                <Radio value={0}>
                  Medium Range (+0): {missileRangeValues[1]}'
                  <Radio value={-2}>
                    Long Range (-2): {missileRangeValues[2]}'
                  </Radio>
                </Radio>
              </Radio.Group>
              <AttackButtons
                weapon={weapon}
                damage={damage}
                attack={attack}
                type="missile"
              />
            </>
          ) : (
            <AttackButtons
              weapon={weapon}
              damage={damage}
              attack={attack}
              type="melee"
            />
          )}
        </Space>
      )}
    </Modal>
  );
}
