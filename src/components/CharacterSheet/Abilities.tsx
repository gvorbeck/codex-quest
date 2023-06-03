import { toTitleCase } from "../formatters";
import { CharacterDetails } from "../types";
import { Table } from "antd";

export default function Abilities({ character }: CharacterDetails) {
  const dataSource: {
    key: number;
    ability: string;
    score: any;
    modifier: string | number;
  }[] = [];

  const columns = [
    { title: "Ability", dataIndex: "ability", key: "ability" },
    { title: "Score", dataIndex: "score", key: "score" },
    { title: "Modifier", dataIndex: "modifier", key: "modifier" },
  ];

  Object.entries(character.abilities.scores).forEach(([key, value], index) => {
    dataSource.push({
      key: index + 1,
      ability: toTitleCase(key),
      score: value,
      modifier:
        character.abilities.modifiers[
          key as keyof typeof character.abilities.modifiers
        ],
    });
  });

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      showHeader={false}
      pagination={false}
    />
  );
}
