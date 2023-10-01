import { Descriptions, Typography } from "antd";
import { EquipmentItem } from "../../../data/definitions";

export default function EquipmentItemDescription({
  item,
}: {
  item: EquipmentItem;
}) {
  return (
    <>
      <Typography.Text strong>{item.name}</Typography.Text>
      <Descriptions bordered size="small" column={2} className="flex-grow mt-2">
        <Descriptions.Item label="Cost">
          {`${item.costValue}${item.costCurrency}`}
        </Descriptions.Item>
        {item.weight && (
          <Descriptions.Item label="Weight">{item.weight}</Descriptions.Item>
        )}
        {item.size && (
          <Descriptions.Item label="Size">{item.size}</Descriptions.Item>
        )}
        {item.AC && <Descriptions.Item label="AC">{item.AC}</Descriptions.Item>}
        {item.damage && (
          <Descriptions.Item label="Damage">{item.damage}</Descriptions.Item>
        )}
      </Descriptions>
    </>
  );
}
