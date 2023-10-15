import { Divider, List, Typography } from "antd";
import { useMemo } from "react";
import { toTitleCase } from "../../../support/stringSupport";
import { getClassType } from "../../../support/helpers";
import {
  CharacterData,
  ClassNames,
  EquipmentItem,
} from "../../../data/definitions";
import RenderEquipmentList from "./RenderEquipmentList/RenderEquipmentList";

export default function EquipmentInventory({
  className,
  characterData,
}: { characterData: CharacterData } & React.ComponentPropsWithRef<"div">) {
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
        {characterData.equipment
          .reduce((total: number, item: EquipmentItem) => {
            return total + (item.weight || 0) * item.amount;
          }, 0)
          .toFixed(2)}
      </Typography.Title>
      <Divider className="text-shipGray border-seaBuckthorn">
        Current Loadout
      </Divider>
      <div className="[&>*+*]:mt-8">
        {getClassType(characterData.class) !== "custom" && (
          <div>
            {/* STARTING EQUIPMENT */}
            <RenderEquipmentList
              classNames={characterData.class as ClassNames[]}
            />
          </div>
        )}
        {Object.entries(groupedEquipment).map(
          ([category, categoryItems]: [any, any]) => (
            <div key={category}>
              <List
                header={
                  <Typography.Title level={3} className="m-0 text-shipGray">
                    {toTitleCase(category.replaceAll("-", " "))}
                  </Typography.Title>
                }
                bordered
                dataSource={categoryItems.map(
                  (categoryItem: EquipmentItem) => ({
                    name: categoryItem.name,
                    amount: categoryItem.amount,
                  })
                )}
                renderItem={(item: EquipmentItem) => (
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
