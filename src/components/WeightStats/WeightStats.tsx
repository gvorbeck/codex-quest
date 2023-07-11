import { Descriptions, Divider } from "antd";
import { CharacterDetails } from "../types";
import { calculateCarryingCapacity } from "../../support/formatSupport";
import SimpleNumberStat from "../CharacterSheet/SimpleNumberStat/SimpleNumberStat";

export default function WeightStats({
  character,
  setCharacter,
}: CharacterDetails) {
  const capacity = calculateCarryingCapacity(
    +character.abilities.scores.strength,
    character.race
  );
  const weight = character.equipment.reduce(
    (accumulator, currentValue) =>
      accumulator + (currentValue.weight ?? 0) * (currentValue.amount ?? 0),
    0
  );

  return (
    <div className="text-center">
      <SimpleNumberStat
        title="Weight"
        value={weight.toFixed(0)}
        helpText={`Stay under ${capacity.light} to remain "Lightly Loaded"`}
      />
      <Divider />
      <Descriptions bordered>
        <Descriptions.Item label="Max" span={3}>
          {capacity.heavy}
        </Descriptions.Item>
        <Descriptions.Item label="Load">
          {weight < capacity.light ? "Lightly Loaded" : "Heavily Loaded"}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}
