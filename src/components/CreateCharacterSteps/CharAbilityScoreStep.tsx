import { Button, Input, Space, Table } from "antd";

const columns = [
  {
    title: "Ability",
    dataIndex: "ability",
    key: "ability",
  },
  {
    title: "Score",
    dataIndex: "score",
    key: "score",
    // need a render key here to implement an input and roll button
  },
];

const dataSource = [
  {
    key: "1",
    ability: "Strength",
    score: "12",
  },
];

type CharAbilityScoreStepProps = {};

export default function CharAbilityScoreStep(props: CharAbilityScoreStepProps) {
  return (
    <>
      <Space.Compact>
        <Input defaultValue="POC for table" />
        <Button type="primary" onClick={() => console.log("Boop")}>
          Boop
        </Button>
      </Space.Compact>
      <Table columns={columns} dataSource={dataSource} pagination={false} />
    </>
  );
}
