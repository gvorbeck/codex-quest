import { Monster } from "@/data/definitions";
import { Button, Flex, InputNumber, Typography } from "antd";
import React from "react";
import MonsterInfo from "../GameBinder/Monsters/MonsterInfo/MonsterInfo";
import { GameDataContext } from "@/store/GameDataContext";

interface EncounterResultsProps {
  results: string | Monster | undefined;
}

const EncounterResults: React.FC<EncounterResultsProps> = ({ results }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { addToTurnTracker } = React.useContext(GameDataContext);

  console.log("results", results);

  if (!results) {
    return <Typography.Text>No results</Typography.Text>;
  }
  if (typeof results === "string") {
    return <Typography.Text>{results}</Typography.Text>;
  }

  function handleAddMonsterClick() {
    if (!inputRef.current?.value || !results || typeof results === "string")
      return;
    for (let i = 0; i < +inputRef.current?.value; i++) {
      addToTurnTracker(
        {
          name: results.name,
          initiative: 0,
          type: "monster",
          tags: [],
          avatar: "",
        },
        "monster",
      );
    }
  }

  return (
    <div>
      <Flex gap={8} align="center">
        <Typography.Text>Add # to Round Tracker</Typography.Text>
        <InputNumber min={1} defaultValue={1} ref={inputRef} />
        <Button type="primary" onClick={handleAddMonsterClick}>
          Add
        </Button>
      </Flex>
      <Typography.Title level={5}>{results.name}</Typography.Title>
      <MonsterInfo monster={results} />
    </div>
  );
};

export default EncounterResults;
