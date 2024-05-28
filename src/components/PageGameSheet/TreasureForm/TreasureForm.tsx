import { Loot } from "@/data/definitions";
import { getLoot } from "@/support/diceSupport";
import {
  Button,
  Flex,
  InputNumber,
  Select,
  SelectProps,
  Typography,
} from "antd";
import React from "react";

interface TreasureFormProps {
  type: 0 | 1 | 2;
  setResults: React.Dispatch<React.SetStateAction<Loot | undefined>>;
}

const TreasureForm: React.FC<TreasureFormProps> = ({ type, setResults }) => {
  const [treasureInputValue, setTreasureInputValue] = React.useState<
    number | string | null | undefined
  >("");
  const [dragonAge, setDragonAge] = React.useState<number | null>(1);

  React.useEffect(() => {
    setTreasureInputValue(undefined);
  }, [type]);

  let treasureInput;
  const treasureLairOptions: SelectProps["options"] = [
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
  const treasureIndvOptions: SelectProps["options"] = [
    { value: "P", label: "P" },
    { value: "Q", label: "Q" },
    { value: "R", label: "R" },
    { value: "S", label: "S" },
    { value: "T", label: "T" },
    { value: "U", label: "U" },
    { value: "V", label: "V" },
  ];

  if (type === 0 || type === 1) {
    treasureInput = (
      <div>
        <Typography.Text className="block">Type</Typography.Text>
        <Select
          options={type === 0 ? treasureLairOptions : treasureIndvOptions}
          value={treasureInputValue as string}
          onChange={(v) => setTreasureInputValue(v)}
        />
      </div>
    );
  }
  if (type === 2) {
    treasureInput = (
      <div>
        <Typography.Text className="block">Level</Typography.Text>
        <InputNumber
          min={1}
          value={treasureInputValue as number}
          onChange={(v) => setTreasureInputValue(v)}
        />
      </div>
    );
  }

  const dragonInput =
    treasureInputValue === "H" ? (
      <div>
        <Typography.Text className="block">Level</Typography.Text>
        <InputNumber
          min={1}
          max={7}
          value={dragonAge as number}
          defaultValue={1}
          onChange={(v) => setDragonAge(v)}
        />
      </div>
    ) : null;
  return (
    <>
      <Flex gap={8} align="flex-end">
        {treasureInput}
        {dragonInput}
        <Button
          type="primary"
          onClick={() =>
            setResults(
              getLoot(
                treasureInputValue ?? "",
                treasureInputValue === "H" ? dragonAge ?? undefined : undefined,
              ),
            )
          }
          disabled={!treasureInputValue}
        >
          Generate
        </Button>
      </Flex>
      {treasureInputValue === "H" && (
        <Typography.Text className="mt-4">
          * Type H treasures are specifically dragon treasure; the chance of
          each type of monetary treasure ranges from 35% at the second age
          category to 85% at the seventh, while the odds of gems, jewelry, and
          magic items are 5% per hit die of the monster. Hatchlings do not
          usually have any treasure.
        </Typography.Text>
      )}
    </>
  );
};

export default TreasureForm;
