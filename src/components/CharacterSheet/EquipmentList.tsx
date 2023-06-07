import { Button, List, Modal, Space, Typography } from "antd";
import { EquipmentListProps } from "../types";
import { useState } from "react";

export default function EquipmentList({
  character,
  setCharacter,
  categories,
  handleAttack,
  attackBonus,
}: EquipmentListProps) {
  const [isAttackModalOpen, setIsAttackModalOpen] = useState(false);

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

  const showAttackModal = () => {
    setIsAttackModalOpen(true);
  };

  const handleCancel = () => {
    setIsAttackModalOpen(false);
  };

  const attack = () => {
    console.log("attack", attackBonus);
    showAttackModal();
  };
  return (
    <List
      dataSource={equipmentItems}
      size="small"
      renderItem={(item) => (
        <List.Item className="!block">
          <Typography.Paragraph className="font-bold mb-3">
            {item.name}
          </Typography.Paragraph>
          <Space direction="horizontal" className="!flex italic justify-end">
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
          </Space>
          {handleAttack && (
            <>
              <div className="text-right mt-3">
                <Button type="primary" onClick={attack}>
                  Attack
                </Button>
              </div>
              <Modal
                title="Basic Modal"
                open={isAttackModalOpen}
                onCancel={handleCancel}
                footer={false}
              >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
              </Modal>
            </>
          )}
        </List.Item>
      )}
    />
  );
}
