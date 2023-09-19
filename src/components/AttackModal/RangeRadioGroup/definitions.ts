import { RadioChangeEvent } from "antd";

export type RangeRadioGroupProps = {
  missileRangeBonus: number;
  handleRangeChange: (e: RadioChangeEvent) => void;
  missileRangeValues: number[];
};
