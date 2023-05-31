import { Radio, Space, Typography } from "antd";
import { EquipmentItem } from "../types";

export default function EquipmentRadio({ item }: { item: EquipmentItem }) {
  return (
    <Radio value={item.name}>
      <Space direction="vertical">
        <Typography.Text strong>{item.name}</Typography.Text>
        <Typography.Text>{`Cost: ${item.costValue}${item.costCurrency}`}</Typography.Text>
        <Typography.Text>{`AC: ${item.AC}`}</Typography.Text>
        <Typography.Text>{`Weight: ${item.weight}`}</Typography.Text>
      </Space>
    </Radio>
  );
}
