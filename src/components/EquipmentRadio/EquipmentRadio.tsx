import { Radio } from "antd";
import { EquipmentRadioProps } from "./definitions";

export default function EquipmentRadio({
  item,
  onRadioCheck,
  equipmentItemDescription,
}: EquipmentRadioProps) {
  return (
    <Radio
      value={item.name}
      // disabled={
      //   characterData.class === "Magic-User" ||
      //   // If character is a Thief and category is Armor and is a metal armor
      //   (characterData.class.includes("Thief") &&
      //     item.name !== "No Armor" &&
      //     item.name !== "Leather Armor") ||
      //   disabled
      // }
    >
      {equipmentItemDescription}
    </Radio>
  );
}
// import { Radio, Space, Typography } from "antd";
// import { CharacterData, EquipmentItem } from "../types";

// export default function EquipmentRadio({
//   item,
//   characterData,
//   disabled,
// }: {
//   item: EquipmentItem;
//   characterData: CharacterData;
//   disabled: boolean;
// }) {
//   return (
//     <Radio
//       value={item.name}
//       disabled={
//         characterData.class === "Magic-User" ||
//         // If character is a Thief and category is Armor and is a metal armor
//         (characterData.class.includes("Thief") &&
//           item.name !== "No Armor" &&
//           item.name !== "Leather Armor") ||
//         disabled
//       }
//     >
//       <Space direction="vertical">
//         <Typography.Text strong>{item.name}</Typography.Text>
//         <Typography.Text>{`Cost: ${item.costValue}${item.costCurrency}`}</Typography.Text>
//         <Typography.Text>{`AC: ${item.AC}`}</Typography.Text>
//         <Typography.Text>{`Weight: ${item.weight}`}</Typography.Text>
//       </Space>
//     </Radio>
//   );
// }
