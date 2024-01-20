import { Flex, Select, SelectProps } from "antd";
import React from "react";

interface WCombinationClassSelectProps {
  combinationClassOptions:
    | [SelectProps["options"], SelectProps["options"]]
    | [];
  setFirstCombinationClass: (value: string | undefined) => void;
  setSecondCombinationClass: (value: string | undefined) => void;
  firstCombinationClass: string | undefined;
  secondCombinationClass: string | undefined;
}

const WCombinationClassSelect: React.FC<
  WCombinationClassSelectProps & React.ComponentPropsWithRef<"div">
> = ({
  className,
  combinationClassOptions,
  setFirstCombinationClass,
  setSecondCombinationClass,
  firstCombinationClass,
  secondCombinationClass,
}) => {
  const onFirstCombinationClassSelectChange = (value: string) =>
    setFirstCombinationClass(value);
  const onSecondCombinationClassSelectChange = (value: string) =>
    setSecondCombinationClass(value);
  return (
    <Flex gap={16} vertical className={className}>
      <Select
        placeholder="Choose the first combination class"
        options={combinationClassOptions[0]}
        value={firstCombinationClass}
        onChange={onFirstCombinationClassSelectChange}
      />
      <Select
        placeholder="Choose the second combination class"
        options={combinationClassOptions[1]}
        value={secondCombinationClass}
        onChange={onSecondCombinationClassSelectChange}
      />
    </Flex>
  );
};

export default WCombinationClassSelect;
