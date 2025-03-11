import React from "react";
import { ColumnType } from "antd/es/table";
import { Table } from "antd";
import { CharacterDataContext } from "@/store/CharacterContext";
import {
  getAttackBonus,
  getRaceRangedAttackBonus,
} from "@/support/statSupport";

interface DataType {
  key: string;
  bonus: string;
  score: number;
}

const columns: ColumnType<DataType>[] = [
  {
    title: "Bonus",
    dataIndex: "bonus",
    key: "bonus",
  },
  {
    title: "Score",
    dataIndex: "score",
    key: "score",
  },
];

const AttackBonuses: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
}) => {
  const { character } = React.useContext(CharacterDataContext);
  const baseAttackBonus = getAttackBonus(character);
  const rangedRaceBonus = getRaceRangedAttackBonus(character);
  const dataSource: DataType[] = [
    { key: "1", bonus: "Base Attack Bonus", score: baseAttackBonus },
    {
      key: "2",
      bonus: "Melee Attack Bonus",
      score: baseAttackBonus + +character.abilities.modifiers.strength,
    },
    {
      key: "3",
      bonus: "Ranged Attack Bonus",
      score:
        baseAttackBonus +
        +character.abilities.modifiers.dexterity +
        (rangedRaceBonus ?? 0),
    },
  ];
  return (
    <Table
      className={className}
      dataSource={dataSource}
      columns={columns}
      bordered
      pagination={false}
    />
  );
};

export default AttackBonuses;
