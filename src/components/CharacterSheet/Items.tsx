import { List } from "antd";
import { CharacterDetails } from "../types";

export default function Items({ character, setCharacter }: CharacterDetails) {
  const miscItems = character.equipment
    .filter((items) => items.category === "items")
    .sort((a, b) => a.name.localeCompare(b.name));
  return (
    <List
      header={
        "Equipment Items (maybe a button to ADD an item) (Maybe combine these components for reuse)"
      }
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
