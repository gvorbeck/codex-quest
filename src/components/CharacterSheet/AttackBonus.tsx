import { Table, Typography } from "antd";
import { AttackBonusProps } from "../types";
import HelpTooltip from "../HelpTooltip/HelpTooltip";

export default function AttackBonus({
  character,
  attackBonus,
}: AttackBonusProps) {
  const rangedRaceBonus = character.race === "Halfling" ? 1 : 0;

  const dataSource = [
    { key: 1, label: "Attack Bonus", bonus: attackBonus },
    {
      key: 2,
      label: "Melee Attack Bonus",
      bonus: attackBonus + +character.abilities.modifiers.strength,
    },
    {
      key: 3,
      label: "Ranged Attack Bonus",
      bonus:
        attackBonus +
        +character.abilities.modifiers.dexterity +
        rangedRaceBonus,
    },
  ];

  const columns = [
    { title: "Bonus", dataIndex: "label", key: "label" },
    { title: "Value", dataIndex: "bonus", key: "bonus" },
  ];

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <Typography.Title level={3} className="mt-0 text-shipGray">
          Attack Bonuses
        </Typography.Title>
        <HelpTooltip text="Melee attacks use STR modifier + AB. Missile attacks use DEX modifier + AB." />
      </div>
      <Table
        size="small"
        dataSource={dataSource}
        columns={columns}
        showHeader={false}
        pagination={false}
      />
    </div>
  );
}
