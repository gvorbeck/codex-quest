import { Divider, List, Typography } from "antd";
import { EquipmentInventoryProps } from "./definitions";
import { useMemo } from "react";
import { EquipmentItem } from "../definitions";
import { toTitleCase } from "../../../support/stringSupport";
import { ClassNamesTwo, classes } from "../../../data/classes";

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
        <div>
          {/* STARTING EQUIPMENT */}
          {/* TODO remove repeated code */}
          <List
            header={
              <Typography.Title level={3} className="m-0 text-shipGray">
                Included w/ Class
              </Typography.Title>
            }
            bordered
            dataSource={classes[
              characterData.class as ClassNamesTwo
            ].startingEquipment?.map((item: EquipmentItem) => ({
              name: item.name,
              amount: item.amount,
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
