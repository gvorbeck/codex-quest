import { WildernessSubEnvironments } from "@/data/definitions";
import { Flex, Select, SelectProps, Typography } from "antd";
import React from "react";

const EncounterOptionWrapper: React.FC = () => {
  return <div>foo</div>;
};

const EncounterGenerator: React.FC = () => {
  const [encounterType, setEncounterType] = React.useState<string | undefined>(
    undefined,
  );
  const [dungeonLevel, setDungeonLevel] = React.useState<string | undefined>(
    undefined,
  );
  const [wildernessEnvironment, setWildernessEnvironment] = React.useState<
    WildernessSubEnvironments | undefined
  >(undefined);

  function handleEncounterTypeChange(value: string) {
    setEncounterType(value);
  }
  function handleDungeonLevelChange(value: string) {
    setDungeonLevel(value);
  }
  function handleWildernessEnvironmentChange(value: WildernessSubEnvironments) {
    setWildernessEnvironment(value);
  }

  const options: SelectProps["options"] = [
    { value: "dungeon", label: "Dungeon Encounter" },
    { value: "wilderness", label: "Wilderness Encounter" },
    { value: "urban", label: "Town, City, or Village Encounter" },
  ];
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
  return (
    <Flex gap={8} vertical align="flex-start">
      <Select
        options={options}
        placeholder="Select an encounter type"
        onChange={handleEncounterTypeChange}
        value={encounterType}
      />
      {encounterType === "dungeon" && (
        <div>
          <Typography.Text className="block">Level</Typography.Text>
          <Select
            options={dungeonLevelOptions}
            placeholder="Select an encounter level"
            onChange={handleDungeonLevelChange}
            value={dungeonLevel}
          />
        </div>
      )}
      {encounterType === "wilderness" && (
        <div>
          <Typography.Text className="block">Environment</Typography.Text>
          <Select
            options={wildernessEnvironmentOptions}
            placeholder="Select an environment type"
            onChange={handleWildernessEnvironmentChange}
            value={wildernessEnvironment}
          />
        </div>
      )}
      {encounterType === "urban" && <div>Urban encounter</div>}
    </Flex>
  );
};

export default EncounterGenerator;
