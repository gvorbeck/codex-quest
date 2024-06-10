import { Loot } from "@/data/definitions";
import { Flex, Radio, RadioChangeEvent } from "antd";
import React from "react";
import TreasureForm from "../TreasureForm/TreasureForm";
import TreasureResults from "../TreasureResults/TreasureResults";
import Option from "../Option/Option";

const TreasureGenerator: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
}) => {
  const [treasureType, setTreasureType] = React.useState<0 | 1 | 2>(0);
  const [results, setResults] = React.useState<Loot | undefined>(undefined);

  function handleTreasureFormChange(e: RadioChangeEvent) {
    setTreasureType(e.target.value);
    setResults(undefined);
  }

  console.log("results", results);

  return (
    <Flex className={className} vertical gap={16}>
      <Radio.Group
        value={treasureType}
        onChange={handleTreasureFormChange}
        buttonStyle="solid"
      >
        <Option value={0} title="Lair Treasure" />
        <Option value={1} title="Individual Treasures" />
        <Option value={2} title="Unguarded Treasure" />
      </Radio.Group>
      <Flex className="[&>*]:flex-1" vertical>
        <TreasureForm type={treasureType} setResults={setResults} />
        {results && <TreasureResults results={results} />}
      </Flex>
    </Flex>
  );
};

export default TreasureGenerator;
