import { Divider, List, Typography } from "antd";
import { EquipmentInventoryProps } from "./definitions";
import { useMemo } from "react";
import { EquipmentItem } from "../definitions";
import { toTitleCase } from "../../../support/stringSupport";
import { ClassNamesTwo, classes } from "../../../data/classes";
import { getClassType } from "../../../support/helpers";

const renderEquipmentList = (classNameArray: ClassNamesTwo[]) => {
  return classNameArray.map(
    (classValue: ClassNamesTwo) =>
      classes[classValue].startingEquipment && (
        <List
          header={
            <Typography.Title level={3} className="m-0 text-shipGray">
              Included w/ {classValue}
            </Typography.Title>
          }
          bordered
          dataSource={classes[classValue].startingEquipment?.map(
            (item: EquipmentItem) => ({
              name: item.name,
              amount: item.amount,
            })
          )}
          renderItem={(item) => (
            <List.Item className="text-shipGray">
              <span>{item.name}</span>
              <span>x{item.amount}</span>
            </List.Item>
          )}
          size="small"
          key={classValue}
        />
      )
  );
};

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
        {characterData.equipment
          .reduce((total, item) => {
            return total + (item.weight || 0) * item.amount;
          }, 0)
          .toFixed(2)}
      </Typography.Title>
      <Divider className="text-shipGray">Current Loadout</Divider>
      <div className="[&>*+*]:mt-8">
        {getClassType(characterData.class) !== "custom" && (
          <div>
            {/* STARTING EQUIPMENT */}
            {renderEquipmentList(characterData.class as ClassNamesTwo[])}
          </div>
        )}
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
