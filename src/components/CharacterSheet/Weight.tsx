import { Divider, Typography } from "antd";
import { CharacterDetails } from "../types";
import calculateCarryingCapacity from "../calculateCarryingCapacity";

export default function Weight({ character, setCharacter }: CharacterDetails) {
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
        {character.weight.toFixed(2)}
      </Typography.Text>
      <Divider />
      <Typography.Paragraph className="text-3xl font-bold !text-shipGray !mb-3">
        Max: {capacity.heavy}
      </Typography.Paragraph>
      <Typography.Text>
        {character.weight < capacity.light
          ? "(Lightly Loaded)"
          : "(Heavily Loaded)"}
      </Typography.Text>
    </div>
  );
}
