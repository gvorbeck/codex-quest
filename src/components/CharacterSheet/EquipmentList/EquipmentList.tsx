import { Button, Descriptions, Radio, Typography } from "antd";
import { EquipmentListProps, ItemDescriptionProps } from "./definitions";
import { EquipmentItem } from "../../EquipmentStore/definitions";
import { DeleteOutlined } from "@ant-design/icons";
import allEquipmentItems from "../../../data/equipment-items.json";
import { useMemo } from "react";

export default function EquipmentList({
  character,
  setCharacter,
  categories,
  handleAttack,
  setWeapon,
  showAttackModal,
  calculatedAC,
  setCalculatedAC,
  radios,
}: EquipmentListProps) {
  const equipmentItems = useMemo(() => {
    if (typeof categories === "string") {
      return character.equipment
        .filter((items) => items.category === categories)
        .sort((a, b) => a.name.localeCompare(b.name));
    } else {
      return character.equipment
        .filter((item) => {
          // Check if the item's category is in the categories array
          if (categories.includes(item.category)) {
            // Further filter based on name if the category is 'armor-and-shields'
            // This is being done because originally, there was an 'armor-and-shields' category that included both armor and shields
            if (item.category === "armor-and-shields") {
              if (categories.includes("armor")) {
                // Only include the item if its name includes 'Armor' (case insensitive)
                return item.name.toLowerCase().includes("armor");
              } else if (categories.includes("shields")) {
                // Only include the item if its name includes 'Shield' (case insensitive)
                return item.name.toLowerCase().includes("shield");
              }
            }
            // If the category is not 'armor-and-shields', include the item
            return true;
          }
          // If the item's category is not in the categories array, exclude the item
          return false;
        })
        .sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [character.equipment, categories]);

  const handleAttackClick = (item: EquipmentItem) => {
    if (setWeapon) {
      setWeapon(item);
    }
    if (showAttackModal) {
      showAttackModal();
    }
  };

  const handleCustomDelete = (item: EquipmentItem) => {
    const newEquipment = character.equipment.filter(
      (e) => e.name !== item.name
    );
    if (setCharacter) setCharacter({ ...character, equipment: newEquipment });
    else
      console.error("Cannot delete item because setCharacter is not defined");
  };

  const ItemDescription = ({
    item,
    hideAmount,
    hideTrash,
  }: ItemDescriptionProps) => {
    return (
      <>
        <div className="flex items-baseline gap-4">
          <Typography.Paragraph className="font-bold mb-3">
            {item.name}
          </Typography.Paragraph>
          {!hideTrash &&
            !allEquipmentItems.find((e) => e.name === item.name) && (
              <Button
                type="default"
                icon={<DeleteOutlined />}
                shape="circle"
                onClick={() => handleCustomDelete(item)}
              />
            )}
        </div>
        <Descriptions bordered size="small" column={1}>
          {item.weight && (
            <Descriptions.Item label="Weight">{item.weight}</Descriptions.Item>
          )}
          {item.size && (
            <Descriptions.Item label="Size">{item.size}</Descriptions.Item>
          )}
          {item.amount && !hideAmount && (
            <Descriptions.Item label="Amount">{item.amount}</Descriptions.Item>
          )}
          {item.AC && (
            <Descriptions.Item label="AC">{item.AC}</Descriptions.Item>
          )}
          {item.damage && (
            <Descriptions.Item label="Damage">{item.damage}</Descriptions.Item>
          )}
        </Descriptions>
        {handleAttack && (
          <>
            <div className="text-right mt-3">
              <Button type="primary" onClick={() => handleAttackClick(item)}>
                Attack
              </Button>
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <>
      {radios ? (
        <Radio.Group size="small" className="flex flex-col">
          <Radio value="11" className="block">
            <ItemDescription
              item={{
                name: "No armor",
                costValue: 0,
                costCurrency: "gp",
                category: categories.includes("armor") ? "armor" : "shield",
                weight: 0,
                amount: 1,
                AC: categories.includes("armor") ? 11 : 0,
              }}
              hideAmount
              hideTrash
            />
          </Radio>
          {equipmentItems.map((item) => (
            <Radio key={item.name} value={item.AC} className="block">
              <ItemDescription item={item} />
            </Radio>
          ))}
        </Radio.Group>
      ) : (
        <ul className="list-none p-0 m-0 [&>li+li]:mt-4 [&>li+li]:border-solid [&>li+li]:border-t [&>li+li]:border-t-gray-200 [&>li+li]:border-l-0 [&>li+li]:border-r-0 [&>li+li]:border-b-0 [&>li+li]:pt-4">
          {equipmentItems.map((item) => (
            <li>
              <ItemDescription item={item} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
