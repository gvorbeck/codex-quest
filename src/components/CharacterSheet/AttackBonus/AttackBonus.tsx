import { Table, Typography } from "antd";
import HelpTooltip from "../../HelpTooltip/HelpTooltip";
import { AttackBonusProps } from "./definitions";
import { RaceNamesTwo } from "../../../data/races";
import { getClassType } from "../../../support/helpers";

export default function AttackBonus({
  characterData,
  attackBonus,
}: AttackBonusProps) {
  // TODO: This is a temporary fix for the ranged attack bonus for halflings. It should be housed in the data file.
  const rangedRaceBonus = characterData.race === RaceNamesTwo.HALFLING ? 1 : 0;

  const dataSource = [
    { key: 1, label: "Attack Bonus", bonus: attackBonus },
    {
      key: 2,
      label: "Melee Attack Bonus",
      bonus: attackBonus + +characterData.abilities.modifiers.strength,
    },
    {
      key: 3,
      label: "Ranged Attack Bonus",
      bonus:
        attackBonus +
        +characterData.abilities.modifiers.dexterity +
        rangedRaceBonus,
    },
  ];

  const columns = [
    { title: "Bonus", dataIndex: "label", key: "label" },
    { title: "Value", dataIndex: "bonus", key: "bonus" },
  ];

  return (
    <div>
      <div className="flex items-baseline gap-4">
        <Typography.Title level={3} className="mt-0 text-shipGray">
          Attack Bonuses
        </Typography.Title>
        <HelpTooltip
          text={`**Melee** attacks use STR modifier + Attack Bonus.\n\n**Missile** attacks use DEX modifier + Attack Bonus.`}
        />
      </div>
      <Table
        size="small"
        dataSource={dataSource}
        columns={columns}
        showHeader={false}
        pagination={false}
      />
      {getClassType(characterData.class) === "custom" && (
        <Typography.Text type="secondary" className="text-xs">
          * Add your custom class's Attack Bonus to these numbers.
        </Typography.Text>
      )}
    </div>
  );
}
