import { Typography } from "antd";
import { CharacterDetails } from "../types";
import calculateCarryingCapacity from "../calculateCarryingCapacity";

export default function Weight({ character, setCharacter }: CharacterDetails) {
  const capacity = calculateCarryingCapacity(
    +character.abilities.scores.strength,
    character.race
  );
  return (
    <div>
      <Typography.Text>weight</Typography.Text>
      <Typography.Text>{character.weight}</Typography.Text>
      <Typography.Text>Max: {capacity.heavy}</Typography.Text>
      <Typography.Text>
        {character.weight < capacity.light
          ? "Lightly Loaded"
          : "Heavily Loaded"}
      </Typography.Text>
    </div>
  );
}
