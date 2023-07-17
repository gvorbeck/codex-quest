import { toTitleCase } from "../../../support/stringSupport";
import { Table, Typography } from "antd";
import { AbilitiesProps } from "./definitions";

export default function Abilities({ characterData }: AbilitiesProps) {
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

  Object.entries(characterData.abilities.scores).forEach(
    ([key, value], index) => {
      dataSource.push({
        key: index + 1,
        ability: toTitleCase(key),
        score: value,
        modifier:
          characterData.abilities.modifiers[
            key as keyof typeof characterData.abilities.modifiers
          ],
      });
    }
  );

  return (
    <div>
      <Typography.Title level={3} className="mt-0 !text-shipGray">
        Abilities
      </Typography.Title>
      <Table
        dataSource={dataSource}
        columns={columns}
        showHeader={false}
        pagination={false}
        className="[&_td]:print:p-2"
      />
    </div>
  );
}
