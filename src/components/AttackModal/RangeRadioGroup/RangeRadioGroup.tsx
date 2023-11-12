import { Radio, RadioChangeEvent } from "antd";

type RangeRadioGroupProps = {
  missileRangeBonus: number;
  handleRangeChange: (e: RadioChangeEvent) => void;
  missileRangeValues: number[];
};

export default function RangeRadioGroup({
  missileRangeBonus,
  handleRangeChange,
  missileRangeValues,
}: RangeRadioGroupProps) {
  return (
    <Radio.Group
      value={missileRangeBonus}
      onChange={handleRangeChange}
      className="flex flex-col gap-2 mt-2"
    >
      <Radio value={1}>Short Range (+1): {missileRangeValues[0]}'</Radio>
      <Radio value={0}>Medium Range (+0): {missileRangeValues[1]}'</Radio>
      <Radio value={-2}>Long Range (-2): {missileRangeValues[2]}'</Radio>
    </Radio.Group>
  );
}
