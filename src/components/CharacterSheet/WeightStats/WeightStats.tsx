import { Descriptions, Divider } from "antd";
import { getCarryingCapacity } from "../../../support/formatSupport";
import SimpleNumberStat from "../SimpleNumberStat/SimpleNumberStat";
import { WeightStatsProps } from "./definitions";
import { RaceNames } from "../../../data/definitions";

export default function WeightStats({
  characterData,
  className,
}: WeightStatsProps & React.ComponentPropsWithRef<"div">) {
  const capacity = getCarryingCapacity(
    +characterData.abilities.scores.strength,
    characterData.race as RaceNames
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
      <Divider className="border-seaBuckthorn" />
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
