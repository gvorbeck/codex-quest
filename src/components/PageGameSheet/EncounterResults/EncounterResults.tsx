import { Monster } from "@/data/definitions";
import { Button, Flex, InputNumber, Typography } from "antd";
import React from "react";
import MonsterInfo from "../GameBinder/Monsters/MonsterInfo/MonsterInfo";

interface EncounterResultsProps {
  results: string | Monster | undefined;
}

const EncounterResults: React.FC<EncounterResultsProps> = ({ results }) => {
  console.log("results", results);
  if (!results) {
    return <Typography.Text>No results</Typography.Text>;
  }
  if (typeof results === "string") {
    return <Typography.Text>{results}</Typography.Text>;
  }
  return (
    <div>
      <Flex gap={8} align="center">
        <Typography.Text>Add # to Round Tracker</Typography.Text>
        <InputNumber min={1} defaultValue={1} />
        <Button type="primary">Add</Button>
      </Flex>
      <Typography.Title level={5}>{results.name}</Typography.Title>
      <MonsterInfo monster={results} />
    </div>
  );
};

export default EncounterResults;
