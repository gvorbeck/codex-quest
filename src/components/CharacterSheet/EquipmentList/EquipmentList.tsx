import { Button, List, Popconfirm, Tooltip, Typography, message } from "antd";
import { EquipmentListProps } from "./definitions";
import { EquipmentItem } from "../../EquipmentStore/definitions";
import { DeleteOutlined } from "@ant-design/icons";
import allEquipmentItems from "../../../data/equipment-items.json";
import { MouseEvent } from "react";

export default function EquipmentList({
  character,
  categories,
  handleAttack,
  setWeapon,
  showAttackModal,
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
        <List.Item className="!block">
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
              <Typography.Text>
                <Typography.Text className="font-bold">
                  Weight&nbsp;
                </Typography.Text>
                {item.weight}
              </Typography.Text>
            )}
            {item.size && (
              <Typography.Text>
                <Typography.Text className="font-bold">
                  Size&nbsp;
                </Typography.Text>
                {item.size}
              </Typography.Text>
            )}
            {item.amount && (
              <Typography.Text>
                <Typography.Text className="font-bold">
                  Amount&nbsp;
                </Typography.Text>
                {item.amount}
              </Typography.Text>
            )}
            {item.AC && (
              <Typography.Text>
                <Typography.Text className="font-bold">
                  AC&nbsp;
                </Typography.Text>
                {item.AC}
              </Typography.Text>
            )}
            {item.damage && (
              <Typography.Text>
                <Typography.Text className="font-bold">
                  Damage&nbsp;
                </Typography.Text>
                {item.damage}
              </Typography.Text>
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
