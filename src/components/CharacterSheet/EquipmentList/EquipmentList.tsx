import { Button, List, Typography } from "antd";
import { EquipmentListProps } from "./definitions";
import { EquipmentItem } from "../../EquipmentStore/definitions";
import { DeleteOutlined } from "@ant-design/icons";
import allEquipmentItems from "../../../data/equipment-items.json";
import { useMemo } from "react";

const TextWithLabel = ({ label, value }: { label: string; value: any }) =>
  value && (
    <Typography.Text>
      <Typography.Text className="font-bold">{label}&nbsp;</Typography.Text>
      {value}
    </Typography.Text>
  );

export default function EquipmentList({
  character,
  setCharacter,
  categories,
  handleAttack,
  setWeapon,
  showAttackModal,
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

  return (
    <List
      dataSource={equipmentItems}
      size="small"
      renderItem={(item) => (
        <List.Item className="block">
          <div className="flex items-baseline gap-4">
            <Typography.Paragraph className="font-bold mb-3">
              {item.name}
            </Typography.Paragraph>
            {!allEquipmentItems.find((e) => e.name === item.name) && (
              <Button
                type="default"
                icon={<DeleteOutlined />}
                shape="circle"
                onClick={() => handleCustomDelete(item)}
              />
            )}
          </div>
          <div className="flex flex-col text-right italic">
            {item.weight && (
              <TextWithLabel label="Weight" value={item.weight} />
            )}
            {item.size && <TextWithLabel label="Size" value={item.size} />}
            {item.amount && (
              <TextWithLabel label="Amount" value={item.amount} />
            )}
            {item.AC && <TextWithLabel label="AC" value={item.AC} />}
            {item.damage && (
              <TextWithLabel label="Damage" value={item.damage} />
            )}
          </div>
          {handleAttack && (
            <>
              <div className="text-right mt-3">
                <Button type="primary" onClick={() => handleAttackClick(item)}>
                  Attack
                </Button>
              </div>
            </>
          )}
        </List.Item>
      )}
    />
  );
}
