import React from "react";
import { Abilities } from "@/data/definitions";
import { Table } from "antd";
import { ColumnType } from "antd/es/table";
import { CharacterDataContext } from "@/store/CharacterContext";

interface DataType {
  key: string;
  ability: keyof Abilities;
  score: number;
  modifier: string;
}

const columns: ColumnType<DataType>[] = [
  {
    title: "Ability",
    dataIndex: "ability",
    key: "ability",
  },
  {
    title: "Score",
    dataIndex: "score",
    key: "score",
  },
  {
    title: "Modifier",
    dataIndex: "modifier",
    key: "modifier",
  },
];

const abilityOrder = [
  "strength",
  "intelligence",
  "wisdom",
  "dexterity",
  "constitution",
  "charisma",
];

const AbilitiesTable: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
}) => {
  const { character } = React.useContext(CharacterDataContext);
  const dataSource: DataType[] = Object.entries(character.abilities.scores)
    .sort(([a], [b]) => abilityOrder.indexOf(a) - abilityOrder.indexOf(b))
    .map(([abilityKey, scoreValue], index) => ({
      key: index + 1 + "",
      ability: abilityKey.toUpperCase().slice(0, 3) as keyof Abilities,
      score: +scoreValue,
      modifier:
        character.abilities.modifiers[abilityKey as keyof Abilities].toString(),
    }));

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

export default AbilitiesTable;
