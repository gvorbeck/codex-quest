import { List } from "antd";
import { EquipmentListProps } from "../types";

export default function EquipmentList({
  character,
  setCharacter,
  categories,
  header,
}: EquipmentListProps) {
  let equipmentItems;
  if (typeof categories === "string") {
    equipmentItems = character.equipment
      .filter((items) => items.category === categories)
      .sort((a, b) => a.name.localeCompare(b.name));
  } else {
    equipmentItems = character.equipment
      .filter((item) => categories.includes(item.category))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
  return (
    <List
      header={header}
      bordered
      dataSource={equipmentItems}
      renderItem={(item) => <List.Item>{item.name}</List.Item>}
    />
  );
}
