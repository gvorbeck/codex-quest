import { Descriptions } from "antd";
import { slugToTitleCase } from "../../../../../support/stringSupport";
import { ItemDescriptionProps } from "./definitions";

export default function ItemDescription({ item }: ItemDescriptionProps) {
  return (
    <Descriptions bordered size="small" column={1} className="flex-grow">
      {item.weight && (
        <Descriptions.Item label="Weight">{item.weight}</Descriptions.Item>
      )}
      {item.size && (
        <Descriptions.Item label="Size">{item.size}</Descriptions.Item>
      )}
      {item.amount && item.name !== "Punch" && item.name !== "Kick" && (
        <Descriptions.Item label="Amount">{item.amount}</Descriptions.Item>
      )}
      {item.AC && <Descriptions.Item label="AC">{item.AC}</Descriptions.Item>}
      {item.missileAC && (
        <Descriptions.Item label="Missile AC">
          {item.missileAC}
        </Descriptions.Item>
      )}
      {item.damage && (
        <Descriptions.Item label="Damage">{item.damage}</Descriptions.Item>
      )}
      <Descriptions.Item label="Category">
        {slugToTitleCase(item.category)}
      </Descriptions.Item>
    </Descriptions>
  );
}
