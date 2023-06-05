import { Button, List, Space, Typography } from "antd";
import { EquipmentListProps } from "../types";

export default function EquipmentList({
  character,
  setCharacter,
  categories,
  handleAttack,
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
  return (
    <List
      dataSource={equipmentItems}
      size="small"
      renderItem={(item) => (
        <List.Item className="!block">
          <Typography.Paragraph className="font-bold">
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
            <div className="text-right">
              <Button type="primary">Attack</Button>
            </div>
          )}
        </List.Item>
      )}
    />
  );
}
