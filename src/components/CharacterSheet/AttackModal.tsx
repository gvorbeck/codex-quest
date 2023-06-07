import { Button, Modal, Radio, RadioChangeEvent, Space, Switch } from "antd";
import { AttackModalProps } from "../types";
import { useEffect, useState } from "react";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";

const roller = new DiceRoller();

export default function AttackModal({
  isAttackModalOpen,
  handleCancel,
  attackBonus,
  character,
  weapon,
}: AttackModalProps) {
  const [isMissile, setisMissile] = useState(false);
  const [missileRangeBonus, setMissileRangeBonus] = useState(null);

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

  // Some of this code may have been duplicated in AttackBonus.tsx
  // TODO: refactor that duplication
  const attack = (type: "melee" | "missile") => {
    console.log(type);
    let result = roller.roll("1d20").total;
    console.log(result);
    if (type === "melee") {
      result += +character.abilities.modifiers.strength + attackBonus;
    } else {
      result += +character.abilities.modifiers.dexterity + attackBonus;
    }
    console.log(result);
  };

  useEffect(() => {
    console.log(missileRangeValues, weapon);
  }, [missileRangeValues]);

  return (
    <Modal
      title={`Attack with ${weapon.name}`}
      open={isAttackModalOpen}
      onCancel={handleCancel}
      footer={false}
    >
      {weapon.type === "melee" && <div>hello world</div>}
      {weapon.type === "missile" && <div>jello world</div>}
      {weapon.type === "both" && (
        <Space direction="vertical">
          <Switch
            unCheckedChildren="Melee Attack"
            checkedChildren="Missile Attack"
            onChange={handleSwitchChange}
          />
          {isMissile ? (
            <Radio.Group value={missileRangeBonus} onChange={handleRangeChange}>
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
          ) : (
            <div>
              <Button type="primary" onClick={() => attack("melee")}>
                Attack Roll
              </Button>
              <Button type="default">Damage Roll</Button>
            </div>
          )}
        </Space>
      )}
    </Modal>
  );
}
