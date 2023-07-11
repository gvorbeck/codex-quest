import { Divider, List, Typography } from "antd";
import { EquipmentInventoryProps } from "./definitions";
import { useMemo } from "react";
import { EquipmentItem } from "../definitions";
import { toTitleCase } from "../../../support/stringSupport";

export default function EquipmentInventory({
  className,
  characterData,
}: EquipmentInventoryProps) {
  const groupedEquipment = useMemo(() => {
    return characterData.equipment.reduce(
      (grouped: Record<string, EquipmentItem[]>, item: EquipmentItem) => {
        (grouped[item.category] = grouped[item.category] || []).push(item);
        return grouped;
      },
      {}
    );
  }, [characterData.equipment]);
  return (
    <div className={`${className} sticky top-0 h-fit`}>
      <Typography.Title
        level={2}
        className="text-shipGray mt-4 mb-0 text-xl text-center"
      >
        Gold: {characterData.gold.toFixed(2)} | Weight:{" "}
        {characterData.weight.toFixed(2)}
      </Typography.Title>
      <Divider className="text-shipGray">Current Loadout</Divider>
      <div className="[&>*+*]:mt-8">
        {Object.entries(groupedEquipment).map(
          ([category, categoryItems]: [string, EquipmentItem[]]) => (
            <div key={category}>
              <List
                header={
                  <Typography.Title level={3} className="m-0 text-shipGray">
                    {toTitleCase(category.replaceAll("-", " "))}
                  </Typography.Title>
                }
                bordered
                dataSource={categoryItems.map((categoryItem) => ({
                  name: categoryItem.name,
                  amount: categoryItem.amount,
                }))}
                renderItem={(item) => (
                  <List.Item className="text-shipGray">
                    <span>{item.name}</span>
                    <span>x{item.amount}</span>
                  </List.Item>
                )}
                size="small"
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}
// import { Typography } from "antd";
// import { useMemo } from "react";
// import { PurchasedEquipmentProps, EquipmentItem } from "../types";
// import { toTitleCase } from "../formatters";

// export default function PurchasedEquipment({
//   characterData,
//   weightRestrictions,
// }: PurchasedEquipmentProps) {
//   const groupedEquipment = useMemo(() => {
//     return characterData.equipment.reduce(
//       (grouped: Record<string, EquipmentItem[]>, item: EquipmentItem) => {
//         (grouped[item.category] = grouped[item.category] || []).push(item);
//         return grouped;
//       },
//       {}
//     );
//   }, [characterData.equipment]);

//   return (
//     <section>
//       <header>
//         <Typography.Title
//           level={2}
//           className="text-shipGray mt-4 mb-0 text-xl text-center"
//         >
//           Gold: {characterData.gold.toFixed(2)} | Weight:{" "}
//           {characterData.weight.toFixed(2)}
//         </Typography.Title>
//         <Typography.Text type="secondary" className="text-center block">
//           Max weight: {weightRestrictions.heavy}{" "}
//           {characterData.weight > weightRestrictions.light &&
//             "/ Heavily Loaded!"}
//         </Typography.Text>
//       </header>
//       <div>
//         {Object.entries(groupedEquipment).map(
//           ([category, items]: [string, EquipmentItem[]]) => (
//             <div key={category}>
//               <Typography.Title level={3}>
//                 {toTitleCase(category.replaceAll("-", " "))}
//               </Typography.Title>
//               {items.map((item: EquipmentItem) => (
//                 <div key={item.name}>
//                   {item.name} x{item.amount}
//                 </div>
//               ))}
//             </div>
//           )
//         )}
//       </div>
//     </section>
//   );
// }
