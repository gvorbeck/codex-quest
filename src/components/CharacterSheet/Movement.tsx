import { Typography } from "antd";
import calculateCarryingCapacity from "../calculateCarryingCapacity";
import { CharacterDetails } from "../types";

export default function Movement({ character }: CharacterDetails) {
  const carryingCapacity = calculateCarryingCapacity(
    +character.abilities.scores.strength,
    character.race
  );
  let movement;
  if (
    character.equipment.find((item) => item.name === "No Armor") ||
    character.equipment.find((item) => item.name === "Magic Leather Armor")
  ) {
    movement = character.weight >= carryingCapacity.light ? 40 : 30;
  } else if (
    character.equipment.find((item) => item.name === "Leather Armor") ||
    character.equipment.find((item) => item.name === "Magic Metal Armor")
  ) {
    movement = character.weight >= carryingCapacity.light ? 30 : 20;
  } else if (character.equipment.find((item) => item.name === "Metal Armor")) {
    movement = character.weight >= carryingCapacity.light ? 20 : 10;
  }
  return (
    <div>
      <Typography.Title level={3}>Movement</Typography.Title>
      <Typography.Text>{movement}'</Typography.Text>
    </div>
  );
}
