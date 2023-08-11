import { Descriptions, Divider } from "antd";
import { calculateCarryingCapacity } from "../../../support/formatSupport";
import SimpleNumberStat from "../SimpleNumberStat/SimpleNumberStat";
import { WeightStatsProps } from "./definitions";

export default function WeightStats({
  characterData,
  className,
}: WeightStatsProps) {
  const capacity = calculateCarryingCapacity(
    +characterData.abilities.scores.strength,
    characterData.race
  );
  const weight = characterData.equipment.reduce(
    (accumulator, currentValue) =>
      accumulator + (currentValue.weight ?? 0) * (currentValue.amount ?? 0),
    0
  );

  return (
    <div className={`${className} text-center`}>
      <SimpleNumberStat
        title="Weight"
        value={weight.toFixed(0)}
        helpText={`Stay under ${capacity.light} to remain "Lightly Loaded"`}
      />
      <Divider />
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Max Weight">
          {capacity.heavy}
        </Descriptions.Item>
        <Descriptions.Item label="Load">
          {weight < capacity.light ? "Lightly Loaded" : "Heavily Loaded"}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}
