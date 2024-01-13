import React from "react";
import { CharData, ClassNames, RaceNames } from "@/data/definitions";
import { Flex, Select, Typography } from "antd";
import { races } from "@/data/races";
import { DefaultOptionType } from "antd/es/select";

interface ComboClassOptionsProps {
  character: CharData;
  setCharacter: (character: CharData) => void;
  firstClass: ClassNames;
  secondClass: ClassNames | undefined;
  setSecondClass: (secondClass: ClassNames) => void;
}

const ComboClassOptions: React.FC<
  ComboClassOptionsProps & React.ComponentPropsWithRef<"div">
> = ({
  className,
  character,
  // setCharacter,
  firstClass,
  secondClass,
  setSecondClass,
}) => {
  const comboClassOptions = races[
    character.race as RaceNames
  ]?.allowedCombinationClasses
    ?.map((className: ClassNames) => {
      if (className !== ClassNames.MAGICUSER) {
        return { value: className, label: className };
      }
      return null;
    })
    .filter(Boolean) as DefaultOptionType[];

  const handleSecondClassChange = (value: ClassNames) => {
    setSecondClass(value);
  };

  return (
    <Flex vertical gap={16} className={className}>
      <Flex vertical gap={8}>
        <Typography.Text>First Class</Typography.Text>
        <Select
          defaultValue={firstClass}
          options={[{ value: firstClass, label: firstClass }]}
        />
      </Flex>
      <Flex vertical gap={8}>
        <Typography.Text>Second Class</Typography.Text>
        <Select
          options={comboClassOptions}
          value={secondClass}
          onChange={handleSecondClassChange}
        />
      </Flex>
    </Flex>
  );
};

export default ComboClassOptions;
