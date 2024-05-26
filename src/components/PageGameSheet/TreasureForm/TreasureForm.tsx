import { Loot } from "@/data/definitions";
import { generateLoot } from "@/support/diceSupport";
import { Button, Flex, InputNumber, Select, SelectProps } from "antd";
import React from "react";

interface TreasureFormProps {
  type: 0 | 1 | 2;
  setResults: React.Dispatch<React.SetStateAction<Loot | undefined>>;
}

const TreasureForm: React.FC<TreasureFormProps> = ({ type, setResults }) => {
  const treasureInputValue = React.useRef<number | string | null | undefined>(
    "",
  );
  let treasureInput;
  const treasure0Options: SelectProps["options"] = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
    { value: "E", label: "E" },
    { value: "F", label: "F" },
    { value: "G", label: "G" },
    { value: "H", label: "H*" },
    { value: "I", label: "I" },
    { value: "J", label: "J" },
    { value: "K", label: "K" },
    { value: "L", label: "L" },
    { value: "M", label: "M" },
    { value: "N", label: "N" },
    { value: "O", label: "O" },
  ];
  const treasure1Options: SelectProps["options"] = [
    { value: "P", label: "P" },
    { value: "Q", label: "Q" },
    { value: "R", label: "R" },
    { value: "S", label: "S" },
    { value: "T", label: "T" },
    { value: "U", label: "U" },
    { value: "V", label: "V" },
  ];
  if (type === 0) {
    treasureInput = (
      <Select
        options={treasure0Options}
        onChange={(v) => (treasureInputValue.current = v)}
      />
    );
  }
  if (type === 1) {
    treasureInput = (
      <Select
        options={treasure1Options}
        onChange={(v) => (treasureInputValue.current = v)}
      />
    );
  }
  if (type === 2) {
    treasureInput = (
      <InputNumber
        min={1}
        defaultValue={1}
        onChange={(v) => (treasureInputValue.current = v)}
      />
    );
  }
  return (
    <Flex vertical gap={8} align="flex-start">
      {treasureInput}
      <Button
        type="primary"
        onClick={() =>
          setResults(generateLoot(treasureInputValue.current ?? ""))
        }
      >
        Generate
      </Button>
    </Flex>
  );
};

export default TreasureForm;
