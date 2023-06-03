import { Typography } from "antd";
import { CharacterDetails } from "../types";

export default function ArmorClass({ character }: CharacterDetails) {
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
    <div className="text-center">
      <Typography.Title level={3} className="mt-0 text-shipGray">
        Armor Class
      </Typography.Title>
      <Typography.Text className="text-6xl font-bold text-shipGray">
        {armorClass}
      </Typography.Text>
    </div>
  );
}
