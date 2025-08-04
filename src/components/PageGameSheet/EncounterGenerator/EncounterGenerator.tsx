import {
  EncounterDetails,
  EncounterEnvironment,
  Monster,
  WildernessSubEnvironments,
} from "@/data/definitions";
import { Flex, Radio, RadioChangeEvent, SelectProps } from "antd";
import React from "react";
import Option from "../Option/Option";
import EncounterOptionSelect from "../EncounterOptionSelect/EncounterOptionSelect";
import EncounterResults from "../EncounterResults/EncounterResults";

const EncounterGenerator: React.FC = () => {
  const [encounterType, setEncounterType] = React.useState<
    EncounterEnvironment | undefined
  >(undefined);
  const [dungeonLevel, setDungeonLevel] = React.useState<string | undefined>(
    undefined,
  );
  const [wildernessEnvironment, setWildernessEnvironment] = React.useState<
    string | undefined
  >(undefined);
  const [urbanTime, setUrbanTime] = React.useState<string | undefined>(
    undefined,
  );
  const [results, setResults] = React.useState<string | Monster | undefined>(
    undefined,
  );

  function handleEncounterTypeChange(e: RadioChangeEvent) {
    setEncounterType(e.target.value);
  }
  function handleDungeonLevelChange(value: string) {
    setDungeonLevel(value);
  }
  function handleWildernessEnvironmentChange(value: string) {
    setWildernessEnvironment(value);
  }
  function handleUrbanTimeChange(value: string) {
    setUrbanTime(value);
  }

  const dungeonLevelOptions: SelectProps["options"] = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8+" },
  ];
  const wildernessEnvironmentOptions: SelectProps["options"] = [
    { value: "desert-or-barren", label: "Desert or Barren" },
    { value: "grassland", label: "Grassland" },
    { value: "inhabited-territories", label: "Inhabited Territories" },
    { value: "jungle", label: "Jungle" },
    { value: "mountains-or-hills", label: "Mountains or Hills" },
    { value: "ocean", label: "Ocean" },
    { value: "river-or-riverside", label: "River or Riverside" },
    { value: "swamp", label: "Swamp" },
    { value: "woods-or-forest", label: "Woods or Forest" },
  ];
  const urbanTimeOptions: SelectProps["options"] = [
    { value: "day", label: "Day" },
    { value: "night", label: "Night" },
  ];

  return (
    <Flex gap={8} vertical align="flex-start">
      <Radio.Group
        value={encounterType}
        onChange={handleEncounterTypeChange}
        buttonStyle="solid"
      >
        <Option value="dungeon" title="Dungeon Encounter" />
        <Option value="wilderness" title="Wilderness Encounter" />
        <Option value="urban" title="Town, City, or Village Encounter" />
      </Radio.Group>
      <Flex className="*:w-1/2 w-full">
        {encounterType === "dungeon" && (
          <EncounterOptionSelect
            label="Level"
            onChange={handleDungeonLevelChange}
            options={dungeonLevelOptions}
            placeholder="Select an encounter level"
            value={dungeonLevel}
            type={encounterType}
            typeOption={{ level: parseInt(dungeonLevel || "0") }}
            setResults={setResults}
          />
        )}
        {encounterType === "wilderness" && (
          <EncounterOptionSelect
            label="Environment"
            onChange={handleWildernessEnvironmentChange}
            options={wildernessEnvironmentOptions}
            placeholder="Select an environment type"
            value={wildernessEnvironment}
            type={encounterType}
            typeOption={{
              subEnvironment:
                wildernessEnvironment as WildernessSubEnvironments,
            }}
            setResults={setResults}
          />
        )}
        {encounterType === "urban" && (
          <EncounterOptionSelect
            label="Time of Day"
            onChange={handleUrbanTimeChange}
            options={urbanTimeOptions}
            placeholder="Select a time of day"
            value={urbanTime}
            type={encounterType}
            typeOption={{ time: urbanTime as EncounterDetails["time"] }}
            setResults={setResults}
          />
        )}
        {results && <EncounterResults results={results} />}
      </Flex>
    </Flex>
  );
};

export default EncounterGenerator;
