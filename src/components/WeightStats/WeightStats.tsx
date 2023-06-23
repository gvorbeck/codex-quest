import { Divider, Typography } from "antd";
import { CharacterDetails } from "../types";
import calculateCarryingCapacity from "../calculateCarryingCapacity";
import HelpTooltip from "../HelpTooltip/HelpTooltip";

export default function WeightStats({
  character,
  setCharacter,
}: CharacterDetails) {
  const capacity = calculateCarryingCapacity(
    +character.abilities.scores.strength,
    character.race
  );
  return (
    <div className="text-center">
      <Typography.Title level={3} className="mt-0 !text-shipGray">
        Weight
      </Typography.Title>
      <Typography.Text className="text-6xl font-bold !text-shipGray">
        {character.weight.toFixed(0)}
      </Typography.Text>
      <Divider />
      <Typography.Paragraph className="text-3xl font-bold !text-shipGray !mb-3">
        Max: {capacity.heavy}
        <HelpTooltip
          text={`Stay under ${capacity.light} to remain "Lightly Loaded"`}
          className="relative -top-1 ml-2"
        />
      </Typography.Paragraph>
      <Typography.Text>
        {character.weight < capacity.light
          ? "(Lightly Loaded)"
          : "(Heavily Loaded)"}
      </Typography.Text>
    </div>
  );
}
