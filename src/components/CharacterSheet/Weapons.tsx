import { List } from "antd";
import { CharacterDetails } from "../types";

export default function Weapons({ character, setCharacter }: CharacterDetails) {
  const weaponItems = character.equipment
    .filter(
      (items) =>
        items.category === "axes" ||
        items.category === "bows" ||
        items.category === "daggers" ||
        items.category === "swords" ||
        items.category === "hammers-and-maces"
    )
    .sort((a, b) => a.name.localeCompare(b.name));
  return (
    <List
      header={"Equipment Items"}
      bordered
      dataSource={weaponItems}
      renderItem={(thisItem) => (
        <List.Item>
          {thisItem.name}
          {` x${thisItem.amount}`}
        </List.Item>
      )}
    />
  );
}
