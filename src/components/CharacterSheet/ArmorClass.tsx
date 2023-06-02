import { Typography } from "antd";
import { CharacterDetails } from "../types";

export default function ArmorClass({
  character,
  setCharacter,
}: CharacterDetails) {
  let armorClass = 11;
  if (character.equipment.find((item) => item.name === "Leather Armor")) {
    armorClass = 13;
  } else if (
    character.equipment.find((item) => item.name === "Chain Mail Armor")
  ) {
    armorClass = 15;
  } else if (
    character.equipment.find((item) => item.name === "Plate Mail Armor")
  ) {
    armorClass = 17;
  }

  if (character.equipment.find((item) => item.name === "Shield")) armorClass++;

  armorClass += +character.abilities.modifiers.dexterity;
  return (
    <div>
      <Typography.Text>Armor Class</Typography.Text>
      <Typography.Text>{armorClass}</Typography.Text>
    </div>
  );
}
