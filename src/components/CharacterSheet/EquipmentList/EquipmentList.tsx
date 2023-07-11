import { Button, List, Popconfirm, Typography, message } from "antd";
import { EquipmentListProps } from "./definitions";
import { EquipmentItem } from "../../EquipmentStore/definitions";
import { DeleteOutlined } from "@ant-design/icons";
import allEquipmentItems from "../../../data/equipment-items.json";
import { MouseEvent, useMemo } from "react";

const TextWithLabel = ({ label, value }: { label: string; value: any }) =>
  value && (
    <Typography.Text>
      <Typography.Text className="font-bold">{label}&nbsp;</Typography.Text>
      {value}
    </Typography.Text>
  );

export default function EquipmentList({
  character,
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
        .filter((item) => categories.includes(item.category))
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

  const confirm = (e?: MouseEvent<HTMLElement>) => {
    message.success("Click on Yes");
  };

  const cancel = (e?: MouseEvent<HTMLElement>) => {
    message.error("Click on No");
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
              <Popconfirm
                title="Remove custom item"
                description="Are you selling this item?"
                onConfirm={confirm}
                onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="default"
                  icon={<DeleteOutlined />}
                  shape="circle"
                />
              </Popconfirm>
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
