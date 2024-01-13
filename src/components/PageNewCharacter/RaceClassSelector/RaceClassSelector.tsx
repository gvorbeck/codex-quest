import { Flex, Input, Select, SelectProps, Switch, Typography } from "antd";
import React from "react";
import HomebrewWarning from "@/components/HomebrewWarning/HomebrewWarning";
import Checkbox, { CheckboxGroupProps } from "antd/es/checkbox";
import spells from "@/data/spells.json";

interface RaceClassSelectorProps {
  selectOptions: SelectProps["options"];
  selector: string;
  handleSelectChange: (value: string) => void;
  customInput: string;
  handleCustomInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: "race" | "class";
}

const RaceClassSelector: React.FC<
  RaceClassSelectorProps & React.ComponentPropsWithRef<"div">
> = ({
  selectOptions,
  selector,
  handleSelectChange,
  customInput,
  handleCustomInputChange,
  type,
}) => {
  const [showSpells, setShowSpells] = React.useState<boolean>(false);

  const handleStartingSpellsSwitchChange = (checked: boolean) => {
    setShowSpells(checked);
  };

  const options: CheckboxGroupProps["options"] = spells.map((spell) => ({
    label: spell.name,
    value: spell.name,
  }));
  return (
    <>
      <Select
        options={selectOptions}
        value={selector}
        onChange={handleSelectChange}
        placeholder={`Select your ${type}`}
      />
      {selector === "Custom" && (
        <Flex vertical gap={16}>
          <HomebrewWarning homebrew={type} />
          <Input value={customInput} onChange={handleCustomInputChange} />
          <Flex vertical gap={8}>
            <Flex gap={8}>
              <Typography.Text>Add Starting Spells?</Typography.Text>
              <Switch onChange={handleStartingSpellsSwitchChange} />
            </Flex>
            {showSpells && (
              <Checkbox.Group
                className="grid grid-cols-2 items-center gap-2"
                options={options}
              />
            )}
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default RaceClassSelector;
