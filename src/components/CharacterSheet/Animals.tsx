import { List } from "antd";
import { CharacterDetails } from "../types";

export default function Animals({ character, setCharacter }: CharacterDetails) {
  const miscItems = character.equipment
    .filter((items) => items.category === "beasts-of-burden")
    .sort((a, b) => a.name.localeCompare(b.name));
  return (
    <List
      header={"Animal Items (maybe a button to ADD an item)"}
      bordered
      dataSource={miscItems}
      renderItem={(thisItem) => (
        <List.Item>
          {thisItem.name}
          {` x${thisItem.amount}`}
        </List.Item>
      )}
    />
  );
}
